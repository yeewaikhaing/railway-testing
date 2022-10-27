import { Module } from 'medusa-extender';
import { CartService } from './services/cart.service';
import { CartRouter } from './routers/cart.router';
import { CartRepository } from './repositories/cart.repository';
import { Cart } from './entities/cart.entity';

@Module({
    imports: [
        Cart, 
        CartRepository, 
        CartRouter, 
        CartService
    ]
})
export class CartModule {}