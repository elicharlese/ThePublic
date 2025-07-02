import { Router } from 'express';
import { NetworkController } from '@/controllers/networkController';

const router = Router();

// Public network routes
router.get('/stats', NetworkController.getNetworkStats);
router.get('/map', NetworkController.getNetworkMap);
router.get('/activity', NetworkController.getNetworkActivity);
router.get('/nodes/:nodeId/connections', NetworkController.getNodeConnections);

export { router as networkRoutes };
