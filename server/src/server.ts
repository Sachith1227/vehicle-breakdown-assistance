import express from "express";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";

const app = express();

const PORT = 5000;

app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Vehicle Breakdown Assistance API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});