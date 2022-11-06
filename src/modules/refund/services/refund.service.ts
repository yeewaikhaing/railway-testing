import { BaseService } from "medusa-interfaces";
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
//import { RefundService as MedusaRefundService} from "@medusajs/medusa/dist/services/re"

type InjectedDependencies = {
    manager: EntityManager;
};

@Service()
export class RefundService extends BaseService {
    static resolutionKey = 'refundService';

    private readonly manager: EntityManager;

    constructor({ manager }: InjectedDependencies, private readonly config: any) {
    super();
    
    this.manager = manager;
    }
}