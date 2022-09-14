import { Connection, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { Product } from '../entities/product.entity';
export default class ProductSubscriber implements EntitySubscriberInterface<Product> {
    static attachTo(connection: Connection): void;
    listenTo(): typeof Product;
    beforeInsert(event: InsertEvent<Product>): Promise<void>;
}
