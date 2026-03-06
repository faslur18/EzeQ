"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salonModule = void 0;
const salons_routes_1 = __importDefault(require("../../salons/salons.routes"));
const services_routes_1 = __importDefault(require("../../services/services.routes"));
const hours_routes_1 = __importDefault(require("../../hours/hours.routes"));
exports.salonModule = {
    path: '/salons',
    routers: [salons_routes_1.default, services_routes_1.default, hours_routes_1.default],
};
//# sourceMappingURL=index.js.map