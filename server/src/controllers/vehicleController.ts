import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { prisma } from "../config/prisma";

export const createVehicle = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      registrationNumber,
      make,
      model,
      year,
    } = req.body;

    // Validate required fields
    if (!registrationNumber || !make || !model || !year) {
      return res.status(400).json({
        message:
          "Registration number, make, model and year are required",
      });
    }

    // Check if registration number already exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        registrationNumber,
      },
    });

    if (existingVehicle) {
      return res.status(409).json({
        message: "Vehicle registration number already exists",
      });
    }

    // Create vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        userId,
        registrationNumber,
        make,
        model,
        year: Number(year),
      },
    });

    return res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
    });
  } catch (error) {
    console.error("Create vehicle error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getVehicles = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      vehicles,
    });
  } catch (error) {
    console.error("Get vehicles error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getVehicleById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const vehicleId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: userId,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      vehicle,
    });
  } catch (error) {
    console.error("Get vehicle error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const updateVehicle = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const vehicleId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    const {
      registrationNumber,
      make,
      model,
      year,
    } = req.body;

    // Check whether the vehicle belongs to the logged-in user
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId,
      },
    });

    if (!existingVehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // Check if the new registration number is already used
    if (
      registrationNumber &&
      registrationNumber !== existingVehicle.registrationNumber
    ) {
      const duplicateVehicle = await prisma.vehicle.findUnique({
        where: {
          registrationNumber,
        },
      });

      if (duplicateVehicle) {
        return res.status(409).json({
          message: "Vehicle registration number already exists",
        });
      }
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: {
        id: vehicleId,
      },
      data: {
        ...(registrationNumber && { registrationNumber }),
        ...(make && { make }),
        ...(model && { model }),
        ...(year !== undefined && { year: Number(year) }),
      },
    });

    return res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    console.error("Update vehicle error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const deleteVehicle = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const vehicleId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    // Check ownership
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    await prisma.vehicle.delete({
      where: {
        id: vehicleId,
      },
    });

    return res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Delete vehicle error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};