"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiModules = void 0;
const auth_1 = require("./auth");
const salons_1 = require("./salons");
const appointments_1 = require("./appointments");
const users_1 = require("./users");
const admin_salons_1 = require("./admin-salons");
exports.apiModules = [
    auth_1.authModule,
    salons_1.salonModule,
    appointments_1.appointmentsModule,
    users_1.usersModule,
    admin_salons_1.adminSalonsModule,
];
//# sourceMappingURL=index.js.map