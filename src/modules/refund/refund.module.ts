import { Module } from 'medusa-extender';
import { RefundService } from './services/refund.service';
import { RefundRepository } from './repositories/refund.repository';
import { Refund } from './entities/refund.entity';

@Module({
    imports: [Refund, RefundRepository, RefundService]
})
export class RefundModule {}