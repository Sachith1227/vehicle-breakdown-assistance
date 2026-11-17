import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import mechanicRoutes from "./routes/mechanicRoutes";
import breakdownRequestRoutes from "./routes/breakdownRequestRoutes";

const app = express();

const PORT = process.env.PORT || 5000;
// Known frontend deployments plus any explicitly configured origins.
const clientOrigins = [
  "http://localhost:5173",
  "https://vehicle-breakdown-assistance-sachith.vercel.app",
  "https://vehicle-breakdown-assistance-u8dj-git-main-sachith3.vercel.app",
  ...(process.env.CLIENT_URL || "").split(","),
]
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(cors({ origin: clientOrigins }));
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
