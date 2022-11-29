import { Module } from 'medusa-extender';
import { CustomizedPaymentMigration1669710778816 } from './migrations/customizedPayment.migration';
import { PaymentProviderRepository } from './repositories/paymentProvider.repository';
import { PaymentProviderService } from './services/paymentProvider.service';
import { PaymentSession } from './entities/paymentSession.entity';
import { PaymentCollection } from './entities/paymentCollection.entity';
import { PaymentCollectionRepository } from './repositories/paymentCollection.repository';
import { PaymentSessionRepository } from './repositories/paymentSession.repository';
import { PaymentCollectionService } from './services/paymentCollection.service';
import { PaymentRepository } from './repositories/payment.repository';
import { Payment } from './entities/payment.entity';

@Module({
    imports: 
    [
        Payment, 
        PaymentRepository, 
        PaymentCollectionService, 
        PaymentSessionRepository, 
        PaymentCollectionRepository, 
        PaymentCollection, 
        PaymentSession, 
        PaymentProviderService, 
        PaymentProviderRepository
    ]
})
export class PaymentModule {}