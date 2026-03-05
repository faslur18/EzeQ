"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['SUPER_ADMIN']), users_controller_1.UsersController.findAll);
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['SUPER_ADMIN']), users_controller_1.UsersController.findOne);
router.patch('/:id/role', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['SUPER_ADMIN']), users_controller_1.UsersController.updateRole);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['SUPER_ADMIN']), users_controller_1.UsersController.remove);
exports.default = router;
//# sourceMappingURL=users.routes.js.map