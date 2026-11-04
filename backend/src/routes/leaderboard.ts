import { Router } from 'express';
import {
  getLeaderboard,
  getLeaderboardStats,
  getAmbassadorById,
} from '../controllers/leaderboardController';

const router = Router();

// Stats must be registered BEFORE :id parameter route
router.get('/stats', getLeaderboardStats);
router.get('/:id', getAmbassadorById);
router.get('/', getLeaderboard);

export default router;
