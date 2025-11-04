import express from "express";
import cors from "cors";
import studentRoutes from "./routes/students.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);

export default app;
