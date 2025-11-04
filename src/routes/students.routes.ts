import express from "express";
import { registerStudent, getLaundryStatus } from "../controllers/student.controller";

const router = express.Router();

router.post("/register", registerStudent);
router.get("/:bagNumber/status", getLaundryStatus);

export default router;
