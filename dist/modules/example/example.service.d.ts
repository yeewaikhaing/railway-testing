import { BaseService } from "medusa-interfaces";
import { EntityManager } from 'typeorm';
declare type InjectedDependencies = {
    manager: EntityManager;
};
export declare class ExampleService extends BaseService {
    private readonly config;
    static resolutionKey: string;
    private readonly manager;
    constructor({ manager }: InjectedDependencies, config: any);
}
export {};
