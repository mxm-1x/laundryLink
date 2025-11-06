import express from "express";
import cors from "cors";
import studentRoutes from "./routes/students.routes";
import authRoutes from "./routes/auth.routes";
import staffRoutes from "./routes/staff.routes";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/laundry", staffRoutes);

export default app;
