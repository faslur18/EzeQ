"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hours_controller_1 = require("./hours.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/:salonId/hours', hours_controller_1.HoursController.findAll);
router.post('/:salonId/hours', auth_middleware_1.authenticate, hours_controller_1.HoursController.setAll);
router.patch('/:salonId/hours/:id', auth_middleware_1.authenticate, hours_controller_1.HoursController.update);
router.delete('/:salonId/hours/:id', auth_middleware_1.authenticate, hours_controller_1.HoursController.remove);
exports.default = router;
//# sourceMappingURL=hours.routes.js.map