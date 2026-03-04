"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const salons_module_1 = require("./salons/salons.module");
const services_module_1 = require("./services/services.module");
const hours_module_1 = require("./hours/hours.module");
const appointments_module_1 = require("./appointments/appointments.module");
const users_module_1 = require("./users/users.module");
const admin_salons_module_1 = require("./admin-salons/admin-salons.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            salons_module_1.SalonsModule,
            services_module_1.ServicesModule,
            hours_module_1.HoursModule,
            appointments_module_1.AppointmentsModule,
            users_module_1.UsersModule,
            admin_salons_module_1.AdminSalonsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map