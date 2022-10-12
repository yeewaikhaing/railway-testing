"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var medusa_core_utils_1 = require("medusa-core-utils");
var typeorm_1 = require("typeorm");
var interfaces_1 = require("../interfaces");
var models_1 = require("../models");
var utils_1 = require("../utils");
var OrderService = /** @class */ (function (_super) {
    __extends(OrderService, _super);
    function OrderService(_a) {
        var manager = _a.manager, orderRepository = _a.orderRepository, customerService = _a.customerService, paymentProviderService = _a.paymentProviderService, shippingOptionService = _a.shippingOptionService, shippingProfileService = _a.shippingProfileService, discountService = _a.discountService, fulfillmentProviderService = _a.fulfillmentProviderService, fulfillmentService = _a.fulfillmentService, lineItemService = _a.lineItemService, totalsService = _a.totalsService, regionService = _a.regionService, cartService = _a.cartService, addressRepository = _a.addressRepository, giftCardService = _a.giftCardService, draftOrderService = _a.draftOrderService, inventoryService = _a.inventoryService, eventBusService = _a.eventBusService;
        var _this = 
        // eslint-disable-next-line prefer-rest-params
        _super.call(this, arguments[0]) || this;
        _this.manager_ = manager;
        _this.orderRepository_ = orderRepository;
        _this.customerService_ = customerService;
        _this.paymentProviderService_ = paymentProviderService;
        _this.shippingProfileService_ = shippingProfileService;
        _this.fulfillmentProviderService_ = fulfillmentProviderService;
        _this.lineItemService_ = lineItemService;
        _this.totalsService_ = totalsService;
        _this.regionService_ = regionService;
        _this.fulfillmentService_ = fulfillmentService;
        _this.discountService_ = discountService;
        _this.giftCardService_ = giftCardService;
        _this.eventBus_ = eventBusService;
        _this.shippingOptionService_ = shippingOptionService;
        _this.cartService_ = cartService;
        _this.addressRepository_ = addressRepository;
        _this.draftOrderService_ = draftOrderService;
        _this.inventoryService_ = inventoryService;
        return _this;
    }
    /**
     * @param selector the query object for find
     * @param config the config to be used for find
     * @return the result of the find operation
     */
    OrderService.prototype.list = function (selector, config) {
        if (config === void 0) { config = {
            skip: 0,
            take: 50,
            order: { created_at: "DESC" },
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var orderRepo, query, _a, select, relations, totalsToSelect, raw;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        orderRepo = this.manager_.getCustomRepository(this.orderRepository_);
                        query = (0, utils_1.buildQuery)(selector, config);
                        _a = this.transformQueryForTotals(config), select = _a.select, relations = _a.relations, totalsToSelect = _a.totalsToSelect;
                        if (select && select.length) {
                            query.select = select;
                        }
                        if (relations && relations.length) {
                            query.relations = relations;
                        }
                        return [4 /*yield*/, orderRepo.find(query)];
                    case 1:
                        raw = _b.sent();
                        return [4 /*yield*/, Promise.all(raw.map(function (r) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.decorateTotals(r, totalsToSelect)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); }))];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     * @param {Object} selector - the query object for find
     * @param {Object} config - the config to be used for find
     * @return {Promise} the result of the find operation
     */
    OrderService.prototype.listAndCount = function (selector, config) {
        if (config === void 0) { config = {
            skip: 0,
            take: 50,
            order: { created_at: "DESC" },
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var orderRepo, q, query, where_1, _a, select, relations, totalsToSelect, rels, raw, count, orders;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        orderRepo = this.manager_.getCustomRepository(this.orderRepository_);
                        if (selector.q) {
                            q = selector.q;
                            delete selector.q;
                        }
                        query = (0, utils_1.buildQuery)(selector, config);
                        if (q) {
                            where_1 = query.where;
                            delete where_1.display_id;
                            delete where_1.email;
                            query.join = {
                                alias: "order",
                                innerJoin: {
                                    shipping_address: "order.shipping_address",
                                },
                            };
                            query.where = function (qb) {
                                qb.where(where_1);
                                qb.andWhere(new typeorm_1.Brackets(function (qb) {
                                    qb.where("shipping_address.first_name ILIKE :qfn", {
                                        qfn: "%".concat(q, "%"),
                                    })
                                        .orWhere("order.email ILIKE :q", { q: "%".concat(q, "%") })
                                        .orWhere("display_id::varchar(255) ILIKE :dId", { dId: "".concat(q) });
                                }));
                            };
                        }
                        _a = this.transformQueryForTotals(config), select = _a.select, relations = _a.relations, totalsToSelect = _a.totalsToSelect;
                        if (select && select.length) {
                            query.select = select;
                        }
                        rels = relations;
                        delete query.relations;
                        return [4 /*yield*/, orderRepo.findWithRelations(rels, query)];
                    case 1:
                        raw = _b.sent();
                        return [4 /*yield*/, orderRepo.count(query)];
                    case 2:
                        count = _b.sent();
                        return [4 /*yield*/, Promise.all(raw.map(function (r) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.decorateTotals(r, totalsToSelect)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); }))];
                    case 3:
                        orders = _b.sent();
                        return [2 /*return*/, [orders, count]];
                }
            });
        });
    };
    OrderService.prototype.transformQueryForTotals = function (config) {
        var select = config.select, relations = config.relations;
        if (!select) {
            return {
                select: select,
                relations: relations,
                totalsToSelect: [],
            };
        }
        var totalFields = [
            "subtotal",
            "tax_total",
            "shipping_total",
            "discount_total",
            "gift_card_total",
            "total",
            "paid_total",
            "refunded_total",
            "refundable_amount",
            "items.refundable",
            "swaps.additional_items.refundable",
            "claims.additional_items.refundable",
        ];
        var totalsToSelect = select.filter(function (v) { return totalFields.includes(v); });
        if (totalsToSelect.length > 0) {
            var relationSet = new Set(relations);
            relationSet.add("items");
            relationSet.add("items.tax_lines");
            relationSet.add("items.adjustments");
            relationSet.add("swaps");
            relationSet.add("swaps.additional_items");
            relationSet.add("swaps.additional_items.tax_lines");
            relationSet.add("swaps.additional_items.adjustments");
            relationSet.add("claims");
            relationSet.add("claims.additional_items");
            relationSet.add("claims.additional_items.tax_lines");
            relationSet.add("claims.additional_items.adjustments");
            relationSet.add("discounts");
            relationSet.add("discounts.rule");
            relationSet.add("gift_cards");
            relationSet.add("gift_card_transactions");
            relationSet.add("refunds");
            relationSet.add("shipping_methods");
            relationSet.add("shipping_methods.tax_lines");
            relationSet.add("region");
            relations = __spreadArray([], __read(relationSet), false);
            select = select.filter(function (v) { return !totalFields.includes(v); });
        }
        var toSelect = __spreadArray([], __read(select), false);
        if (toSelect.length > 0 && toSelect.indexOf("tax_rate") === -1) {
            toSelect.push("tax_rate");
        }
        return {
            relations: relations,
            select: toSelect,
            totalsToSelect: totalsToSelect,
        };
    };
    /**
     * Gets an order by id.
     * @param orderId - id of order to retrieve
     * @param config - config of order to retrieve
     * @return the order document
     */
    OrderService.prototype.retrieve = function (orderId, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var orderRepo, _a, select, relations, totalsToSelect, query, rels, raw;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        orderRepo = this.manager_.getCustomRepository(this.orderRepository_);
                        _a = this.transformQueryForTotals(config), select = _a.select, relations = _a.relations, totalsToSelect = _a.totalsToSelect;
                        query = {
                            where: { id: orderId },
                        };
                        if (relations && relations.length > 0) {
                            query.relations = relations;
                        }
                        if (select && select.length > 0) {
                            query.select = select;
                        }
                        rels = query.relations;
                        delete query.relations;
                        return [4 /*yield*/, orderRepo.findOneWithRelations(rels, query)];
                    case 1:
                        raw = _b.sent();
                        if (!raw) {
                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_FOUND, "Order with ".concat(orderId, " was not found"));
                        }
                        return [4 /*yield*/, this.decorateTotals(raw, totalsToSelect)];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     * Gets an order by cart id.
     * @param cartId - cart id to find order
     * @param config - the config to be used to find order
     * @return the order document
     */
    OrderService.prototype.retrieveByCartId = function (cartId, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var orderRepo, _a, select, relations, totalsToSelect, query, raw;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        orderRepo = this.manager_.getCustomRepository(this.orderRepository_);
                        _a = this.transformQueryForTotals(config), select = _a.select, relations = _a.relations, totalsToSelect = _a.totalsToSelect;
                        query = {
                            where: { cart_id: cartId },
                        };
                        if (relations && relations.length > 0) {
                            query.relations = relations;
                        }
                        if (select && select.length > 0) {
                            query.select = select;
                        }
                        return [4 /*yield*/, orderRepo.findOne(query)];
                    case 1:
                        raw = _b.sent();
                        if (!raw) {
                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_FOUND, "Order with cart id: ".concat(cartId, " was not found"));
                        }
                        return [4 /*yield*/, this.decorateTotals(raw, totalsToSelect)];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     * Gets an order by id.
     * @param externalId - id of order to retrieve
     * @param config - query config to get order by
     * @return the order document
     */
    OrderService.prototype.retrieveByExternalId = function (externalId, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var orderRepo, _a, select, relations, totalsToSelect, query, rels, raw;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        orderRepo = this.manager_.getCustomRepository(this.orderRepository_);
                        _a = this.transformQueryForTotals(config), select = _a.select, relations = _a.relations, totalsToSelect = _a.totalsToSelect;
                        query = {
                            where: { external_id: externalId },
                        };
                        if (relations && relations.length > 0) {
                            query.relations = relations;
                        }
                        if (select && select.length > 0) {
                            query.select = select;
                        }
                        rels = query.relations;
                        delete query.relations;
                        return [4 /*yield*/, orderRepo.findOneWithRelations(rels, query)];
                    case 1:
                        raw = _b.sent();
                        if (!raw) {
                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_FOUND, "Order with external id ".concat(externalId, " was not found"));
                        }
                        return [4 /*yield*/, this.decorateTotals(raw, totalsToSelect)];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     * Checks the existence of an order by cart id.
     * @param cartId - cart id to find order
     * @return the order document
     */
    OrderService.prototype.existsByCartId = function (cartId) {
        return __awaiter(this, void 0, void 0, function () {
            var order;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.retrieveByCartId(cartId).catch(function () { return undefined; })];
                    case 1:
                        order = _a.sent();
                        return [2 /*return*/, !!order];
                }
            });
        });
    };
    /**
     * @param orderId - id of the order to complete
     * @return the result of the find operation
     */
    OrderService.prototype.completeOrder = function (orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.atomicPhase_(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                            var order, orderRepo;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.retrieve(orderId)];
                                    case 1:
                                        order = _a.sent();
                                        if (order.status === "canceled") {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "A canceled order cannot be completed");
                                        }
                                        return [4 /*yield*/, this.eventBus_.emit(OrderService.Events.COMPLETED, {
                                                id: orderId,
                                                no_notification: order.no_notification,
                                            })];
                                    case 2:
                                        _a.sent();
                                        order.status = models_1.OrderStatus.COMPLETED;
                                        orderRepo = manager.getCustomRepository(this.orderRepository_);
                                        return [2 /*return*/, orderRepo.save(order)];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Creates an order from a cart
     * @param cartId - id of the cart to create an order from
     * @return resolves to the creation result.
     */
    OrderService.prototype.createFromCart = function (cartId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.atomicPhase_(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                            var cartServiceTx, inventoryServiceTx, cart, payment, region, total, _a, _b, item, err_1, e_1_1, exists, paymentStatus, orderRepo, toCreate, draft, o, result, gcBalance, gcService, _c, _d, g, newBalance, usage, e_2_1, _e, _f, method, e_3_1, lineItemServiceTx, _g, _h, item, e_4_1, _j, _k, item, e_5_1;
                            var e_1, _l, e_2, _m, e_3, _o, e_4, _p, e_5, _q;
                            return __generator(this, function (_r) {
                                switch (_r.label) {
                                    case 0:
                                        cartServiceTx = this.cartService_.withTransaction(manager);
                                        inventoryServiceTx = this.inventoryService_.withTransaction(manager);
                                        return [4 /*yield*/, cartServiceTx.retrieve(cartId, {
                                                select: ["subtotal", "total"],
                                                relations: [
                                                    "region",
                                                    "payment",
                                                    "items",
                                                    "discounts",
                                                    "discounts.rule",
                                                    "gift_cards",
                                                    "shipping_methods",
                                                    "items",
                                                    "items.adjustments",
                                                ],
                                            })];
                                    case 1:
                                        cart = _r.sent();
                                        if (cart.items.length === 0) {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, "Cannot create order from empty cart");
                                        }
                                        payment = cart.payment, region = cart.region, total = cart.total;
                                        _r.label = 2;
                                    case 2:
                                        _r.trys.push([2, 12, 13, 14]);
                                        _a = __values(cart.items), _b = _a.next();
                                        _r.label = 3;
                                    case 3:
                                        if (!!_b.done) return [3 /*break*/, 11];
                                        item = _b.value;
                                        _r.label = 4;
                                    case 4:
                                        _r.trys.push([4, 6, , 10]);
                                        return [4 /*yield*/, inventoryServiceTx.confirmInventory(item.variant_id, item.quantity)];
                                    case 5:
                                        _r.sent();
                                        return [3 /*break*/, 10];
                                    case 6:
                                        err_1 = _r.sent();
                                        if (!payment) return [3 /*break*/, 8];
                                        return [4 /*yield*/, this.paymentProviderService_
                                                .withTransaction(manager)
                                                .cancelPayment(payment)];
                                    case 7:
                                        _r.sent();
                                        _r.label = 8;
                                    case 8: return [4 /*yield*/, cartServiceTx.update(cart.id, { payment_authorized_at: null })];
                                    case 9:
                                        _r.sent();
                                        throw err_1;
                                    case 10:
                                        _b = _a.next();
                                        return [3 /*break*/, 3];
                                    case 11: return [3 /*break*/, 14];
                                    case 12:
                                        e_1_1 = _r.sent();
                                        e_1 = { error: e_1_1 };
                                        return [3 /*break*/, 14];
                                    case 13:
                                        try {
                                            if (_b && !_b.done && (_l = _a.return)) _l.call(_a);
                                        }
                                        finally { if (e_1) throw e_1.error; }
                                        return [7 /*endfinally*/];
                                    case 14: return [4 /*yield*/, this.existsByCartId(cart.id)];
                                    case 15:
                                        exists = _r.sent();
                                        if (exists) {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.DUPLICATE_ERROR, "Order from cart already exists");
                                        }
                                        if (!(total !== 0)) return [3 /*break*/, 17];
                                        if (!payment) {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_ARGUMENT, "Cart does not contain a payment method");
                                        }
                                        return [4 /*yield*/, this.paymentProviderService_
                                                .withTransaction(manager)
                                                .getStatus(payment)];
                                    case 16:
                                        paymentStatus = _r.sent();
                                        if (paymentStatus !== "authorized") {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_ARGUMENT, "Payment method is not authorized");
                                        }
                                        _r.label = 17;
                                    case 17:
                                        orderRepo = manager.getCustomRepository(this.orderRepository_);
                                        toCreate = {
                                            payment_status: "awaiting",
                                            discounts: cart.discounts,
                                            gift_cards: cart.gift_cards,
                                            shipping_methods: cart.shipping_methods,
                                            shipping_address_id: cart.shipping_address_id,
                                            billing_address_id: cart.billing_address_id,
                                            region_id: cart.region_id,
                                            email: cart.email,
                                            customer_id: cart.customer_id,
                                            cart_id: cart.id,
                                            currency_code: region.currency_code,
                                            metadata: cart.metadata || {},
                                        };
                                        if (!(cart.type === "draft_order")) return [3 /*break*/, 19];
                                        return [4 /*yield*/, this.draftOrderService_
                                                .withTransaction(manager)
                                                .retrieveByCartId(cart.id)];
                                    case 18:
                                        draft = _r.sent();
                                        toCreate.draft_order_id = draft.id;
                                        toCreate.no_notification = draft.no_notification_order;
                                        _r.label = 19;
                                    case 19:
                                        o = orderRepo.create(toCreate);
                                        return [4 /*yield*/, orderRepo.save(o)];
                                    case 20:
                                        result = _r.sent();
                                        if (!(total !== 0 && payment)) return [3 /*break*/, 22];
                                        return [4 /*yield*/, this.paymentProviderService_
                                                .withTransaction(manager)
                                                .updatePayment(payment.id, {
                                                order_id: result.id,
                                            })];
                                    case 21:
                                        _r.sent();
                                        _r.label = 22;
                                    case 22: return [4 /*yield*/, this.totalsService_.getGiftCardableAmount(cart)];
                                    case 23:
                                        gcBalance = _r.sent();
                                        gcService = this.giftCardService_.withTransaction(manager);
                                        _r.label = 24;
                                    case 24:
                                        _r.trys.push([24, 30, 31, 32]);
                                        _c = __values(cart.gift_cards), _d = _c.next();
                                        _r.label = 25;
                                    case 25:
                                        if (!!_d.done) return [3 /*break*/, 29];
                                        g = _d.value;
                                        newBalance = Math.max(0, g.balance - gcBalance);
                                        usage = g.balance - newBalance;
                                        return [4 /*yield*/, gcService.update(g.id, {
                                                balance: newBalance,
                                                is_disabled: newBalance === 0,
                                            })];
                                    case 26:
                                        _r.sent();
                                        return [4 /*yield*/, gcService.createTransaction({
                                                gift_card_id: g.id,
                                                order_id: result.id,
                                                amount: usage,
                                                is_taxable: cart.region.gift_cards_taxable,
                                                tax_rate: cart.region.gift_cards_taxable
                                                    ? cart.region.tax_rate
                                                    : null,
                                            })];
                                    case 27:
                                        _r.sent();
                                        gcBalance = gcBalance - usage;
                                        _r.label = 28;
                                    case 28:
                                        _d = _c.next();
                                        return [3 /*break*/, 25];
                                    case 29: return [3 /*break*/, 32];
                                    case 30:
                                        e_2_1 = _r.sent();
                                        e_2 = { error: e_2_1 };
                                        return [3 /*break*/, 32];
                                    case 31:
                                        try {
                                            if (_d && !_d.done && (_m = _c.return)) _m.call(_c);
                                        }
                                        finally { if (e_2) throw e_2.error; }
                                        return [7 /*endfinally*/];
                                    case 32:
                                        _r.trys.push([32, 37, 38, 39]);
                                        _e = __values(cart.shipping_methods), _f = _e.next();
                                        _r.label = 33;
                                    case 33:
                                        if (!!_f.done) return [3 /*break*/, 36];
                                        method = _f.value;
                                        return [4 /*yield*/, this.shippingOptionService_
                                                .withTransaction(manager)
                                                .updateShippingMethod(method.id, { order_id: result.id })];
                                    case 34:
                                        _r.sent();
                                        _r.label = 35;
                                    case 35:
                                        _f = _e.next();
                                        return [3 /*break*/, 33];
                                    case 36: return [3 /*break*/, 39];
                                    case 37:
                                        e_3_1 = _r.sent();
                                        e_3 = { error: e_3_1 };
                                        return [3 /*break*/, 39];
                                    case 38:
                                        try {
                                            if (_f && !_f.done && (_o = _e.return)) _o.call(_e);
                                        }
                                        finally { if (e_3) throw e_3.error; }
                                        return [7 /*endfinally*/];
                                    case 39:
                                        lineItemServiceTx = this.lineItemService_.withTransaction(manager);
                                        _r.label = 40;
                                    case 40:
                                        _r.trys.push([40, 45, 46, 47]);
                                        _g = __values(cart.items), _h = _g.next();
                                        _r.label = 41;
                                    case 41:
                                        if (!!_h.done) return [3 /*break*/, 44];
                                        item = _h.value;
                                        return [4 /*yield*/, lineItemServiceTx.update(item.id, { order_id: result.id })];
                                    case 42:
                                        _r.sent();
                                        _r.label = 43;
                                    case 43:
                                        _h = _g.next();
                                        return [3 /*break*/, 41];
                                    case 44: return [3 /*break*/, 47];
                                    case 45:
                                        e_4_1 = _r.sent();
                                        e_4 = { error: e_4_1 };
                                        return [3 /*break*/, 47];
                                    case 46:
                                        try {
                                            if (_h && !_h.done && (_p = _g.return)) _p.call(_g);
                                        }
                                        finally { if (e_4) throw e_4.error; }
                                        return [7 /*endfinally*/];
                                    case 47:
                                        _r.trys.push([47, 52, 53, 54]);
                                        _j = __values(cart.items), _k = _j.next();
                                        _r.label = 48;
                                    case 48:
                                        if (!!_k.done) return [3 /*break*/, 51];
                                        item = _k.value;
                                        return [4 /*yield*/, inventoryServiceTx.adjustInventory(item.variant_id, -item.quantity)];
                                    case 49:
                                        _r.sent();
                                        _r.label = 50;
                                    case 50:
                                        _k = _j.next();
                                        return [3 /*break*/, 48];
                                    case 51: return [3 /*break*/, 54];
                                    case 52:
                                        e_5_1 = _r.sent();
                                        e_5 = { error: e_5_1 };
                                        return [3 /*break*/, 54];
                                    case 53:
                                        try {
                                            if (_k && !_k.done && (_q = _j.return)) _q.call(_j);
                                        }
                                        finally { if (e_5) throw e_5.error; }
                                        return [7 /*endfinally*/];
                                    case 54: return [4 /*yield*/, this.eventBus_
                                            .withTransaction(manager)
                                            .emit(OrderService.Events.PLACED, {
                                            id: result.id,
                                            no_notification: result.no_notification,
                                        })];
                                    case 55:
                                        _r.sent();
                                        return [4 /*yield*/, cartServiceTx.update(cart.id, { completed_at: new Date() })];
                                    case 56:
                                        _r.sent();
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Adds a shipment to the order to indicate that an order has left the
     * warehouse. Will ask the fulfillment provider for any documents that may
     * have been created in regards to the shipment.
     * @param orderId - the id of the order that has been shipped
     * @param fulfillmentId - the fulfillment that has now been shipped
     * @param trackingLinks - array of tracking numebers
     *   associated with the shipment
     * @param config - the config of the order that has been shipped
     * @return the resulting order following the update.
     */
    OrderService.prototype.createShipment = function (orderId, fulfillmentId, trackingLinks, config) {
        if (config === void 0) { config = {
            metadata: {},
            no_notification: undefined,
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var metadata, no_notification;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = config.metadata, no_notification = config.no_notification;
                        return [4 /*yield*/, this.atomicPhase_(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                                var order, shipment, evaluatedNoNotification, shipmentRes, lineItemServiceTx, _loop_1, _a, _b, item, e_6_1, orderRepo, result;
                                var e_6, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0: return [4 /*yield*/, this.retrieve(orderId, { relations: ["items"] })];
                                        case 1:
                                            order = _d.sent();
                                            return [4 /*yield*/, this.fulfillmentService_
                                                    .withTransaction(manager)
                                                    .retrieve(fulfillmentId)];
                                        case 2:
                                            shipment = _d.sent();
                                            if (order.status === "canceled") {
                                                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "A canceled order cannot be fulfilled as shipped");
                                            }
                                            if (!shipment || shipment.order_id !== orderId) {
                                                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_FOUND, "Could not find fulfillment");
                                            }
                                            evaluatedNoNotification = no_notification !== undefined
                                                ? no_notification
                                                : shipment.no_notification;
                                            return [4 /*yield*/, this.fulfillmentService_
                                                    .withTransaction(manager)
                                                    .createShipment(fulfillmentId, trackingLinks, {
                                                    metadata: metadata,
                                                    no_notification: evaluatedNoNotification,
                                                })];
                                        case 3:
                                            shipmentRes = _d.sent();
                                            lineItemServiceTx = this.lineItemService_.withTransaction(manager);
                                            order.fulfillment_status = models_1.FulfillmentStatus.SHIPPED;
                                            _loop_1 = function (item) {
                                                var shipped, shippedQty;
                                                return __generator(this, function (_e) {
                                                    switch (_e.label) {
                                                        case 0:
                                                            shipped = shipmentRes.items.find(function (si) { return si.item_id === item.id; });
                                                            if (!shipped) return [3 /*break*/, 2];
                                                            shippedQty = (item.shipped_quantity || 0) + shipped.quantity;
                                                            if (shippedQty !== item.quantity) {
                                                                order.fulfillment_status = models_1.FulfillmentStatus.PARTIALLY_SHIPPED;
                                                            }
                                                            return [4 /*yield*/, lineItemServiceTx.update(item.id, {
                                                                    shipped_quantity: shippedQty,
                                                                })];
                                                        case 1:
                                                            _e.sent();
                                                            return [3 /*break*/, 3];
                                                        case 2:
                                                            if (item.shipped_quantity !== item.quantity) {
                                                                order.fulfillment_status = models_1.FulfillmentStatus.PARTIALLY_SHIPPED;
                                                            }
                                                            _e.label = 3;
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            _d.label = 4;
                                        case 4:
                                            _d.trys.push([4, 9, 10, 11]);
                                            _a = __values(order.items), _b = _a.next();
                                            _d.label = 5;
                                        case 5:
                                            if (!!_b.done) return [3 /*break*/, 8];
                                            item = _b.value;
                                            return [5 /*yield**/, _loop_1(item)];
                                        case 6:
                                            _d.sent();
                                            _d.label = 7;
                                        case 7:
                                            _b = _a.next();
                                            return [3 /*break*/, 5];
                                        case 8: return [3 /*break*/, 11];
                                        case 9:
                                            e_6_1 = _d.sent();
                                            e_6 = { error: e_6_1 };
                                            return [3 /*break*/, 11];
                                        case 10:
                                            try {
                                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                            }
                                            finally { if (e_6) throw e_6.error; }
                                            return [7 /*endfinally*/];
                                        case 11:
                                            orderRepo = manager.getCustomRepository(this.orderRepository_);
                                            return [4 /*yield*/, orderRepo.save(order)];
                                        case 12:
                                            result = _d.sent();
                                            return [4 /*yield*/, this.eventBus_
                                                    .withTransaction(manager)
                                                    .emit(OrderService.Events.SHIPMENT_CREATED, {
                                                    id: orderId,
                                                    fulfillment_id: shipmentRes.id,
                                                    no_notification: evaluatedNoNotification,
                                                })];
                                        case 13:
                                            _d.sent();
                                            return [2 /*return*/, result];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Updates the order's billing address.
     * @param order - the order to update
     * @param address - the value to set the billing address to
     * @return the result of the update operation
     */
    OrderService.prototype.updateBillingAddress = function (order, address) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var addrRepo, region, addr, created;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        addrRepo = this.manager_.getCustomRepository(this.addressRepository_);
                        address.country_code = (_b = (_a = address.country_code) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : null;
                        return [4 /*yield*/, this.regionService_
                                .withTransaction(this.manager_)
                                .retrieve(order.region_id, {
                                relations: ["countries"],
                            })];
                    case 1:
                        region = _e.sent();
                        if (!region.countries.find(function (_a) {
                            var iso_2 = _a.iso_2;
                            return address.country_code === iso_2;
                        })) {
                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, "Shipping country must be in the order region");
                        }
                        address.country_code = (_d = (_c = address.country_code) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== null && _d !== void 0 ? _d : null;
                        if (!order.billing_address_id) return [3 /*break*/, 4];
                        return [4 /*yield*/, addrRepo.findOne({
                                where: { id: order.billing_address_id },
                            })];
                    case 2:
                        addr = _e.sent();
                        return [4 /*yield*/, addrRepo.save(__assign(__assign({}, addr), address))];
                    case 3:
                        _e.sent();
                        return [3 /*break*/, 7];
                    case 4: return [4 /*yield*/, addrRepo.create(__assign({}, address))];
                    case 5:
                        created = _e.sent();
                        return [4 /*yield*/, addrRepo.save(created)];
                    case 6:
                        _e.sent();
                        _e.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates the order's shipping address.
     * @param order - the order to update
     * @param address - the value to set the shipping address to
     * @return the result of the update operation
     */
    OrderService.prototype.updateShippingAddress = function (order, address) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var addrRepo, region, addr, created;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        addrRepo = this.manager_.getCustomRepository(this.addressRepository_);
                        address.country_code = (_b = (_a = address.country_code) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : null;
                        return [4 /*yield*/, this.regionService_
                                .withTransaction(this.manager_)
                                .retrieve(order.region_id, {
                                relations: ["countries"],
                            })];
                    case 1:
                        region = _c.sent();
                        if (!region.countries.find(function (_a) {
                            var iso_2 = _a.iso_2;
                            return address.country_code === iso_2;
                        })) {
                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.INVALID_DATA, "Shipping country must be in the order region");
                        }
                        if (!order.shipping_address_id) return [3 /*break*/, 4];
                        return [4 /*yield*/, addrRepo.findOne({
                                where: { id: order.shipping_address_id },
                            })];
                    case 2:
                        addr = _c.sent();
                        return [4 /*yield*/, addrRepo.save(__assign(__assign({}, addr), address))];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        created = addrRepo.create(__assign({}, address));
                        return [4 /*yield*/, addrRepo.save(created)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.prototype.addShippingMethod = function (orderId, optionId, data, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.atomicPhase_(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                            var order, shipping_methods, newMethod, shippingOptionServiceTx, methods, shipping_methods_1, shipping_methods_1_1, sm, e_7_1, result;
                            var e_7, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this.retrieve(orderId, {
                                            select: ["subtotal"],
                                            relations: [
                                                "shipping_methods",
                                                "shipping_methods.shipping_option",
                                                "items",
                                                "items.variant",
                                                "items.variant.product",
                                            ],
                                        })];
                                    case 1:
                                        order = _b.sent();
                                        shipping_methods = order.shipping_methods;
                                        if (order.status === "canceled") {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "A shipping method cannot be added to a canceled order");
                                        }
                                        return [4 /*yield*/, this.shippingOptionService_
                                                .withTransaction(manager)
                                                .createShippingMethod(optionId, data !== null && data !== void 0 ? data : {}, __assign({ order: order }, config))];
                                    case 2:
                                        newMethod = _b.sent();
                                        shippingOptionServiceTx = this.shippingOptionService_.withTransaction(manager);
                                        methods = [newMethod];
                                        if (!shipping_methods.length) return [3 /*break*/, 11];
                                        _b.label = 3;
                                    case 3:
                                        _b.trys.push([3, 9, 10, 11]);
                                        shipping_methods_1 = __values(shipping_methods), shipping_methods_1_1 = shipping_methods_1.next();
                                        _b.label = 4;
                                    case 4:
                                        if (!!shipping_methods_1_1.done) return [3 /*break*/, 8];
                                        sm = shipping_methods_1_1.value;
                                        if (!(sm.shipping_option.profile_id ===
                                            newMethod.shipping_option.profile_id)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, shippingOptionServiceTx.deleteShippingMethods(sm)];
                                    case 5:
                                        _b.sent();
                                        return [3 /*break*/, 7];
                                    case 6:
                                        methods.push(sm);
                                        _b.label = 7;
                                    case 7:
                                        shipping_methods_1_1 = shipping_methods_1.next();
                                        return [3 /*break*/, 4];
                                    case 8: return [3 /*break*/, 11];
                                    case 9:
                                        e_7_1 = _b.sent();
                                        e_7 = { error: e_7_1 };
                                        return [3 /*break*/, 11];
                                    case 10:
                                        try {
                                            if (shipping_methods_1_1 && !shipping_methods_1_1.done && (_a = shipping_methods_1.return)) _a.call(shipping_methods_1);
                                        }
                                        finally { if (e_7) throw e_7.error; }
                                        return [7 /*endfinally*/];
                                    case 11: return [4 /*yield*/, this.retrieve(orderId)];
                                    case 12:
                                        result = _b.sent();
                                        return [4 /*yield*/, this.eventBus_
                                                .withTransaction(manager)
                                                .emit(OrderService.Events.UPDATED, { id: result.id })];
                                    case 13:
                                        _b.sent();
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Updates an order. Metadata updates should
     * use dedicated method, e.g. `setMetadata` etc. The function
     * will throw errors if metadata updates are attempted.
     * @param orderId - the id of the order. Must be a string that
     *   can be casted to an ObjectId
     * @param update - an object with the update values.
     * @return resolves to the update result.
     */
    OrderService.prototype.update = function (orderId, update) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.atomicPhase_(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                            var order, metadata, shipping_address, billing_address, no_notification, items, rest, lineItemServiceTx, _a, _b, item, e_8_1, _c, _d, _e, key, value, orderRepo, result;
                            var e_8, _f, e_9, _g;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0: return [4 /*yield*/, this.retrieve(orderId)];
                                    case 1:
                                        order = _h.sent();
                                        if (order.status === "canceled") {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "A canceled order cannot be updated");
                                        }
                                        if ((update.payment || update.items) &&
                                            (order.fulfillment_status !== "not_fulfilled" ||
                                                order.payment_status !== "awaiting" ||
                                                order.status !== "pending")) {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "Can't update shipping, billing, items and payment method when order is processed");
                                        }
                                        if (update.status || update.fulfillment_status || update.payment_status) {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "Can't update order statuses. This will happen automatically. Use metadata in order for additional statuses");
                                        }
                                        metadata = update.metadata, shipping_address = update.shipping_address, billing_address = update.billing_address, no_notification = update.no_notification, items = update.items, rest = __rest(update, ["metadata", "shipping_address", "billing_address", "no_notification", "items"]);
                                        if (update.metadata) {
                                            order.metadata = (0, utils_1.setMetadata)(order, metadata !== null && metadata !== void 0 ? metadata : {});
                                        }
                                        if (!update.shipping_address) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.updateShippingAddress(order, shipping_address)];
                                    case 2:
                                        _h.sent();
                                        _h.label = 3;
                                    case 3:
                                        if (!update.billing_address) return [3 /*break*/, 5];
                                        return [4 /*yield*/, this.updateBillingAddress(order, billing_address)];
                                    case 4:
                                        _h.sent();
                                        _h.label = 5;
                                    case 5:
                                        if (update.no_notification) {
                                            order.no_notification = no_notification !== null && no_notification !== void 0 ? no_notification : false;
                                        }
                                        lineItemServiceTx = this.lineItemService_.withTransaction(manager);
                                        if (!update.items) return [3 /*break*/, 13];
                                        _h.label = 6;
                                    case 6:
                                        _h.trys.push([6, 11, 12, 13]);
                                        _a = __values(items), _b = _a.next();
                                        _h.label = 7;
                                    case 7:
                                        if (!!_b.done) return [3 /*break*/, 10];
                                        item = _b.value;
                                        return [4 /*yield*/, lineItemServiceTx.create(__assign(__assign({}, item), { order_id: orderId }))];
                                    case 8:
                                        _h.sent();
                                        _h.label = 9;
                                    case 9:
                                        _b = _a.next();
                                        return [3 /*break*/, 7];
                                    case 10: return [3 /*break*/, 13];
                                    case 11:
                                        e_8_1 = _h.sent();
                                        e_8 = { error: e_8_1 };
                                        return [3 /*break*/, 13];
                                    case 12:
                                        try {
                                            if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
                                        }
                                        finally { if (e_8) throw e_8.error; }
                                        return [7 /*endfinally*/];
                                    case 13:
                                        try {
                                            for (_c = __values(Object.entries(rest)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                                _e = __read(_d.value, 2), key = _e[0], value = _e[1];
                                                order[key] = value;
                                            }
                                        }
                                        catch (e_9_1) { e_9 = { error: e_9_1 }; }
                                        finally {
                                            try {
                                                if (_d && !_d.done && (_g = _c.return)) _g.call(_c);
                                            }
                                            finally { if (e_9) throw e_9.error; }
                                        }
                                        orderRepo = manager.getCustomRepository(this.orderRepository_);
                                        return [4 /*yield*/, orderRepo.save(order)];
                                    case 14:
                                        result = _h.sent();
                                        return [4 /*yield*/, this.eventBus_
                                                .withTransaction(manager)
                                                .emit(OrderService.Events.UPDATED, {
                                                id: orderId,
                                                no_notification: order.no_notification,
                                            })];
                                    case 15:
                                        _h.sent();
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Cancels an order.
     * Throws if fulfillment process has been initiated.
     * Throws if payment process has been initiated.
     * @param orderId - id of order to cancel.
     * @return result of the update operation.
     */
    OrderService.prototype.cancel = function (orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.atomicPhase_(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                            var order, throwErrorIf, notCanceled, inventoryServiceTx, _a, _b, item, e_10_1, paymentProviderServiceTx, _c, _d, p, e_11_1, orderRepo, result;
                            var e_10, _e, e_11, _f;
                            var _g;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0: return [4 /*yield*/, this.retrieve(orderId, {
                                            relations: [
                                                "fulfillments",
                                                "payments",
                                                "returns",
                                                "claims",
                                                "swaps",
                                                "items",
                                            ],
                                        })];
                                    case 1:
                                        order = _h.sent();
                                        if (((_g = order.refunds) === null || _g === void 0 ? void 0 : _g.length) > 0) {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "Order with refund(s) cannot be canceled");
                                        }
                                        throwErrorIf = function (arr, pred, type) {
                                            if (arr === null || arr === void 0 ? void 0 : arr.filter(pred).length) {
                                                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "All ".concat(type, " must be canceled before canceling an order"));
                                            }
                                        };
                                        notCanceled = function (o) { return !o.canceled_at; };
                                        throwErrorIf(order.fulfillments, notCanceled, "fulfillments");
                                        throwErrorIf(order.returns, function (r) { return r.status !== "canceled"; }, "returns");
                                        throwErrorIf(order.swaps, notCanceled, "swaps");
                                        throwErrorIf(order.claims, notCanceled, "claims");
                                        inventoryServiceTx = this.inventoryService_.withTransaction(manager);
                                        _h.label = 2;
                                    case 2:
                                        _h.trys.push([2, 7, 8, 9]);
                                        _a = __values(order.items), _b = _a.next();
                                        _h.label = 3;
                                    case 3:
                                        if (!!_b.done) return [3 /*break*/, 6];
                                        item = _b.value;
                                        return [4 /*yield*/, inventoryServiceTx.adjustInventory(item.variant_id, item.quantity)];
                                    case 4:
                                        _h.sent();
                                        _h.label = 5;
                                    case 5:
                                        _b = _a.next();
                                        return [3 /*break*/, 3];
                                    case 6: return [3 /*break*/, 9];
                                    case 7:
                                        e_10_1 = _h.sent();
                                        e_10 = { error: e_10_1 };
                                        return [3 /*break*/, 9];
                                    case 8:
                                        try {
                                            if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                        }
                                        finally { if (e_10) throw e_10.error; }
                                        return [7 /*endfinally*/];
                                    case 9:
                                        paymentProviderServiceTx = this.paymentProviderService_.withTransaction(manager);
                                        _h.label = 10;
                                    case 10:
                                        _h.trys.push([10, 15, 16, 17]);
                                        _c = __values(order.payments), _d = _c.next();
                                        _h.label = 11;
                                    case 11:
                                        if (!!_d.done) return [3 /*break*/, 14];
                                        p = _d.value;
                                        return [4 /*yield*/, paymentProviderServiceTx.cancelPayment(p)];
                                    case 12:
                                        _h.sent();
                                        _h.label = 13;
                                    case 13:
                                        _d = _c.next();
                                        return [3 /*break*/, 11];
                                    case 14: return [3 /*break*/, 17];
                                    case 15:
                                        e_11_1 = _h.sent();
                                        e_11 = { error: e_11_1 };
                                        return [3 /*break*/, 17];
                                    case 16:
                                        try {
                                            if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                                        }
                                        finally { if (e_11) throw e_11.error; }
                                        return [7 /*endfinally*/];
                                    case 17:
                                        order.status = models_1.OrderStatus.CANCELED;
                                        order.fulfillment_status = models_1.FulfillmentStatus.CANCELED;
                                        order.payment_status = models_1.PaymentStatus.CANCELED;
                                        order.canceled_at = new Date();
                                        orderRepo = manager.getCustomRepository(this.orderRepository_);
                                        return [4 /*yield*/, orderRepo.save(order)];
                                    case 18:
                                        result = _h.sent();
                                        return [4 /*yield*/, this.eventBus_
                                                .withTransaction(manager)
                                                .emit(OrderService.Events.CANCELED, {
                                                id: order.id,
                                                no_notification: order.no_notification,
                                            })];
                                    case 19:
                                        _h.sent();
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Captures payment for an order.
     * @param orderId - id of order to capture payment for.
     * @return result of the update operation.
     */
    OrderService.prototype.capturePayment = function (orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.atomicPhase_(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                            var orderRepo, order, paymentProviderServiceTx, payments, _loop_2, _a, _b, p, e_12_1, result;
                            var e_12, _c;
                            var _this = this;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        orderRepo = manager.getCustomRepository(this.orderRepository_);
                                        return [4 /*yield*/, this.retrieve(orderId, { relations: ["payments"] })];
                                    case 1:
                                        order = _d.sent();
                                        if (order.status === "canceled") {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "A canceled order cannot capture payment");
                                        }
                                        paymentProviderServiceTx = this.paymentProviderService_.withTransaction(manager);
                                        payments = [];
                                        _loop_2 = function (p) {
                                            var result_1;
                                            return __generator(this, function (_e) {
                                                switch (_e.label) {
                                                    case 0:
                                                        if (!(p.captured_at === null)) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, paymentProviderServiceTx
                                                                .capturePayment(p)
                                                                .catch(function (err) {
                                                                _this.eventBus_
                                                                    .withTransaction(manager)
                                                                    .emit(OrderService.Events.PAYMENT_CAPTURE_FAILED, {
                                                                    id: orderId,
                                                                    payment_id: p.id,
                                                                    error: err,
                                                                    no_notification: order.no_notification,
                                                                });
                                                            })];
                                                    case 1:
                                                        result_1 = _e.sent();
                                                        if (result_1) {
                                                            payments.push(result_1);
                                                        }
                                                        else {
                                                            payments.push(p);
                                                        }
                                                        return [3 /*break*/, 3];
                                                    case 2:
                                                        payments.push(p);
                                                        _e.label = 3;
                                                    case 3: return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _d.label = 2;
                                    case 2:
                                        _d.trys.push([2, 7, 8, 9]);
                                        _a = __values(order.payments), _b = _a.next();
                                        _d.label = 3;
                                    case 3:
                                        if (!!_b.done) return [3 /*break*/, 6];
                                        p = _b.value;
                                        return [5 /*yield**/, _loop_2(p)];
                                    case 4:
                                        _d.sent();
                                        _d.label = 5;
                                    case 5:
                                        _b = _a.next();
                                        return [3 /*break*/, 3];
                                    case 6: return [3 /*break*/, 9];
                                    case 7:
                                        e_12_1 = _d.sent();
                                        e_12 = { error: e_12_1 };
                                        return [3 /*break*/, 9];
                                    case 8:
                                        try {
                                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                        }
                                        finally { if (e_12) throw e_12.error; }
                                        return [7 /*endfinally*/];
                                    case 9:
                                        order.payments = payments;
                                        order.payment_status = payments.every(function (p) { return p.captured_at !== null; })
                                            ? models_1.PaymentStatus.CAPTURED
                                            : models_1.PaymentStatus.REQUIRES_ACTION;
                                        return [4 /*yield*/, orderRepo.save(order)];
                                    case 10:
                                        result = _d.sent();
                                        if (order.payment_status === models_1.PaymentStatus.CAPTURED) {
                                            this.eventBus_
                                                .withTransaction(manager)
                                                .emit(OrderService.Events.PAYMENT_CAPTURED, {
                                                id: result.id,
                                                no_notification: order.no_notification,
                                            });
                                        }
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Checks that a given quantity of a line item can be fulfilled. Fails if the
     * fulfillable quantity is lower than the requested fulfillment quantity.
     * Fulfillable quantity is calculated by subtracting the already fulfilled
     * quantity from the quantity that was originally purchased.
     * @param item - the line item to check has sufficient fulfillable
     *   quantity.
     * @param quantity - the quantity that is requested to be fulfilled.
     * @return a line item that has the requested fulfillment quantity
     *   set.
     */
    OrderService.prototype.validateFulfillmentLineItem = function (item, quantity) {
        if (!item) {
            // This will in most cases be called by a webhook so to ensure that
            // things go through smoothly in instances where extra items outside
            // of Medusa are added we allow unknown items
            return null;
        }
        if (quantity > item.quantity - item.fulfilled_quantity) {
            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "Cannot fulfill more items than have been purchased");
        }
        return __assign(__assign({}, item), { quantity: quantity });
    };
    /**
     * Creates fulfillments for an order.
     * In a situation where the order has more than one shipping method,
     * we need to partition the order items, such that they can be sent
     * to their respective fulfillment provider.
     * @param orderId - id of order to cancel.
     * @param itemsToFulfill - items to fulfil.
     * @param config - the config to cancel.
     * @return result of the update operation.
     */
    OrderService.prototype.createFulfillment = function (orderId, itemsToFulfill, config) {
        if (config === void 0) { config = {
            no_notification: undefined,
            metadata: {},
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var metadata, no_notification;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadata = config.metadata, no_notification = config.no_notification;
                        return [4 /*yield*/, this.atomicPhase_(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                                var order, fulfillments, successfullyFulfilled, fulfillments_1, fulfillments_1_1, f, _loop_3, this_1, _a, _b, item, e_13_1, orderRepo, result, evaluatedNoNotification, eventBusTx, fulfillments_2, fulfillments_2_1, fulfillment, e_14_1;
                                var e_15, _c, e_13, _d, e_14, _e;
                                var _f;
                                return __generator(this, function (_g) {
                                    switch (_g.label) {
                                        case 0: return [4 /*yield*/, this.retrieve(orderId, {
                                                select: [
                                                    "subtotal",
                                                    "shipping_total",
                                                    "discount_total",
                                                    "tax_total",
                                                    "gift_card_total",
                                                    "total",
                                                ],
                                                relations: [
                                                    "discounts",
                                                    "discounts.rule",
                                                    "region",
                                                    "fulfillments",
                                                    "shipping_address",
                                                    "billing_address",
                                                    "shipping_methods",
                                                    "shipping_methods.shipping_option",
                                                    "items",
                                                    "items.adjustments",
                                                    "items.variant",
                                                    "items.variant.product",
                                                    "payments",
                                                ],
                                            })];
                                        case 1:
                                            order = _g.sent();
                                            if (order.status === models_1.OrderStatus.CANCELED) {
                                                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "A canceled order cannot be fulfilled");
                                            }
                                            if (!((_f = order.shipping_methods) === null || _f === void 0 ? void 0 : _f.length)) {
                                                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "Cannot fulfill an order that lacks shipping methods");
                                            }
                                            return [4 /*yield*/, this.fulfillmentService_
                                                    .withTransaction(manager)
                                                    .createFulfillment(order, itemsToFulfill, {
                                                    metadata: metadata,
                                                    no_notification: no_notification,
                                                    order_id: orderId,
                                                })];
                                        case 2:
                                            fulfillments = _g.sent();
                                            successfullyFulfilled = [];
                                            try {
                                                for (fulfillments_1 = __values(fulfillments), fulfillments_1_1 = fulfillments_1.next(); !fulfillments_1_1.done; fulfillments_1_1 = fulfillments_1.next()) {
                                                    f = fulfillments_1_1.value;
                                                    successfullyFulfilled = __spreadArray(__spreadArray([], __read(successfullyFulfilled), false), __read(f.items), false);
                                                }
                                            }
                                            catch (e_15_1) { e_15 = { error: e_15_1 }; }
                                            finally {
                                                try {
                                                    if (fulfillments_1_1 && !fulfillments_1_1.done && (_c = fulfillments_1.return)) _c.call(fulfillments_1);
                                                }
                                                finally { if (e_15) throw e_15.error; }
                                            }
                                            order.fulfillment_status = models_1.FulfillmentStatus.FULFILLED;
                                            _loop_3 = function (item) {
                                                var fulfillmentItem, fulfilledQuantity;
                                                return __generator(this, function (_h) {
                                                    switch (_h.label) {
                                                        case 0:
                                                            fulfillmentItem = successfullyFulfilled.find(function (f) { return item.id === f.item_id; });
                                                            if (!fulfillmentItem) return [3 /*break*/, 2];
                                                            fulfilledQuantity = (item.fulfilled_quantity || 0) + fulfillmentItem.quantity;
                                                            // Update the fulfilled quantity
                                                            return [4 /*yield*/, this_1.lineItemService_.withTransaction(manager).update(item.id, {
                                                                    fulfilled_quantity: fulfilledQuantity,
                                                                })];
                                                        case 1:
                                                            // Update the fulfilled quantity
                                                            _h.sent();
                                                            if (item.quantity !== fulfilledQuantity) {
                                                                order.fulfillment_status = models_1.FulfillmentStatus.PARTIALLY_FULFILLED;
                                                            }
                                                            return [3 /*break*/, 3];
                                                        case 2:
                                                            if (item.quantity !== item.fulfilled_quantity) {
                                                                order.fulfillment_status = models_1.FulfillmentStatus.PARTIALLY_FULFILLED;
                                                            }
                                                            _h.label = 3;
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            };
                                            this_1 = this;
                                            _g.label = 3;
                                        case 3:
                                            _g.trys.push([3, 8, 9, 10]);
                                            _a = __values(order.items), _b = _a.next();
                                            _g.label = 4;
                                        case 4:
                                            if (!!_b.done) return [3 /*break*/, 7];
                                            item = _b.value;
                                            return [5 /*yield**/, _loop_3(item)];
                                        case 5:
                                            _g.sent();
                                            _g.label = 6;
                                        case 6:
                                            _b = _a.next();
                                            return [3 /*break*/, 4];
                                        case 7: return [3 /*break*/, 10];
                                        case 8:
                                            e_13_1 = _g.sent();
                                            e_13 = { error: e_13_1 };
                                            return [3 /*break*/, 10];
                                        case 9:
                                            try {
                                                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                                            }
                                            finally { if (e_13) throw e_13.error; }
                                            return [7 /*endfinally*/];
                                        case 10:
                                            orderRepo = manager.getCustomRepository(this.orderRepository_);
                                            order.fulfillments = __spreadArray(__spreadArray([], __read(order.fulfillments), false), __read(fulfillments), false);
                                            return [4 /*yield*/, orderRepo.save(order)];
                                        case 11:
                                            result = _g.sent();
                                            evaluatedNoNotification = no_notification !== undefined ? no_notification : order.no_notification;
                                            eventBusTx = this.eventBus_.withTransaction(manager);
                                            _g.label = 12;
                                        case 12:
                                            _g.trys.push([12, 17, 18, 19]);
                                            fulfillments_2 = __values(fulfillments), fulfillments_2_1 = fulfillments_2.next();
                                            _g.label = 13;
                                        case 13:
                                            if (!!fulfillments_2_1.done) return [3 /*break*/, 16];
                                            fulfillment = fulfillments_2_1.value;
                                            return [4 /*yield*/, eventBusTx.emit(OrderService.Events.FULFILLMENT_CREATED, {
                                                    id: orderId,
                                                    fulfillment_id: fulfillment.id,
                                                    no_notification: evaluatedNoNotification,
                                                })];
                                        case 14:
                                            _g.sent();
                                            _g.label = 15;
                                        case 15:
                                            fulfillments_2_1 = fulfillments_2.next();
                                            return [3 /*break*/, 13];
                                        case 16: return [3 /*break*/, 19];
                                        case 17:
                                            e_14_1 = _g.sent();
                                            e_14 = { error: e_14_1 };
                                            return [3 /*break*/, 19];
                                        case 18:
                                            try {
                                                if (fulfillments_2_1 && !fulfillments_2_1.done && (_e = fulfillments_2.return)) _e.call(fulfillments_2);
                                            }
                                            finally { if (e_14) throw e_14.error; }
                                            return [7 /*endfinally*/];
                                        case 19: return [2 /*return*/, result];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Cancels a fulfillment (if related to an order)
     * @param fulfillmentId - the ID of the fulfillment to cancel
     * @return updated order
     */
    OrderService.prototype.cancelFulfillment = function (fulfillmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.atomicPhase_(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                            var canceled, order, orderRepo, updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.fulfillmentService_
                                            .withTransaction(manager)
                                            .cancelFulfillment(fulfillmentId)];
                                    case 1:
                                        canceled = _a.sent();
                                        if (!canceled.order_id) {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "Fufillment not related to an order");
                                        }
                                        return [4 /*yield*/, this.retrieve(canceled.order_id)];
                                    case 2:
                                        order = _a.sent();
                                        order.fulfillment_status = models_1.FulfillmentStatus.CANCELED;
                                        orderRepo = manager.getCustomRepository(this.orderRepository_);
                                        return [4 /*yield*/, orderRepo.save(order)];
                                    case 3:
                                        updated = _a.sent();
                                        return [4 /*yield*/, this.eventBus_
                                                .withTransaction(manager)
                                                .emit(OrderService.Events.FULFILLMENT_CANCELED, {
                                                id: order.id,
                                                fulfillment_id: canceled.id,
                                                no_notification: canceled.no_notification,
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/, updated];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Retrieves the order line items, given an array of items.
     * @param order - the order to get line items from
     * @param items - the items to get
     * @param transformer - a function to apply to each of the items
     *    retrieved from the order, should return a line item. If the transformer
     *    returns an undefined value the line item will be filtered from the
     *    returned array.
     * @return the line items generated by the transformer.
     */
    OrderService.prototype.getFulfillmentItems = function (order, items, transformer) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(items.map(function (_a) {
                            var item_id = _a.item_id, quantity = _a.quantity;
                            return __awaiter(_this, void 0, void 0, function () {
                                var item;
                                return __generator(this, function (_b) {
                                    item = order.items.find(function (i) { return i.id === item_id; });
                                    return [2 /*return*/, transformer(item, quantity)];
                                });
                            });
                        }))];
                    case 1: return [2 /*return*/, (_a.sent()).filter(function (i) { return !!i; })];
                }
            });
        });
    };
    /**
     * Archives an order. It only alloved, if the order has been fulfilled
     * and payment has been captured.
     * @param orderId - the order to archive
     * @return the result of the update operation
     */
    OrderService.prototype.archive = function (orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.atomicPhase_(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                            var order, orderRepo;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.retrieve(orderId)];
                                    case 1:
                                        order = _a.sent();
                                        if (order.status !== ("completed" || "refunded")) {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "Can't archive an unprocessed order");
                                        }
                                        order.status = models_1.OrderStatus.ARCHIVED;
                                        orderRepo = manager.getCustomRepository(this.orderRepository_);
                                        return [4 /*yield*/, orderRepo.save(order)];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Refunds a given amount back to the customer.
     * @param orderId - id of the order to refund.
     * @param refundAmount - the amount to refund.
     * @param reason - the reason to refund.
     * @param note - note for refund.
     * @param config - the config for refund.
     * @return the result of the refund operation.
     */
    OrderService.prototype.createRefund = function (orderId, refundAmount, reason, note, config) {
        if (config === void 0) { config = {
            no_notification: undefined,
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var no_notification;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        no_notification = config.no_notification;
                        return [4 /*yield*/, this.atomicPhase_(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                                var order, refund, result, evaluatedNoNotification;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.retrieve(orderId, {
                                                select: ["refundable_amount", "total", "refunded_total"],
                                                relations: ["payments"],
                                            })];
                                        case 1:
                                            order = _a.sent();
                                            if (order.status === "canceled") {
                                                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "A canceled order cannot be refunded");
                                            }
                                            if (refundAmount > order.refundable_amount) {
                                                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "Cannot refund more than the original order amount");
                                            }
                                            return [4 /*yield*/, this.paymentProviderService_
                                                    .withTransaction(manager)
                                                    .refundPayment(order.payments, refundAmount, reason, note)];
                                        case 2:
                                            refund = _a.sent();
                                            return [4 /*yield*/, this.retrieve(orderId)];
                                        case 3:
                                            result = _a.sent();
                                            evaluatedNoNotification = no_notification !== undefined ? no_notification : order.no_notification;
                                            this.eventBus_.emit(OrderService.Events.REFUND_CREATED, {
                                                id: result.id,
                                                refund_id: refund.id,
                                                no_notification: evaluatedNoNotification,
                                            });
                                            return [2 /*return*/, result];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OrderService.prototype.decorateTotals = function (order, totalsFields) {
        if (totalsFields === void 0) { totalsFields = []; }
        return __awaiter(this, void 0, void 0, function () {
            var totalsFields_1, totalsFields_1_1, totalField, _a, _b, giftCardBreakdown, _c, _d, _e, _f, paid_total, refunded_total, items, _g, _h, item, _j, _k, _l, e_16_1, _m, _o, s, items, _p, _q, item, _r, _s, _t, e_17_1, e_18_1, _u, _v, c, items, _w, _x, item, _y, _z, _0, e_19_1, e_20_1, e_21_1;
            var e_21, _1, e_16, _2, _3, e_18, _4, e_17, _5, _6, e_20, _7, e_19, _8, _9;
            return __generator(this, function (_10) {
                switch (_10.label) {
                    case 0:
                        _10.trys.push([0, 59, 60, 61]);
                        totalsFields_1 = __values(totalsFields), totalsFields_1_1 = totalsFields_1.next();
                        _10.label = 1;
                    case 1:
                        if (!!totalsFields_1_1.done) return [3 /*break*/, 58];
                        totalField = totalsFields_1_1.value;
                        _a = totalField;
                        switch (_a) {
                            case "shipping_total": return [3 /*break*/, 2];
                            case "gift_card_total": return [3 /*break*/, 4];
                            case "discount_total": return [3 /*break*/, 6];
                            case "tax_total": return [3 /*break*/, 8];
                            case "subtotal": return [3 /*break*/, 10];
                            case "total": return [3 /*break*/, 12];
                            case "refunded_total": return [3 /*break*/, 14];
                            case "paid_total": return [3 /*break*/, 15];
                            case "refundable_amount": return [3 /*break*/, 16];
                            case "items.refundable": return [3 /*break*/, 17];
                            case "swaps.additional_items.refundable": return [3 /*break*/, 26];
                            case "claims.additional_items.refundable": return [3 /*break*/, 41];
                        }
                        return [3 /*break*/, 56];
                    case 2:
                        _b = order;
                        return [4 /*yield*/, this.totalsService_.getShippingTotal(order)];
                    case 3:
                        _b.shipping_total = _10.sent();
                        return [3 /*break*/, 57];
                    case 4: return [4 /*yield*/, this.totalsService_.getGiftCardTotal(order)];
                    case 5:
                        giftCardBreakdown = _10.sent();
                        order.gift_card_total = giftCardBreakdown.total;
                        order.gift_card_tax_total = giftCardBreakdown.tax_total;
                        return [3 /*break*/, 57];
                    case 6:
                        _c = order;
                        return [4 /*yield*/, this.totalsService_.getDiscountTotal(order)];
                    case 7:
                        _c.discount_total = _10.sent();
                        return [3 /*break*/, 57];
                    case 8:
                        _d = order;
                        return [4 /*yield*/, this.totalsService_.getTaxTotal(order)];
                    case 9:
                        _d.tax_total = _10.sent();
                        return [3 /*break*/, 57];
                    case 10:
                        _e = order;
                        return [4 /*yield*/, this.totalsService_.getSubtotal(order)];
                    case 11:
                        _e.subtotal = _10.sent();
                        return [3 /*break*/, 57];
                    case 12:
                        _f = order;
                        return [4 /*yield*/, this.totalsService_
                                .withTransaction(this.manager_)
                                .getTotal(order)];
                    case 13:
                        _f.total = _10.sent();
                        return [3 /*break*/, 57];
                    case 14:
                        {
                            order.refunded_total = this.totalsService_.getRefundedTotal(order);
                            return [3 /*break*/, 57];
                        }
                        _10.label = 15;
                    case 15:
                        {
                            order.paid_total = this.totalsService_.getPaidTotal(order);
                            return [3 /*break*/, 57];
                        }
                        _10.label = 16;
                    case 16:
                        {
                            paid_total = this.totalsService_.getPaidTotal(order);
                            refunded_total = this.totalsService_.getRefundedTotal(order);
                            order.refundable_amount = paid_total - refunded_total;
                            return [3 /*break*/, 57];
                        }
                        _10.label = 17;
                    case 17:
                        items = [];
                        _10.label = 18;
                    case 18:
                        _10.trys.push([18, 23, 24, 25]);
                        _g = (e_16 = void 0, __values(order.items)), _h = _g.next();
                        _10.label = 19;
                    case 19:
                        if (!!_h.done) return [3 /*break*/, 22];
                        item = _h.value;
                        _k = (_j = items).push;
                        _l = [__assign({}, item)];
                        _3 = {};
                        return [4 /*yield*/, this.totalsService_.getLineItemRefund(order, __assign(__assign({}, item), { quantity: item.quantity - (item.returned_quantity || 0) }))];
                    case 20:
                        _k.apply(_j, [__assign.apply(void 0, _l.concat([(_3.refundable = _10.sent(), _3)]))]);
                        _10.label = 21;
                    case 21:
                        _h = _g.next();
                        return [3 /*break*/, 19];
                    case 22: return [3 /*break*/, 25];
                    case 23:
                        e_16_1 = _10.sent();
                        e_16 = { error: e_16_1 };
                        return [3 /*break*/, 25];
                    case 24:
                        try {
                            if (_h && !_h.done && (_2 = _g.return)) _2.call(_g);
                        }
                        finally { if (e_16) throw e_16.error; }
                        return [7 /*endfinally*/];
                    case 25:
                        order.items = items;
                        return [3 /*break*/, 57];
                    case 26:
                        _10.trys.push([26, 38, 39, 40]);
                        _m = (e_18 = void 0, __values(order.swaps)), _o = _m.next();
                        _10.label = 27;
                    case 27:
                        if (!!_o.done) return [3 /*break*/, 37];
                        s = _o.value;
                        items = [];
                        _10.label = 28;
                    case 28:
                        _10.trys.push([28, 33, 34, 35]);
                        _p = (e_17 = void 0, __values(s.additional_items)), _q = _p.next();
                        _10.label = 29;
                    case 29:
                        if (!!_q.done) return [3 /*break*/, 32];
                        item = _q.value;
                        _s = (_r = items).push;
                        _t = [__assign({}, item)];
                        _6 = {};
                        return [4 /*yield*/, this.totalsService_.getLineItemRefund(order, __assign(__assign({}, item), { quantity: item.quantity - (item.returned_quantity || 0) }))];
                    case 30:
                        _s.apply(_r, [__assign.apply(void 0, _t.concat([(_6.refundable = _10.sent(), _6)]))]);
                        _10.label = 31;
                    case 31:
                        _q = _p.next();
                        return [3 /*break*/, 29];
                    case 32: return [3 /*break*/, 35];
                    case 33:
                        e_17_1 = _10.sent();
                        e_17 = { error: e_17_1 };
                        return [3 /*break*/, 35];
                    case 34:
                        try {
                            if (_q && !_q.done && (_5 = _p.return)) _5.call(_p);
                        }
                        finally { if (e_17) throw e_17.error; }
                        return [7 /*endfinally*/];
                    case 35:
                        s.additional_items = items;
                        _10.label = 36;
                    case 36:
                        _o = _m.next();
                        return [3 /*break*/, 27];
                    case 37: return [3 /*break*/, 40];
                    case 38:
                        e_18_1 = _10.sent();
                        e_18 = { error: e_18_1 };
                        return [3 /*break*/, 40];
                    case 39:
                        try {
                            if (_o && !_o.done && (_4 = _m.return)) _4.call(_m);
                        }
                        finally { if (e_18) throw e_18.error; }
                        return [7 /*endfinally*/];
                    case 40: return [3 /*break*/, 57];
                    case 41:
                        _10.trys.push([41, 53, 54, 55]);
                        _u = (e_20 = void 0, __values(order.claims)), _v = _u.next();
                        _10.label = 42;
                    case 42:
                        if (!!_v.done) return [3 /*break*/, 52];
                        c = _v.value;
                        items = [];
                        _10.label = 43;
                    case 43:
                        _10.trys.push([43, 48, 49, 50]);
                        _w = (e_19 = void 0, __values(c.additional_items)), _x = _w.next();
                        _10.label = 44;
                    case 44:
                        if (!!_x.done) return [3 /*break*/, 47];
                        item = _x.value;
                        _z = (_y = items).push;
                        _0 = [__assign({}, item)];
                        _9 = {};
                        return [4 /*yield*/, this.totalsService_.getLineItemRefund(order, __assign(__assign({}, item), { quantity: item.quantity - (item.returned_quantity || 0) }))];
                    case 45:
                        _z.apply(_y, [__assign.apply(void 0, _0.concat([(_9.refundable = _10.sent(), _9)]))]);
                        _10.label = 46;
                    case 46:
                        _x = _w.next();
                        return [3 /*break*/, 44];
                    case 47: return [3 /*break*/, 50];
                    case 48:
                        e_19_1 = _10.sent();
                        e_19 = { error: e_19_1 };
                        return [3 /*break*/, 50];
                    case 49:
                        try {
                            if (_x && !_x.done && (_8 = _w.return)) _8.call(_w);
                        }
                        finally { if (e_19) throw e_19.error; }
                        return [7 /*endfinally*/];
                    case 50:
                        c.additional_items = items;
                        _10.label = 51;
                    case 51:
                        _v = _u.next();
                        return [3 /*break*/, 42];
                    case 52: return [3 /*break*/, 55];
                    case 53:
                        e_20_1 = _10.sent();
                        e_20 = { error: e_20_1 };
                        return [3 /*break*/, 55];
                    case 54:
                        try {
                            if (_v && !_v.done && (_7 = _u.return)) _7.call(_u);
                        }
                        finally { if (e_20) throw e_20.error; }
                        return [7 /*endfinally*/];
                    case 55: return [3 /*break*/, 57];
                    case 56:
                        {
                            return [3 /*break*/, 57];
                        }
                        _10.label = 57;
                    case 57:
                        totalsFields_1_1 = totalsFields_1.next();
                        return [3 /*break*/, 1];
                    case 58: return [3 /*break*/, 61];
                    case 59:
                        e_21_1 = _10.sent();
                        e_21 = { error: e_21_1 };
                        return [3 /*break*/, 61];
                    case 60:
                        try {
                            if (totalsFields_1_1 && !totalsFields_1_1.done && (_1 = totalsFields_1.return)) _1.call(totalsFields_1);
                        }
                        finally { if (e_21) throw e_21.error; }
                        return [7 /*endfinally*/];
                    case 61: return [2 /*return*/, order];
                }
            });
        });
    };
    /**
     * Handles receiving a return. This will create a
     * refund to the customer. If the returned items don't match the requested
     * items the return status will be updated to requires_action. This behaviour
     * is useful in sitautions where a custom refund amount is requested, but the
     * retuned items are not matching the requested items. Setting the
     * allowMismatch argument to true, will process the return, ignoring any
     * mismatches.
     * @param orderId - the order to return.
     * @param receivedReturn - the received return
     * @param customRefundAmount - the custom refund amount return
     * @return the result of the update operation
     */
    OrderService.prototype.registerReturnReceived = function (orderId, receivedReturn, customRefundAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.atomicPhase_(function (manager) { return __awaiter(_this, void 0, void 0, function () {
                            var order, refundAmount, orderRepo, result_2, isFullReturn, _a, _b, i, refund, result;
                            var e_22, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, this.retrieve(orderId, {
                                            select: ["total", "refunded_total", "refundable_amount"],
                                            relations: ["items", "returns", "payments"],
                                        })];
                                    case 1:
                                        order = _d.sent();
                                        if (order.status === "canceled") {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_ALLOWED, "A canceled order cannot be registered as received");
                                        }
                                        if (!receivedReturn || receivedReturn.order_id !== orderId) {
                                            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_FOUND, "Received return does not exist");
                                        }
                                        refundAmount = customRefundAmount || receivedReturn.refund_amount;
                                        orderRepo = manager.getCustomRepository(this.orderRepository_);
                                        if (!(refundAmount > order.refundable_amount)) return [3 /*break*/, 3];
                                        order.fulfillment_status = models_1.FulfillmentStatus.REQUIRES_ACTION;
                                        return [4 /*yield*/, orderRepo.save(order)];
                                    case 2:
                                        result_2 = _d.sent();
                                        this.eventBus_
                                            .withTransaction(manager)
                                            .emit(OrderService.Events.RETURN_ACTION_REQUIRED, {
                                            id: result_2.id,
                                            return_id: receivedReturn.id,
                                            no_notification: receivedReturn.no_notification,
                                        });
                                        return [2 /*return*/, result_2];
                                    case 3:
                                        isFullReturn = true;
                                        try {
                                            for (_a = __values(order.items), _b = _a.next(); !_b.done; _b = _a.next()) {
                                                i = _b.value;
                                                if (i.returned_quantity !== i.quantity) {
                                                    isFullReturn = false;
                                                }
                                            }
                                        }
                                        catch (e_22_1) { e_22 = { error: e_22_1 }; }
                                        finally {
                                            try {
                                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                            }
                                            finally { if (e_22) throw e_22.error; }
                                        }
                                        if (!(receivedReturn.refund_amount > 0)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, this.paymentProviderService_
                                                .withTransaction(manager)
                                                .refundPayment(order.payments, receivedReturn.refund_amount, "return")];
                                    case 4:
                                        refund = _d.sent();
                                        order.refunds = __spreadArray(__spreadArray([], __read((order.refunds || [])), false), [refund], false);
                                        _d.label = 5;
                                    case 5:
                                        if (isFullReturn) {
                                            order.fulfillment_status = models_1.FulfillmentStatus.RETURNED;
                                        }
                                        else {
                                            order.fulfillment_status = models_1.FulfillmentStatus.PARTIALLY_RETURNED;
                                        }
                                        return [4 /*yield*/, orderRepo.save(order)];
                                    case 6:
                                        result = _d.sent();
                                        return [4 /*yield*/, this.eventBus_
                                                .withTransaction(manager)
                                                .emit(OrderService.Events.ITEMS_RETURNED, {
                                                id: order.id,
                                                return_id: receivedReturn.id,
                                                no_notification: receivedReturn.no_notification,
                                            })];
                                    case 7:
                                        _d.sent();
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OrderService.Events = {
        GIFT_CARD_CREATED: "order.gift_card_created",
        PAYMENT_CAPTURED: "order.payment_captured",
        PAYMENT_CAPTURE_FAILED: "order.payment_capture_failed",
        SHIPMENT_CREATED: "order.shipment_created",
        FULFILLMENT_CREATED: "order.fulfillment_created",
        FULFILLMENT_CANCELED: "order.fulfillment_canceled",
        RETURN_REQUESTED: "order.return_requested",
        ITEMS_RETURNED: "order.items_returned",
        RETURN_ACTION_REQUIRED: "order.return_action_required",
        REFUND_CREATED: "order.refund_created",
        REFUND_FAILED: "order.refund_failed",
        SWAP_CREATED: "order.swap_created",
        PLACED: "order.placed",
        UPDATED: "order.updated",
        CANCELED: "order.canceled",
        COMPLETED: "order.completed",
    };
    return OrderService;
}(interfaces_1.TransactionBaseService));
exports.default = OrderService;
//# sourceMappingURL=order.js.map