import { Router } from "express";
import {
  createBreakdownRequest,
  getMyBreakdownRequests,
  getPendingRequests,
  getMyAssignedRequests,
  acceptBreakdownRequest,
  updateRequestStatus,
  getBreakdownRequestById,
  cancelBreakdownRequest,
} from "../controllers/breakdownRequestController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, createBreakdownRequest);
router.get("/", authenticate, getMyBreakdownRequests);
router.get(
  "/pending",
  authenticate,
  authorize("SERVICE_PROVIDER"),
  getPendingRequests
);
router.get(
  "/my-assigned",
  authenticate,
  authorize("SERVICE_PROVIDER"),
  getMyAssignedRequests
);

router.patch(
  "/:id/accept",
  authenticate,
  authorize("SERVICE_PROVIDER"),
  acceptBreakdownRequest
);
router.patch(
  "/:id/status",
  authenticate,
  authorize("SERVICE_PROVIDER"),
  updateRequestStatus
);
router.get(
  "/:id",
  authenticate,
  getBreakdownRequestById
);
router.patch(
  "/:id/cancel",
  authenticate,
  cancelBreakdownRequest
);

export default router;