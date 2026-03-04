"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoursModule = void 0;
const common_1 = require("@nestjs/common");
const hours_controller_1 = require("./hours.controller");
const hours_service_1 = require("./hours.service");
let HoursModule = class HoursModule {
};
exports.HoursModule = HoursModule;
exports.HoursModule = HoursModule = __decorate([
    (0, common_1.Module)({
        controllers: [hours_controller_1.HoursController],
        providers: [hours_service_1.HoursService],
        exports: [hours_service_1.HoursService],
    })
], HoursModule);
//# sourceMappingURL=hours.module.js.map