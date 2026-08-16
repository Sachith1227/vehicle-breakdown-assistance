import { Router } from "express";
import {
  createMechanicProfile,
  getMechanicProfile,
  updateAvailability,
} from "../controllers/mechanicController";
import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/profile",
  authenticate,
  authorize("SERVICE_PROVIDER"),
  createMechanicProfile
);
router.get(
  "/profile",
  authenticate,
  authorize("SERVICE_PROVIDER"),
  getMechanicProfile
);

router.patch(
  "/availability",
  authenticate,
  authorize("SERVICE_PROVIDER"),
  updateAvailability
);

export default router;