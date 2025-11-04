import express from "express";
import {
  studentRegister,
  studentLogin,
  staffRegister,
  staffLogin,
} from "../controllers/auth.controller";

const router = express.Router();

// STUDENT ROUTES
router.post('/student/register', studentRegister);
router.post('/student/login', studentLogin);

// STAFF ROUTES
router.post('/staff/register', staffRegister);
router.post('/staff/login', staffLogin);

export default router;