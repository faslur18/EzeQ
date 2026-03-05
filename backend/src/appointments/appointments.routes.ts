import { Router } from 'express';
import { AppointmentsController } from './appointments.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, AppointmentsController.findAll);
router.post('/', authenticate, AppointmentsController.create);
router.get('/:id', authenticate, AppointmentsController.findOne);
router.patch('/:id/status', authenticate, AppointmentsController.updateStatus);
router.delete('/:id', authenticate, AppointmentsController.remove);

export default router;
