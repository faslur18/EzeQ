import { Router } from 'express';
import { AdminSalonsController } from './admin-salons.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, authorize(['SUPER_ADMIN']), AdminSalonsController.findAll);
router.patch('/:id/status', authenticate, authorize(['SUPER_ADMIN']), AdminSalonsController.updateStatus);

export default router;

