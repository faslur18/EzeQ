import { Router } from 'express';
import { SalonsController } from './salons.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', SalonsController.findAll);
router.get('/:id', SalonsController.findOne);

// Protected routes (SALON_ADMIN)
router.get('/my/salon', authenticate, SalonsController.findMySalon);
router.post('/', authenticate, authorize(['SALON_ADMIN']), SalonsController.create);
router.patch('/:id', authenticate, SalonsController.update);
router.delete('/:id', authenticate, SalonsController.remove);

export default router;
