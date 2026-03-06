"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const modules_1 = require("../modules");
const v1Router = (0, express_1.Router)();
for (const moduleDef of modules_1.apiModules) {
    if ('router' in moduleDef) {
        v1Router.use(moduleDef.path, moduleDef.router);
        continue;
    }
    for (const router of moduleDef.routers) {
        v1Router.use(moduleDef.path, router);
    }
}
exports.default = v1Router;
//# sourceMappingURL=v1.js.map