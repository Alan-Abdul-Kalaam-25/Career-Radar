import { Router } from 'express';
import { getQuestions } from '../controllers/questionController.js';

const router = Router();
router.get('/', getQuestions);

export default router;


