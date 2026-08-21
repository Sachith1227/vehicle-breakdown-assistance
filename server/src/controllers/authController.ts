import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";


// =====================================================
// REGISTER
// =====================================================

export const register = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      name,
      email,
      password,
      role,
      phone,
      businessName,
      address,
      latitude,
      longitude,
    } = req.body;


    // =================================================
    // 1. BASIC VALIDATION
    // =================================================

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Name, email and password are required",
      });
    }


    // =================================================
    // 2. VALIDATE ROLE
    // =================================================

    let userRole:
      | "DRIVER"
      | "SERVICE_PROVIDER";


    if (role === "SERVICE_PROVIDER") {

      userRole =
        "SERVICE_PROVIDER";

    } else {

      userRole =
        "DRIVER";

    }


    // =================================================
    // 3. SERVICE PROVIDER VALIDATION
    // =================================================

    if (
      userRole ===
      "SERVICE_PROVIDER"
    ) {

      if (
        !phone ||
        !businessName ||
        !address ||
        latitude === undefined ||
        longitude === undefined
      ) {

        return res.status(400).json({
          message:
            "Phone, business name, address and location are required for service providers",
        });

      }


      // Check that coordinates are valid numbers

      if (
        typeof latitude !== "number" ||
        typeof longitude !== "number"
      ) {

        return res.status(400).json({
          message:
            "Invalid service provider location",
        });

      }


      // Check latitude range

      if (
        latitude < -90 ||
        latitude > 90
      ) {

        return res.status(400).json({
          message:
            "Invalid latitude",
        });

      }


      // Check longitude range

      if (
        longitude < -180 ||
        longitude > 180
      ) {

        return res.status(400).json({
          message:
            "Invalid longitude",
        });

      }

    }


    // =================================================
    // 4. CHECK EXISTING EMAIL
    // =================================================

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });


    if (existingUser) {

      return res.status(409).json({
        message:
          "Email already registered",
      });

    }


    // =================================================
    // 5. HASH PASSWORD
    // =================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // =================================================
    // 6. CREATE USER
    // =================================================

    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: userRole,
        },
      });


    // =================================================
    // 7. CREATE MECHANIC PROFILE
    // =================================================

    if (
      userRole ===
      "SERVICE_PROVIDER"
    ) {

      await prisma.mechanic.create({
        data: {

          userId: user.id,

          businessName,

          phone,

          latitude,

          longitude,

          isAvailable: true,

          rating: 0,

        },
      });

    }


    // =================================================
    // 8. RESPONSE
    // =================================================

    return res.status(201).json({

      message:
        userRole ===
        "SERVICE_PROVIDER"
          ? "Service provider account created successfully"
          : "Driver account created successfully",

      user: {

        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,

      },

    });

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error",
    });

  }
};



// =====================================================
// LOGIN
// =====================================================

export const login = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      email,
      password,
    } = req.body;


    // =================================================
    // 1. REQUIRED FIELDS
    // =================================================

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({
        message:
          "Email and password are required",
      });

    }


    // =================================================
    // 2. FIND USER
    // =================================================

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });


    if (!user) {

      return res.status(401).json({
        message:
          "Invalid email or password",
      });

    }


    // =================================================
    // 3. CHECK PASSWORD
    // =================================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {

      return res.status(401).json({
        message:
          "Invalid email or password",
      });

    }


    // =================================================
    // 4. CREATE JWT
    // =================================================

    const token =
      jwt.sign(

        {
          userId: user.id,
          role: user.role,
        },

        process.env.JWT_SECRET!,

        {
          expiresIn: "1h",
        }

      );


    // =================================================
    // 5. RETURN RESPONSE
    // =================================================

    return res.status(200).json({

      message:
        "Login successful",

      token,

      user: {

        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,

      },

    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error",
    });

  }
};



// =====================================================
// GET CURRENT USER
// =====================================================

export const getMe = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const userId =
      req.user?.userId;


    // =================================================
    // 1. AUTH CHECK
    // =================================================

    if (!userId) {

      return res.status(401).json({
        message:
          "Unauthorized",
      });

    }


    // =================================================
    // 2. FIND USER
    // =================================================

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });


    if (!user) {

      return res.status(404).json({
        message:
          "User not found",
      });

    }


    // =================================================
    // 3. RETURN USER
    // =================================================

    return res.status(200).json({

      user: {

        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,

        createdAt:
          user.createdAt,

      },

    });

  } catch (error) {

    console.error(
      "Get user error:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error",
    });

  }
};