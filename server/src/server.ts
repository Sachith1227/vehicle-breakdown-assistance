import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import mechanicRoutes from "./routes/mechanicRoutes";
import breakdownRequestRoutes from "./routes/breakdownRequestRoutes";

const app = express();

const PORT = process.env.PORT || 5000;
app.use(
  cors({
    // CLIENT_URL may hold several comma-separated origins
    origin: (process.env.CLIENT_URL || "http://localhost:5173")
      .split(",")
      .map((url) => url.trim().replace(/\/+$/, "")),
  })
);
app.use(express.json());


// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/requests", breakdownRequestRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Vehicle Breakdown Assistance API is running",
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
