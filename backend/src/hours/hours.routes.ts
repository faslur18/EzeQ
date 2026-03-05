import { Router } from 'express';
import { HoursController } from './hours.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Routes are relative to /salons/:salonId/hours
router.get('/:salonId/hours', HoursController.findAll);
router.post('/:salonId/hours', authenticate, HoursController.setAll);
router.patch('/:salonId/hours/:id', authenticate, HoursController.update);
router.delete('/:salonId/hours/:id', authenticate, HoursController.remove);

export default router;
