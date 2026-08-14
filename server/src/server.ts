import express from "express";

const app = express();

const PORT = 5000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Vehicle Breakdown Assistance API is running"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});