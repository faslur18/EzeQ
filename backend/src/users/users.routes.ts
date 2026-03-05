import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, authorize(['SUPER_ADMIN']), UsersController.findAll);
router.get('/:id', authenticate, authorize(['SUPER_ADMIN']), UsersController.findOne);
router.patch('/:id/role', authenticate, authorize(['SUPER_ADMIN']), UsersController.updateRole);
router.delete('/:id', authenticate, authorize(['SUPER_ADMIN']), UsersController.remove);

export default router;
