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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoursController = void 0;
const common_1 = require("@nestjs/common");
const hours_service_1 = require("./hours.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const guards_1 = require("../common/guards");
const decorators_1 = require("../common/decorators");
let HoursController = class HoursController {
    hoursService;
    constructor(hoursService) {
        this.hoursService = hoursService;
    }
    async findAll(salonId) {
        return this.hoursService.findAll(salonId);
    }
    async setAll(salonId, userId, dto) {
        return this.hoursService.setAll(salonId, userId, dto);
    }
    async update(salonId, id, userId, dto) {
        return this.hoursService.update(salonId, id, userId, dto);
    }
    async remove(salonId, id, userId) {
        return this.hoursService.remove(salonId, id, userId);
    }
};
exports.HoursController = HoursController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('salonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HoursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, decorators_1.Roles)('SALON_ADMIN'),
    __param(0, (0, common_1.Param)('salonId')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dto_1.SetHoursDto]),
    __metadata("design:returntype", Promise)
], HoursController.prototype, "setAll", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, decorators_1.Roles)('SALON_ADMIN'),
    __param(0, (0, common_1.Param)('salonId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, decorators_1.CurrentUser)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, dto_1.UpdateHourDto]),
    __metadata("design:returntype", Promise)
], HoursController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, decorators_1.Roles)('SALON_ADMIN'),
    __param(0, (0, common_1.Param)('salonId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], HoursController.prototype, "remove", null);
exports.HoursController = HoursController = __decorate([
    (0, common_1.Controller)('salons/:salonId/hours'),
    __metadata("design:paramtypes", [hours_service_1.HoursService])
], HoursController);
//# sourceMappingURL=hours.controller.js.map