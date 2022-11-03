import { Module } from 'medusa-extender';
import { LineItemService } from './services/lineItem.service';
import { LineItemRouter } from './routers/lineItem.router';
import { LineItemRepository } from './repositories/lineItem.repository';
import { LineItem } from './entities/lineItem.entity';

@Module({
    imports: [LineItem, LineItemRepository, LineItemRouter, LineItemService]
})
export class LineItemModule {}