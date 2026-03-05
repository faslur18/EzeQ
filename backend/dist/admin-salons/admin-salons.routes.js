"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_salons_controller_1 = require("./admin-salons.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['SUPER_ADMIN']), admin_salons_controller_1.AdminSalonsController.findAll);
router.patch('/:id/status', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['SUPER_ADMIN']), admin_salons_controller_1.AdminSalonsController.updateStatus);
exports.default = router;
//# sourceMappingURL=admin-salons.routes.js.map