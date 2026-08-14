import { Router } from "express";
import {
  driverTest,
  adminTest,
} from "../controllers/testController";
import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/driver",
  authenticate,
  authorize("DRIVER"),
  driverTest
);

router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  adminTest
);

export default router;