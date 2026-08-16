import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, createVehicle);

router.get("/", authenticate, getVehicles);

router.get("/:id", authenticate, getVehicleById);

router.put("/:id", authenticate, updateVehicle);

router.delete("/:id", authenticate, deleteVehicle);

export default router;