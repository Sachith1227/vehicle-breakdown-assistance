import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { prisma } from "../config/prisma";

export const createMechanicProfile = async (
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
      businessName,
      phone,
      latitude,
      longitude,
    } = req.body;

    // Validate required fields
    if (
      !businessName ||
      !phone ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message:
          "Business name, phone, latitude and longitude are required",
      });
    }

    // Check whether this user already has a mechanic profile
    const existingMechanic = await prisma.mechanic.findUnique({
      where: {
        userId,
      },
    });

    if (existingMechanic) {
      return res.status(409).json({
        message: "Mechanic profile already exists",
      });
    }

    // Create mechanic profile
    const mechanic = await prisma.mechanic.create({
      data: {
        userId,
        businessName,
        phone,
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    });

    return res.status(201).json({
      message: "Mechanic profile created successfully",
      mechanic,
    });
  } catch (error) {
    console.error("Create mechanic profile error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getMechanicProfile = async (
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

    const mechanic = await prisma.mechanic.findUnique({
      where: {
        userId,
      },
    });

    if (!mechanic) {
      return res.status(404).json({
        message: "Mechanic profile not found",
      });
    }

    return res.status(200).json({
      mechanic,
    });
  } catch (error) {
    console.error("Get mechanic profile error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateAvailability = async (
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

    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        message: "isAvailable must be a boolean",
      });
    }

    const mechanic = await prisma.mechanic.findUnique({
      where: {
        userId,
      },
    });

    if (!mechanic) {
      return res.status(404).json({
        message: "Mechanic profile not found",
      });
    }

    const updatedMechanic = await prisma.mechanic.update({
      where: {
        userId,
      },
      data: {
        isAvailable,
      },
    });

    return res.status(200).json({
      message: "Availability updated successfully",
      mechanic: updatedMechanic,
    });
  } catch (error) {
    console.error("Update availability error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};