"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffLogin = exports.staffRegister = exports.studentLogin = exports.studentRegister = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../config/prisma"));
const jwt_1 = require("../utils/jwt");
/* ------------------------- Student Registration/Login ------------------------- */
const studentRegister = async (req, res) => {
    const { name, email, password, bagNumber, gender } = req.body;
    // Validate domain
    if (!email.endsWith("rishihood.edu.in")) {
        return res.status(400).json({ error: "Invalid email domain" });
    }
    try {
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const student = await prisma_1.default.student.create({
            data: { name, email, password: hashed, bagNumber, gender },
        });
        res.status(201).json({ message: "Student registered successfully", student });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.studentRegister = studentRegister;
const studentLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email.endsWith("rishihood.edu.in")) {
        return res.status(400).json({ error: "Only university emails allowed" });
    }
    try {
        const student = await prisma_1.default.student.findUnique({ where: { email } });
        if (!student)
            return res.status(404).json({ error: "No student found" });
        const match = await bcryptjs_1.default.compare(password, student.password);
        if (!match)
            return res.status(401).json({ error: "Incorrect password" });
        const token = (0, jwt_1.generateToken)({ id: student.id, role: "student" });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.studentLogin = studentLogin;
/* ---------------------------- Staff Registration/Login ---------------------------- */
const staffRegister = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const staff = await prisma_1.default.staff.create({
            data: { name, email, password: hashed, role: "staff" },
        });
        res.status(201).json({ message: "Staff registered successfully", staff });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.staffRegister = staffRegister;
const staffLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const staff = await prisma_1.default.staff.findUnique({ where: { email } });
        if (!staff)
            return res.status(404).json({ error: "No staff found" });
        const match = await bcryptjs_1.default.compare(password, staff.password);
        if (!match)
            return res.status(401).json({ error: "Incorrect password" });
        const token = (0, jwt_1.generateToken)({ id: staff.id, role: "staff" });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.staffLogin = staffLogin;
//# sourceMappingURL=auth.controller.js.map