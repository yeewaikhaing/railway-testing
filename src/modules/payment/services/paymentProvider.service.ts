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
import { Refund } from "../../refund/entities/refund.entity";
import { FindConfig } from "@medusajs/medusa/dist/types/common";

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

    async refundPayment(
      payObjs: Payment[],
      amount: number,
      reason: string,
      note?: string
    ): Promise<Refund> {
      return await this.atomicPhase_(async (transactionManager) => {
        const payments = await this.listPayments({
          id: payObjs.map((p) => p.id),
        })
  
        let order_id!: string
        const refundable = payments.reduce((acc, next) => {
          order_id = next.order_id
          if (next.captured_at) {
            return (acc += next.amount - next.amount_refunded)
          }
  
          return acc
        }, 0)
  
        if (refundable < amount) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Refund amount is higher that the refundable amount"
          )
        }
  
        let balance = amount
  
        const used: string[] = []
  
        const paymentRepo = transactionManager.getCustomRepository(
          this.container.paymentRepository
        )
        let paymentToRefund = payments.find(
          (payment) => payment.amount - payment.amount_refunded > 0
        )
  
        while (paymentToRefund) {
          const currentRefundable =
            paymentToRefund.amount - paymentToRefund.amount_refunded
  
          const refundAmount = Math.min(currentRefundable, balance)
  
          const provider = this.retrieveProvider(paymentToRefund.provider_id)
          paymentToRefund.data = await provider
            .withTransaction(transactionManager)
            .refundPayment(paymentToRefund, refundAmount)
  
          paymentToRefund.amount_refunded += refundAmount
          await paymentRepo.save(paymentToRefund)
  
          balance -= refundAmount
  
          used.push(paymentToRefund.id)
  
          if (balance > 0) {
            paymentToRefund = payments.find(
              (payment) =>
                payment.amount - payment.amount_refunded > 0 &&
                !used.includes(payment.id)
            )
          } else {
            paymentToRefund = undefined
          }
        }
  
        const refundRepo = transactionManager.getCustomRepository(
          this.container.refundRepository
        )
  
        const toCreate = {
          order_id,
          amount,
          reason,
          note,
        }
  
        const created = refundRepo.create(toCreate)
        return await refundRepo.save(created)
      })
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

    async capturePayment(
      paymentObj: Partial<Payment> & { id: string }
    ): Promise<Payment> {
      return await this.atomicPhase_(async (transactionManager) => {
        const payment = await this.retrievePayment(paymentObj.id)
        const provider = this.retrieveProvider(payment.provider_id)
        payment.data = await provider
          .withTransaction(transactionManager)
          .capturePayment(payment)
  
        const now = new Date()
        payment.captured_at = now.toISOString()
  
        const paymentRepo = transactionManager.getCustomRepository(
          this.container.paymentRepository
        )
        return await paymentRepo.save(payment)
      })
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
   
    /**
   * Gets an Payment by cart id.
   * @param cartId - cart id to find order
   * @param config - the config to be used to find order
   * @return the order document
   */
  async retrieveByCartIdAndOrderId(
    cartId: string,
    orderId: string
  ):  Promise<Payment | never> {
    const paymentRepo = this.manager.getCustomRepository(this.container.paymentRepository)

    const query = {
      where: { 
        cart_id: cartId,
        order_id: orderId
      },
    } as FindConfig<Payment>

    const payment = await paymentRepo.findOne(query)

    if (!payment) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Payment with cart id: ${cartId} & order id: ${orderId} was not found`
      )
    }

    return payment;
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
      data: { 
        order_id?: string; 
        swap_id?: string;
        payment_type?: string;
        payment_proof?: string;
      }
    ): Promise<Payment> {
      return await this.atomicPhase_(async (transactionManager) => {
        const payment = await this.retrievePayment(paymentId)
  
        if (data?.order_id) {
          payment.order_id = data.order_id
        }
  
        if (data?.swap_id) {
          payment.swap_id = data.swap_id
        }

        if(data?.payment_type) {
          payment.payment_type = data.payment_type
        }

        if(data?.payment_proof) {
          payment.payment_proof = data.payment_proof;
          payment.payment_transferred_at = new Date().toISOString()
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