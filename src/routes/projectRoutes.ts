import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.use(requireAuth);
router.post('/', ProjectController.save);
router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);
router.delete('/:id', ProjectController.delete);

export default router;
