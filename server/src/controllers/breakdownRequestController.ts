import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { prisma } from "../config/prisma";

export const createBreakdownRequest = async (
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
      vehicleId,
      problemType,
      description,
      latitude,
      longitude,
    } = req.body;

    // Validate required fields
    if (
      vehicleId === undefined ||
      !problemType ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message:
          "Vehicle ID, problem type, latitude and longitude are required",
      });
    }

    const parsedVehicleId = Number(vehicleId);

    if (isNaN(parsedVehicleId)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    // Check that the vehicle belongs to the logged-in user
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: parsedVehicleId,
        userId,
      },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // Create breakdown request
    const request = await prisma.breakdownRequest.create({
      data: {
        userId,
        vehicleId: parsedVehicleId,
        problemType,
        description,
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    });

    return res.status(201).json({
      message: "Breakdown request created successfully",
      request,
    });
  } catch (error) {
    console.error("Create breakdown request error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMyBreakdownRequests = async (
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

    const requests = await prisma.breakdownRequest.findMany({
      where: {
        userId,
      },
      include: {
        vehicle: true,
        mechanic: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error("Get breakdown requests error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getPendingRequests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const requests = await prisma.breakdownRequest.findMany({
      where: {
        status: "REQUESTED",
        mechanicId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        vehicle: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error("Get pending requests error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMyAssignedRequests = async (
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

    // Find the mechanic profile of the logged-in service provider
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

    // Get requests assigned to this mechanic
    const requests =
      await prisma.breakdownRequest.findMany({
        where: {
          mechanicId: mechanic.id,

          // Active requests only
          status: {
            in: [
              "ACCEPTED",
              "ON_THE_WAY",
              "ARRIVED",
              "IN_PROGRESS",
            ],
          },
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          vehicle: true,
          mechanic: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error(
      "Get assigned requests error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const acceptBreakdownRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const requestId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (isNaN(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID",
      });
    }

    // Find the mechanic profile of the logged-in service provider
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

    // Check mechanic availability
    if (!mechanic.isAvailable) {
      return res.status(400).json({
        message: "Mechanic is currently unavailable",
      });
    }

    // Find the breakdown request
    const breakdownRequest =
      await prisma.breakdownRequest.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!breakdownRequest) {
      return res.status(404).json({
        message: "Breakdown request not found",
      });
    }

    // Make sure the request is still available
    if (
      breakdownRequest.status !== "REQUESTED" ||
      breakdownRequest.mechanicId !== null
    ) {
      return res.status(409).json({
        message: "Breakdown request is no longer available",
      });
    }

    // Assign mechanic and update status
    const updatedRequest =
      await prisma.breakdownRequest.update({
        where: {
          id: requestId,
        },
        data: {
          mechanicId: mechanic.id,
          status: "ACCEPTED",
        },
        include: {
          vehicle: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          mechanic: true,
        },
      });

    return res.status(200).json({
      message: "Breakdown request accepted successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Accept breakdown request error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateRequestStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const requestId = Number(req.params.id);
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (isNaN(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const allowedStatuses = [
      "ON_THE_WAY",
      "ARRIVED",
      "IN_PROGRESS",
      "COMPLETED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // Find the mechanic profile
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

    // Find the request assigned to this mechanic
    const breakdownRequest =
      await prisma.breakdownRequest.findFirst({
        where: {
          id: requestId,
          mechanicId: mechanic.id,
        },
      });

    if (!breakdownRequest) {
      return res.status(404).json({
        message: "Breakdown request not found",
      });
    }

    // Validate status transition
    const validTransitions: Record<string, string[]> = {
      ACCEPTED: ["ON_THE_WAY"],
      ON_THE_WAY: ["ARRIVED"],
      ARRIVED: ["IN_PROGRESS"],
      IN_PROGRESS: ["COMPLETED"],
    };

    const currentStatus = breakdownRequest.status;

    if (
      !validTransitions[currentStatus]?.includes(status)
    ) {
      return res.status(409).json({
        message: `Cannot change status from ${currentStatus} to ${status}`,
      });
    }

    const updatedRequest =
      await prisma.breakdownRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status,
        },
        include: {
          vehicle: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          mechanic: true,
        },
      });

    return res.status(200).json({
      message: "Request status updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Update request status error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getBreakdownRequestById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const requestId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (isNaN(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID",
      });
    }

    const request = await prisma.breakdownRequest.findUnique({
      where: {
        id: requestId,
      },
      include: {
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        mechanic: true,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: "Breakdown request not found",
      });
    }

    // Check whether the logged-in user is the request owner
    const isRequestOwner = request.userId === userId;

    // Check whether the logged-in user is the assigned mechanic
    let isAssignedMechanic = false;

    const mechanic = await prisma.mechanic.findUnique({
      where: {
        userId,
      },
    });

    if (mechanic && request.mechanicId === mechanic.id) {
      isAssignedMechanic = true;
    }

    if (!isRequestOwner && !isAssignedMechanic) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    return res.status(200).json({
      request,
    });
  } catch (error) {
    console.error("Get breakdown request error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const cancelBreakdownRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const requestId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (isNaN(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID",
      });
    }

    // Find the request and make sure it belongs to this driver
    const breakdownRequest =
      await prisma.breakdownRequest.findFirst({
        where: {
          id: requestId,
          userId,
        },
      });

    if (!breakdownRequest) {
      return res.status(404).json({
        message: "Breakdown request not found",
      });
    }

    // Cancellation is only allowed before the mechanic starts travelling
    if (
      breakdownRequest.status !== "REQUESTED" &&
      breakdownRequest.status !== "ACCEPTED"
    ) {
      return res.status(409).json({
        message: `Request cannot be cancelled when status is ${breakdownRequest.status}`,
      });
    }

    const updatedRequest =
      await prisma.breakdownRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "CANCELLED",
        },
        include: {
          vehicle: true,
          mechanic: true,
        },
      });

    return res.status(200).json({
      message: "Breakdown request cancelled successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Cancel breakdown request error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

