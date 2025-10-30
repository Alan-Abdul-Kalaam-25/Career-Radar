import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  suggestFromUserDetails,
  submitDetailedIntake,
  submitQuestionnaire,
  getHistory,
  getAttempt,
} from "../controllers/careerController.js";

const router = Router();
router.post("/user-details", requireAuth, suggestFromUserDetails);
router.post("/intake", requireAuth, submitDetailedIntake);
router.post("/qa/submit", requireAuth, submitQuestionnaire);
router.get("/history", requireAuth, getHistory);
router.get("/attempt/:id", requireAuth, getAttempt);

export default router;
