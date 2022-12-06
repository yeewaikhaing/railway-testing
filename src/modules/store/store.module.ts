import { Module } from 'medusa-extender';
import { StoreRouter } from './routers/store.router';
import { CustomStoreMigration1665451262975 } from './migrations/customStore.migration';
import { Store } from './entities/store.entity';
import StoreRepository from './repositories/store.repository';
import StoreService from './services/store.service';
@Module({
    imports: [Store, StoreRepository, StoreService, CustomStoreMigration1665451262975, StoreRouter],
})
export class StoreModule {}