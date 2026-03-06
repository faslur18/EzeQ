"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salons_controller_1 = require("./salons.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', salons_controller_1.SalonsController.findAll);
router.get('/my/salon', auth_middleware_1.authenticate, salons_controller_1.SalonsController.findMySalon);
router.get('/:id', salons_controller_1.SalonsController.findOne);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['SALON_ADMIN']), salons_controller_1.SalonsController.create);
router.patch('/:id', auth_middleware_1.authenticate, salons_controller_1.SalonsController.update);
router.delete('/:id', auth_middleware_1.authenticate, salons_controller_1.SalonsController.remove);
exports.default = router;
//# sourceMappingURL=salons.routes.js.map