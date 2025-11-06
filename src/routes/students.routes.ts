import express from "express";
import { registerStudent, getLaundryStatus, createLaundryTicket } from "../controllers/student.controller";
import { updateLaundryStatus, updateLaundryIssue } from "../controllers/staff.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", registerStudent);
router.get("/laundry", authenticate, getLaundryStatus);
router.post("/laundry", authenticate, createLaundryTicket);
router.patch("/laundry/:id", authenticate, updateLaundryStatus);
router.put("/laundry/:id", authenticate, updateLaundryStatus);
router.patch("/laundry/:id/issue", authenticate, updateLaundryIssue);
router.put("/laundry/:id/issue", authenticate, updateLaundryIssue);

export default router;
