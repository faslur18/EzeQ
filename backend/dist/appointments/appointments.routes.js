"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointments_controller_1 = require("./appointments.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticate, appointments_controller_1.AppointmentsController.findAll);
router.post('/', auth_middleware_1.authenticate, appointments_controller_1.AppointmentsController.create);
router.get('/:id', auth_middleware_1.authenticate, appointments_controller_1.AppointmentsController.findOne);
router.patch('/:id/status', auth_middleware_1.authenticate, appointments_controller_1.AppointmentsController.updateStatus);
router.delete('/:id', auth_middleware_1.authenticate, appointments_controller_1.AppointmentsController.remove);
exports.default = router;
//# sourceMappingURL=appointments.routes.js.map