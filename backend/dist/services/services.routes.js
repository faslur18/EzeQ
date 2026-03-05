"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_controller_1 = require("./services.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/:salonId/services', services_controller_1.ServicesController.findAll);
router.get('/:salonId/services/:id', services_controller_1.ServicesController.findOne);
router.post('/:salonId/services', auth_middleware_1.authenticate, services_controller_1.ServicesController.create);
router.patch('/:salonId/services/:id', auth_middleware_1.authenticate, services_controller_1.ServicesController.update);
router.delete('/:salonId/services/:id', auth_middleware_1.authenticate, services_controller_1.ServicesController.remove);
exports.default = router;
//# sourceMappingURL=services.routes.js.map