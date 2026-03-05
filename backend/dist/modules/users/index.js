"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersModule = void 0;
const users_routes_1 = __importDefault(require("../../users/users.routes"));
exports.usersModule = {
    path: '/users',
    router: users_routes_1.default,
};
//# sourceMappingURL=index.js.map