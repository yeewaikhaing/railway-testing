"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require('../medusa-config');
const medusa_extender_1 = require("medusa-extender");
const path_1 = require("path");
const example_module_1 = require("./modules/example/example.module");
const store_module_1 = require("./modules/store/store.module");
const user_module_1 = require("./modules/user/user.module");
const product_module_1 = require("./modules/product/product.module");
const order_module_1 = require("./modules/order/order.module");
const invite_module_1 = require("./modules/invite/invite.module");
const role_module_1 = require("./modules/role/role.module");
const permission_module_1 = require("./modules/permission/permission.module");
const customer_module_1 = require("./modules/customer/customer.module");
const priceGroup_module_1 = require("./modules/priceGroup/priceGroup.module");
const auth_module_1 = require("./modules/auth/auth.module");
async function bootstrap() {
    var _a, _b;
    const expressInstance = express();
    await new medusa_extender_1.Medusa((0, path_1.resolve)(__dirname, '..'), expressInstance).load([
        example_module_1.ExampleModule,
        store_module_1.StoreModule,
        product_module_1.ProductModule,
        order_module_1.OrderModule,
        invite_module_1.InviteModule,
        role_module_1.RoleModule,
        permission_module_1.PermissionModule,
        user_module_1.UserModule,
        customer_module_1.CustomerModule,
        auth_module_1.AuthModule,
        priceGroup_module_1.PriceGroupModule,
    ]);
    const port = (_b = (_a = config === null || config === void 0 ? void 0 : config.serverConfig) === null || _a === void 0 ? void 0 : _a.port) !== null && _b !== void 0 ? _b : 9000;
    expressInstance.listen(port, () => {
        console.info('Server successfully started on port ' + port);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map