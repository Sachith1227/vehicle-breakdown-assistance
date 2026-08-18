import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import mechanicRoutes from "./routes/mechanicRoutes";
import breakdownRequestRoutes from "./routes/breakdownRequestRoutes";

const app = express();

const PORT = 5000;
app.use(
  cors({
    origin: "http://localhost:5173",
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});