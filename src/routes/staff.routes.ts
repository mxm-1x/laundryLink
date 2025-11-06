import express from "express";
import { getAllLaundry, updateLaundryStatus, updateLaundryIssue } from "../controllers/staff.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// All routes require authentication
router.get("/", authenticate, getAllLaundry);
router.put("/:id", authenticate, updateLaundryStatus);
router.patch("/:id", authenticate, updateLaundryStatus);
router.patch("/:id/issue", authenticate, updateLaundryIssue);
router.put("/:id/issue", authenticate, updateLaundryIssue);

export default router;
