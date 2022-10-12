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
Object.defineProperty(exports, "__esModule", { value: true });
var search_service_1 = require("../interfaces/search-service");
var DefaultSearchService = /** @class */ (function (_super) {
    __extends(DefaultSearchService, _super);
    function DefaultSearchService(_a, options) {
        var logger = _a.logger, manager = _a.manager;
        var _this = _super.call(this, {
            logger: logger,
        }, options) || this;
        _this.isDefault = true;
        _this.options_ = options;
        _this.logger_ = logger;
        _this.manager_ = manager;
        return _this;
    }
    DefaultSearchService.prototype.createIndex = function (indexName, options) {
        this.logger_.warn("This is an empty method: createIndex must be overridden by a child class");
    };
    DefaultSearchService.prototype.getIndex = function (indexName) {
        this.logger_.warn("This is an empty method: getIndex must be overridden by a child class");
    };
    DefaultSearchService.prototype.addDocuments = function (indexName, documents, type) {
        this.logger_.warn("This is an empty method: addDocuments must be overridden by a child class");
    };
    DefaultSearchService.prototype.replaceDocuments = function (indexName, documents, type) {
        this.logger_.warn("This is an empty method: replaceDocuments must be overridden by a child class");
    };
    DefaultSearchService.prototype.deleteDocument = function (indexName, document_id) {
        this.logger_.warn("This is an empty method: deleteDocument must be overridden by a child class");
    };
    DefaultSearchService.prototype.deleteAllDocuments = function (indexName) {
        this.logger_.warn("This is an empty method: deleteAllDocuments must be overridden by a child class");
    };
    DefaultSearchService.prototype.search = function (indexName, query, options) {
        this.logger_.warn("This is an empty method: search must be overridden a the child class");
        return { hits: [] };
    };
    DefaultSearchService.prototype.updateSettings = function (indexName, settings) {
        this.logger_.warn("This is an empty method: updateSettings must be overridden by a child class");
    };
    return DefaultSearchService;
}(search_service_1.AbstractSearchService));
exports.default = DefaultSearchService;
//# sourceMappingURL=search.js.map