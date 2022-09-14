import { BaseService } from "medusa-interfaces";
      import { Service } from 'medusa-extender';
      import { EntityManager } from 'typeorm';
      
      type InjectedDependencies = {
          manager: EntityManager;
      };
      
      @Service()
      export class VendorService extends BaseService {
      	static resolutionKey = 'vendorService';
      	
      	private readonly manager: EntityManager;
	
          constructor({ manager }: InjectedDependencies, private readonly config: any) {
          	super();
          	
          	this.manager = manager;
          }
      }