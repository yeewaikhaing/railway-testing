import { BaseService } from "medusa-interfaces";
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import { default as MedusaPaymentProviderService} from "@medusajs/medusa/dist/services/payment-provider";
import { PaymentSessionRepository } from "../repositories/paymentSession.repository";
import { PaymentProviderRepository } from "../repositories/paymentProvider.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import { RefundRepository } from "../../refund/repositories/refund.repository";
import  BasePaymentService  from "medusa-interfaces";
import {AbstractPaymentService} from "@medusajs/medusa/dist/interfaces";
import { PaymentSession } from "../entities/paymentSession.entity";
import { MedusaError } from "medusa-core-utils"
import { Cart } from "../../cart/entities/cart.entity";
import { Payment } from "../entities/payment.entity";

type PaymentProviderKey = `pp_${string}` | "systemPaymentProviderService"

type InjectedDependencies = {
    manager: EntityManager
    paymentSessionRepository: typeof PaymentSessionRepository
    paymentProviderRepository: typeof PaymentProviderRepository
    paymentRepository: typeof PaymentRepository
    refundRepository: typeof RefundRepository
  } & {
    [key in `${PaymentProviderKey}`]:
      | AbstractPaymentService
      | typeof BasePaymentService
  }
  

@Service({override: MedusaPaymentProviderService})
export class PaymentProviderService extends MedusaPaymentProviderService {
    static resolutionKey = 'paymentProviderService';

    private readonly manager: EntityManager;
    private readonly container: InjectedDependencies;
    private readonly paymentProviderRepository: typeof PaymentProviderRepository;

    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.container = container;
        this.manager = container.manager;
        this.paymentProviderRepository = container.paymentProviderRepository;
    }

    async retrievePayment(
      id: string,
      relations: string[] = []
    ): Promise<Payment | never> {
      const paymentRepo = this.manager.getCustomRepository(
        this.container.paymentRepository
      )
      const query = {
        where: { id },
        relations: [] as string[],
      }
  
      if (relations.length) {
        query.relations = relations
      }
  
      const payment = await paymentRepo.findOne(query)
  
      if (!payment) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Payment with ${id} was not found`
        )
      }
  
      return payment
    }

    
    async cancelPayment(
      paymentObj: Partial<Payment> & { id: string }
    ): Promise<Payment> {
      return await this.atomicPhase_(async (transactionManager) => {
        const payment = await this.retrievePayment(paymentObj.id)
        const provider = this.retrieveProvider(payment.provider_id)
        payment.data = await provider
          .withTransaction(transactionManager)
          .cancelPayment(payment)
  
        const now = new Date()
        payment.canceled_at = now.toISOString()
  
        const paymentRepo = transactionManager.getCustomRepository(
          this.container.paymentRepository
        )
        return await paymentRepo.save(payment)
      })
    }
  
    
    
    async deleteSession(
      paymentSession: PaymentSession
    ): Promise<PaymentSession | undefined> {
      return await this.atomicPhase_(async (transactionManager) => {
        const session = await this.retrieveSession(paymentSession.id).catch(
          () => void 0
        )
        //const session = await this.retrieveSession(paymentSession.id)
        if (!session) {
          return
        }
  
        const provider = this.retrieveProvider(paymentSession.provider_id)
        await provider
          .withTransaction(transactionManager)
          .deletePayment(paymentSession)
  
        const sessionRepo = transactionManager.getCustomRepository(
          this.container.paymentSessionRepository
        )
      
      await sessionRepo.remove(session);
      return session;
      })
    }
  
      async retrieveSession(
        id: string,
        relations: string[] = []
      ): Promise<PaymentSession | never> {
        const sessionRepo = this.manager.getCustomRepository(
          this.container.paymentSessionRepository
        )
    
        const query = {
          where: { id },
          relations: [] as string[],
        }
    
        if (relations.length) {
          query.relations = relations
        }
    
        const session = await sessionRepo.findOne(query)
    
        if (!session) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Payment Session with ${id} was not found`
          )
        }
    
        return session
      }
    
     
    
    async updatePayment(
      paymentId: string,
      data: { order_id?: string; swap_id?: string }
    ): Promise<Payment> {
      return await this.atomicPhase_(async (transactionManager) => {
        const payment = await this.retrievePayment(paymentId)
  
        if (data?.order_id) {
          payment.order_id = data.order_id
        }
  
        if (data?.swap_id) {
          payment.swap_id = data.swap_id
        }
  
        const payRepo = transactionManager.getCustomRepository(
          this.container.paymentRepository
        )
        return await payRepo.save(payment)
      })
    }
  
    /**
   * Updates an existing payment session.
   * @param paymentSession - the payment session object to
   *    update
   * @param cart - the cart object to update for
   * @return the updated payment session
   */
  async updateSession(
    paymentSession: PaymentSession,
    cart: Cart
  ): Promise<PaymentSession> {
    return await this.atomicPhase_(async (transactionManager) => {
      const session = await this.retrieveSession(paymentSession.id)
      const provider = this.retrieveProvider(paymentSession.provider_id)
     // console.log("session in updateSession() =>", session);
      
      session.data = await provider
        .withTransaction(transactionManager)
        .updatePayment(paymentSession.data, cart)

      const sessionRepo = transactionManager.getCustomRepository(
        this.container.paymentSessionRepository
      )
      return await sessionRepo.save(session)
    })
  }

  async updateSessionData(
    paymentSession: PaymentSession,
    data: Record<string, unknown>
  ): Promise<PaymentSession> {
    return await this.atomicPhase_(async (transactionManager) => {
      const session = await this.retrieveSession(paymentSession.id)

     // console.log("session => ", session);
      
      const provider = this.retrieveProvider(paymentSession.provider_id)

     
      session.data = await provider
        .withTransaction(transactionManager)
        .updatePaymentData(paymentSession.data, data)
      
        session.status = paymentSession.status

      const sessionRepo = transactionManager.getCustomRepository(
        this.container.paymentSessionRepository
      )
      return await sessionRepo.save(session)
    })
  }

    /**
   * Creates a payment session with the given provider.
   * @param providerId - the id of the provider to create payment with
   * @param cart - a cart object used to calculate the amount, etc. from
   * @return the payment session
   */
  async createSession(providerId: string, cart: Cart): Promise<PaymentSession> {
    return await this.atomicPhase_(async (transactionManager) => {
      const provider = this.retrieveProvider(providerId)
      const sessionData = await provider
        .withTransaction(transactionManager)
        .createPayment(cart)

      const sessionRepo = transactionManager.getCustomRepository(
        this.container.paymentSessionRepository
      )

      const toCreate = {
        cart_id: cart.id,
        provider_id: providerId,
        data: sessionData,
        status: "pending",
      }

      const created = sessionRepo.create(toCreate)
      return await sessionRepo.save(created)
    })
  }

}