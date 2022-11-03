import { Module } from 'medusa-extender';
import { LineItemTaxLineRepository } from './repositories/lineItemTaxLine.repository';
import { LineItemTaxLine } from './entities/lineItemTaxLine.entity';
import { LineItemService } from './services/lineItem.service';
import { LineItemRouter } from './routers/lineItem.router';
import { LineItemRepository } from './repositories/lineItem.repository';
import { LineItem } from './entities/lineItem.entity';

@Module({
    imports: [
        LineItem, 
        LineItemRepository, 
        LineItemRouter, 
        LineItemService, 
        LineItemTaxLine, 
        LineItemTaxLineRepository, 
        
    ]
})
export class LineItemModule {}