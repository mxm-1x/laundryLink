import express from "express";
import { registerStudent, getLaundryStatus } from "../controllers/student.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", registerStudent);
router.get("/:bagNumber/status", authenticate, getLaundryStatus);

export default router;
