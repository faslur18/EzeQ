"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSalonsModule = void 0;
const admin_salons_routes_1 = __importDefault(require("../../admin-salons/admin-salons.routes"));
exports.adminSalonsModule = {
    path: '/admin-salons',
    router: admin_salons_routes_1.default,
};
//# sourceMappingURL=index.js.map