import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';

const router = Router();

// /api/projects istekleri buraya düşecek
router.post('/', ProjectController.save);
router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);
router.delete('/:id', ProjectController.delete);

export default router;