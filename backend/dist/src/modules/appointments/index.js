"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsModule = void 0;
const appointments_routes_1 = __importDefault(require("../../appointments/appointments.routes"));
exports.appointmentsModule = {
    path: '/appointments',
    router: appointments_routes_1.default,
};
//# sourceMappingURL=index.js.map