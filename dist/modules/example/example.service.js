"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleService = void 0;
const medusa_interfaces_1 = require("medusa-interfaces");
const medusa_extender_1 = require("medusa-extender");
let ExampleService = class ExampleService extends medusa_interfaces_1.BaseService {
    constructor({ manager }, config) {
        super();
        this.config = config;
        this.manager = manager;
    }
};
ExampleService.resolutionKey = 'exampleService';
ExampleService = __decorate([
    (0, medusa_extender_1.Service)(),
    __metadata("design:paramtypes", [Object, Object])
], ExampleService);
exports.ExampleService = ExampleService;
//# sourceMappingURL=example.service.js.map