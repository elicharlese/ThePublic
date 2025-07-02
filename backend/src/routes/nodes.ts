import { Router } from 'express';
import { NodeController } from '@/controllers/nodeController';
import { requireRole } from '@/middleware/auth';

const router = Router();

// Public routes
router.get('/', NodeController.getAllNodes);
router.get('/:id', NodeController.getNodeById);
router.get('/:id/rewards', NodeController.getNodeRewards);

// Node operator routes
router.post('/', requireRole('node_operator'), NodeController.createNode);
router.put('/:id', requireRole('node_operator'), NodeController.updateNode);
router.delete('/:id', requireRole('node_operator'), NodeController.deleteNode);
router.post('/:id/heartbeat', requireRole('node_operator'), NodeController.submitHeartbeat);

export { router as nodeRoutes };
