import { Router } from 'express';
import { trackProductView, getDashboardStats } from '../controllers/analytics.controller';

const router = Router();

router.post('/track-view', trackProductView);
router.get('/dashboard', getDashboardStats);

export default router;
