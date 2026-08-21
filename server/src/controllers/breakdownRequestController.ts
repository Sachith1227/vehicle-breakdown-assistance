import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { prisma } from "../config/prisma";


// =====================================================
// DISTANCE CALCULATION
// Haversine Formula
// =====================================================

const calculateDistanceKm = (
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): number => {

  const earthRadiusKm = 6371;

  const toRadians = (degrees: number) =>
    (degrees * Math.PI) / 180;


  const lat1 = toRadians(latitude1);
  const lat2 = toRadians(latitude2);

  const deltaLat = toRadians(
    latitude2 - latitude1
  );

  const deltaLongitude = toRadians(
    longitude2 - longitude1
  );


  const a =
    Math.sin(deltaLat / 2) *
      Math.sin(deltaLat / 2) +

    Math.cos(lat1) *
      Math.cos(lat2) *

    Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2);


  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );


  return (
    earthRadiusKm * c
  );
};


// =====================================================
// CREATE BREAKDOWN REQUEST
// =====================================================

export const createBreakdownRequest = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const userId =
      req.user?.userId;


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


    // =================================================
    // VALIDATE REQUIRED FIELDS
    // =================================================

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


    const parsedVehicleId =
      Number(vehicleId);


    if (
      isNaN(parsedVehicleId)
    ) {

      return res.status(400).json({
        message:
          "Invalid vehicle ID",
      });

    }


    // =================================================
    // VALIDATE LOCATION
    // =================================================

    const parsedLatitude =
      Number(latitude);

    const parsedLongitude =
      Number(longitude);


    if (
      !Number.isFinite(
        parsedLatitude
      ) ||
      !Number.isFinite(
        parsedLongitude
      )
    ) {

      return res.status(400).json({
        message:
          "Invalid location coordinates",
      });

    }


    if (
      parsedLatitude < -90 ||
      parsedLatitude > 90
    ) {

      return res.status(400).json({
        message:
          "Invalid latitude",
      });

    }


    if (
      parsedLongitude < -180 ||
      parsedLongitude > 180
    ) {

      return res.status(400).json({
        message:
          "Invalid longitude",
      });

    }


    // =================================================
    // CHECK VEHICLE OWNERSHIP
    // =================================================

    const vehicle =
      await prisma.vehicle.findFirst({

        where: {

          id: parsedVehicleId,

          userId,

        },

      });


    if (!vehicle) {

      return res.status(404).json({
        message:
          "Vehicle not found",
      });

    }


    // =================================================
    // CREATE BREAKDOWN REQUEST
    // =================================================

    const request =
      await prisma.breakdownRequest.create({

        data: {

          userId,

          vehicleId:
            parsedVehicleId,

          problemType,

          description,

          latitude:
            parsedLatitude,

          longitude:
            parsedLongitude,

        },

      });


    return res.status(201).json({

      message:
        "Breakdown request created successfully",

      request,

    });

  } catch (error) {

    console.error(
      "Create breakdown request error:",
      error
    );


    return res.status(500).json({
      message:
        "Internal server error",
    });

  }

};


// =====================================================
// GET MY BREAKDOWN REQUESTS
// =====================================================

export const getMyBreakdownRequests = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const userId =
      req.user?.userId;


    if (!userId) {

      return res.status(401).json({
        message:
          "Unauthorized",
      });

    }


    const requests =
      await prisma.breakdownRequest.findMany({

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

    console.error(
      "Get breakdown requests error:",
      error
    );


    return res.status(500).json({
      message:
        "Internal server error",
    });

  }

};


// =====================================================
// GET PENDING REQUESTS
// WITH DISTANCE FROM CURRENT MECHANIC
// =====================================================

export const getPendingRequests = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const userId =
      req.user?.userId;


    if (!userId) {

      return res.status(401).json({
        message:
          "Unauthorized",
      });

    }


    // =================================================
    // FIND LOGGED-IN MECHANIC
    // =================================================

    const mechanic =
      await prisma.mechanic.findUnique({

        where: {
          userId,
        },

      });


    if (!mechanic) {

      return res.status(404).json({
        message:
          "Mechanic profile not found",
      });

    }


    // =================================================
    // CHECK MECHANIC AVAILABILITY
    // =================================================

    if (!mechanic.isAvailable) {

      return res.status(200).json({

        requests: [],

        message:
          "Mechanic is currently unavailable",

      });

    }


    // =================================================
    // GET PENDING REQUESTS
    // =================================================

    const requests =
      await prisma.breakdownRequest.findMany({

        where: {

          status:
            "REQUESTED",

          mechanicId:
            null,

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


    // =================================================
    // CALCULATE DISTANCE
    // =================================================

    const requestsWithDistance =
      requests.map(
        (request) => {

          const distanceKm =
            calculateDistanceKm(

              mechanic.latitude,

              mechanic.longitude,

              request.latitude,

              request.longitude

            );


          return {

            ...request,

            distanceKm:
              Number(
                distanceKm.toFixed(2)
              ),

          };

        }
      );


    // =================================================
    // SORT NEAREST FIRST
    // =================================================

    requestsWithDistance.sort(
      (a, b) =>
        a.distanceKm -
        b.distanceKm
    );


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({

      requests:
        requestsWithDistance,

    });

  } catch (error) {

    console.error(
      "Get pending requests error:",
      error
    );


    return res.status(500).json({
      message:
        "Internal server error",
    });

  }

};


// =====================================================
// GET MY ASSIGNED REQUESTS
// =====================================================

export const getMyAssignedRequests = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const userId =
      req.user?.userId;


    if (!userId) {

      return res.status(401).json({
        message:
          "Unauthorized",
      });

    }


    // =================================================
    // FIND MECHANIC
    // =================================================

    const mechanic =
      await prisma.mechanic.findUnique({

        where: {
          userId,
        },

      });


    if (!mechanic) {

      return res.status(404).json({
        message:
          "Mechanic profile not found",
      });

    }


    // =================================================
    // GET ACTIVE REQUESTS
    // =================================================

    const requests =
      await prisma.breakdownRequest.findMany({

        where: {

          mechanicId:
            mechanic.id,

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


    // =================================================
    // ADD DISTANCE
    // =================================================

    const requestsWithDistance =
      requests.map(
        (request) => {

          const distanceKm =
            calculateDistanceKm(

              mechanic.latitude,

              mechanic.longitude,

              request.latitude,

              request.longitude

            );


          return {

            ...request,

            distanceKm:
              Number(
                distanceKm.toFixed(2)
              ),

          };

        }
      );


    return res.status(200).json({

      requests:
        requestsWithDistance,

    });

  } catch (error) {

    console.error(
      "Get assigned requests error:",
      error
    );


    return res.status(500).json({
      message:
        "Internal server error",
    });

  }

};


// =====================================================
// ACCEPT BREAKDOWN REQUEST
// =====================================================

export const acceptBreakdownRequest = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const userId =
      req.user?.userId;

    const requestId =
      Number(
        req.params.id
      );


    if (!userId) {

      return res.status(401).json({
        message:
          "Unauthorized",
      });

    }


    if (
      isNaN(requestId)
    ) {

      return res.status(400).json({
        message:
          "Invalid request ID",
      });

    }


    // =================================================
    // FIND MECHANIC
    // =================================================

    const mechanic =
      await prisma.mechanic.findUnique({

        where: {
          userId,
        },

      });


    if (!mechanic) {

      return res.status(404).json({
        message:
          "Mechanic profile not found",
      });

    }


    // =================================================
    // CHECK AVAILABILITY
    // =================================================

    if (!mechanic.isAvailable) {

      return res.status(400).json({
        message:
          "Mechanic is currently unavailable",
      });

    }


    // =================================================
    // FIND REQUEST
    // =================================================

    const breakdownRequest =
      await prisma.breakdownRequest.findUnique({

        where: {
          id: requestId,
        },

      });


    if (!breakdownRequest) {

      return res.status(404).json({
        message:
          "Breakdown request not found",
      });

    }


    // =================================================
    // CHECK REQUEST AVAILABILITY
    // =================================================

    if (
      breakdownRequest.status !==
        "REQUESTED" ||

      breakdownRequest.mechanicId !==
        null
    ) {

      return res.status(409).json({
        message:
          "Breakdown request is no longer available",
      });

    }


    // =================================================
    // ASSIGN MECHANIC
    // =================================================

    const updatedRequest =
      await prisma.breakdownRequest.update({

        where: {
          id: requestId,
        },

        data: {

          mechanicId:
            mechanic.id,

          status:
            "ACCEPTED",

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

      message:
        "Breakdown request accepted successfully",

      request:
        updatedRequest,

    });

  } catch (error) {

    console.error(
      "Accept breakdown request error:",
      error
    );


    return res.status(500).json({
      message:
        "Internal server error",
    });

  }

};


// =====================================================
// UPDATE REQUEST STATUS
// =====================================================

export const updateRequestStatus = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const userId =
      req.user?.userId;

    const requestId =
      Number(
        req.params.id
      );

    const {
      status,
    } = req.body;


    if (!userId) {

      return res.status(401).json({
        message:
          "Unauthorized",
      });

    }


    if (
      isNaN(requestId)
    ) {

      return res.status(400).json({
        message:
          "Invalid request ID",
      });

    }


    if (!status) {

      return res.status(400).json({
        message:
          "Status is required",
      });

    }


    // =================================================
    // ALLOWED STATUSES
    // =================================================

    const allowedStatuses = [

      "ON_THE_WAY",

      "ARRIVED",

      "IN_PROGRESS",

      "COMPLETED",

    ];


    if (
      !allowedStatuses.includes(
        status
      )
    ) {

      return res.status(400).json({
        message:
          "Invalid status",
      });

    }


    // =================================================
    // FIND MECHANIC
    // =================================================

    const mechanic =
      await prisma.mechanic.findUnique({

        where: {
          userId,
        },

      });


    if (!mechanic) {

      return res.status(404).json({
        message:
          "Mechanic profile not found",
      });

    }


    // =================================================
    // FIND ASSIGNED REQUEST
    // =================================================

    const breakdownRequest =
      await prisma.breakdownRequest.findFirst({

        where: {

          id: requestId,

          mechanicId:
            mechanic.id,

        },

      });


    if (!breakdownRequest) {

      return res.status(404).json({
        message:
          "Breakdown request not found",
      });

    }


    // =================================================
    // VALID STATUS TRANSITIONS
    // =================================================

    const validTransitions:
      Record<
        string,
        string[]
      > = {

        ACCEPTED: [
          "ON_THE_WAY",
        ],

        ON_THE_WAY: [
          "ARRIVED",
        ],

        ARRIVED: [
          "IN_PROGRESS",
        ],

        IN_PROGRESS: [
          "COMPLETED",
        ],

      };


    const currentStatus =
      breakdownRequest.status;


    if (
      !validTransitions[
        currentStatus
      ]?.includes(
        status
      )
    ) {

      return res.status(409).json({

        message:
          `Cannot change status from ${currentStatus} to ${status}`,

      });

    }


    // =================================================
    // UPDATE STATUS
    // =================================================

    const updatedRequest =
      await prisma.breakdownRequest.update({

        where: {

          id:
            requestId,

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

      message:
        "Request status updated successfully",

      request:
        updatedRequest,

    });

  } catch (error) {

    console.error(
      "Update request status error:",
      error
    );


    return res.status(500).json({
      message:
        "Internal server error",
    });

  }

};


// =====================================================
// GET BREAKDOWN REQUEST BY ID
// =====================================================

export const getBreakdownRequestById = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const userId =
      req.user?.userId;

    const requestId =
      Number(
        req.params.id
      );


    if (!userId) {

      return res.status(401).json({
        message:
          "Unauthorized",
      });

    }


    if (
      isNaN(requestId)
    ) {

      return res.status(400).json({
        message:
          "Invalid request ID",
      });

    }


    const request =
      await prisma.breakdownRequest.findUnique({

        where: {

          id:
            requestId,

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
        message:
          "Breakdown request not found",
      });

    }


    // =================================================
    // CHECK REQUEST OWNER
    // =================================================

    const isRequestOwner =
      request.userId ===
      userId;


    // =================================================
    // CHECK ASSIGNED MECHANIC
    // =================================================

    let isAssignedMechanic =
      false;


    const mechanic =
      await prisma.mechanic.findUnique({

        where: {
          userId,
        },

      });


    if (
      mechanic &&
      request.mechanicId ===
        mechanic.id
    ) {

      isAssignedMechanic =
        true;

    }


    if (
      !isRequestOwner &&
      !isAssignedMechanic
    ) {

      return res.status(403).json({
        message:
          "Access denied",
      });

    }


    // =================================================
    // ADD DISTANCE FOR MECHANIC
    // =================================================

    let responseRequest:
      any = request;


    if (
      mechanic &&
      request.mechanicId ===
        mechanic.id
    ) {

      const distanceKm =
        calculateDistanceKm(

          mechanic.latitude,

          mechanic.longitude,

          request.latitude,

          request.longitude

        );


      responseRequest = {

        ...request,

        distanceKm:
          Number(
            distanceKm.toFixed(2)
          ),

      };

    }


    return res.status(200).json({

      request:
        responseRequest,

    });

  } catch (error) {

    console.error(
      "Get breakdown request error:",
      error
    );


    return res.status(500).json({
      message:
        "Internal server error",
    });

  }

};


// =====================================================
// CANCEL BREAKDOWN REQUEST
// =====================================================

export const cancelBreakdownRequest = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const userId =
      req.user?.userId;

    const requestId =
      Number(
        req.params.id
      );


    if (!userId) {

      return res.status(401).json({
        message:
          "Unauthorized",
      });

    }


    if (
      isNaN(requestId)
    ) {

      return res.status(400).json({
        message:
          "Invalid request ID",
      });

    }


    // =================================================
    // FIND DRIVER REQUEST
    // =================================================

    const breakdownRequest =
      await prisma.breakdownRequest.findFirst({

        where: {

          id:
            requestId,

          userId,

        },

      });


    if (!breakdownRequest) {

      return res.status(404).json({
        message:
          "Breakdown request not found",
      });

    }


    // =================================================
    // CANCELLATION RULE
    // =================================================

    if (
      breakdownRequest.status !==
        "REQUESTED" &&

      breakdownRequest.status !==
        "ACCEPTED"
    ) {

      return res.status(409).json({

        message:
          `Request cannot be cancelled when status is ${breakdownRequest.status}`,

      });

    }


    // =================================================
    // CANCEL REQUEST
    // =================================================

    const updatedRequest =
      await prisma.breakdownRequest.update({

        where: {

          id:
            requestId,

        },

        data: {

          status:
            "CANCELLED",

        },

        include: {

          vehicle: true,

          mechanic: true,

        },

      });


    return res.status(200).json({

      message:
        "Breakdown request cancelled successfully",

      request:
        updatedRequest,

    });

  } catch (error) {

    console.error(
      "Cancel breakdown request error:",
      error
    );


    return res.status(500).json({
      message:
        "Internal server error",
    });

  }

};