import { BaseService } from "medusa-interfaces";
import { EntityManager } from "typeorm";
import { DeepPartial } from "typeorm/common/DeepPartial";
import { LineItemTaxLine } from "../models";
import { Cart } from "../models/cart";
import { LineItem } from "../models/line-item";
import { CartRepository } from "../repositories/cart";
import { LineItemRepository } from "../repositories/line-item";
import { LineItemTaxLineRepository } from "../repositories/line-item-tax-line";
import { FindConfig } from "../types/common";
import { FlagRouter } from "../utils/flag-router";
import { PricingService, ProductService, ProductVariantService, RegionService } from "./index";
import LineItemAdjustmentService from "./line-item-adjustment";
declare type InjectedDependencies = {
    manager: EntityManager;
    lineItemRepository: typeof LineItemRepository;
    lineItemTaxLineRepository: typeof LineItemTaxLineRepository;
    cartRepository: typeof CartRepository;
    productVariantService: ProductVariantService;
    productService: ProductService;
    pricingService: PricingService;
    regionService: RegionService;
    lineItemAdjustmentService: LineItemAdjustmentService;
    featureFlagRouter: FlagRouter;
};
/**
 * Provides layer to manipulate line items.
 * @extends BaseService
 */
declare class LineItemService extends BaseService {
    protected readonly manager_: EntityManager;
    protected readonly lineItemRepository_: typeof LineItemRepository;
    protected readonly itemTaxLineRepo_: typeof LineItemTaxLineRepository;
    protected readonly cartRepository_: typeof CartRepository;
    protected readonly productVariantService_: ProductVariantService;
    protected readonly productService_: ProductService;
    protected readonly pricingService_: PricingService;
    protected readonly regionService_: RegionService;
    protected readonly featureFlagRouter_: FlagRouter;
    protected readonly lineItemAdjustmentService_: LineItemAdjustmentService;
    constructor({ manager, lineItemRepository, lineItemTaxLineRepository, productVariantService, productService, pricingService, regionService, cartRepository, lineItemAdjustmentService, featureFlagRouter, }: InjectedDependencies);
    withTransaction(transactionManager: EntityManager): LineItemService;
    list(selector: any, config?: FindConfig<LineItem>): Promise<LineItem[]>;
    /**
     * Retrieves a line item by its id.
     * @param {string} id - the id of the line item to retrieve
     * @param {object} config - the config to be used at query building
     * @return {Promise<LineItem | never>} the line item
     */
    retrieve(id: string, config?: {}): Promise<LineItem | never>;
    /**
     * Creates return line items for a given cart based on the return items in a
     * return.
     * @param {string} returnId - the id to generate return items from.
     * @param {string} cartId - the cart to assign the return line items to.
     * @return {Promise<LineItem[]>} the created line items
     */
    createReturnLines(returnId: string, cartId: string): Promise<LineItem[]>;
    generate(variantId: string, regionId: string, quantity: number, context?: {
        unit_price?: number;
        includes_tax?: boolean;
        metadata?: Record<string, unknown>;
        customer_id?: string;
        cart?: Cart;
    }): Promise<LineItem>;
    /**
     * Create a line item
     * @param {Partial<LineItem>} data - the line item object to create
     * @return {Promise<LineItem>} the created line item
     */
    create(data: Partial<LineItem>): Promise<LineItem>;
    /**
     * Updates a line item
     * @param {string} id - the id of the line item to update
     * @param {Partial<LineItem>} data - the properties to update on line item
     * @return {Promise<LineItem>} the update line item
     */
    update(id: string, data: Partial<LineItem>): Promise<LineItem>;
    /**
     * Deletes a line item.
     * @param {string} id - the id of the line item to delete
     * @return {Promise<LineItem | undefined>} the result of the delete operation
     */
    delete(id: string): Promise<LineItem | undefined>;
    /**
     * Create a line item tax line.
     * @param args - tax line partial passed to the repo create method
     * @return a new line item tax line
     */
    createTaxLine(args: DeepPartial<LineItemTaxLine>): LineItemTaxLine;
}
export default LineItemService;
