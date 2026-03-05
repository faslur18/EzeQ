import { Router } from 'express';
import { ServicesController } from './services.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Routes are relative to /salons/:salonId/services
router.get('/:salonId/services', ServicesController.findAll);
router.get('/:salonId/services/:id', ServicesController.findOne);
router.post('/:salonId/services', authenticate, ServicesController.create);
router.patch('/:salonId/services/:id', authenticate, ServicesController.update);
router.delete('/:salonId/services/:id', authenticate, ServicesController.remove);

export default router;
