"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLaundryTicket = exports.getLaundryStatus = exports.registerStudent = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const registerStudent = async (req, res) => {
    const { name, email, bagNumber, gender } = req.body;
    try {
        const student = await prisma_1.default.student.create({
            data: { name, email, bagNumber, gender },
        });
        res.status(201).json(student);
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};
exports.registerStudent = registerStudent;
const getLaundryStatus = async (req, res) => {
    const studentId = req.user.id;
    try {
        const laundry = await prisma_1.default.laundry.findMany({
            where: { studentId },
            include: {
                Student: {
                    select: {
                        name: true,
                        email: true,
                        bagNumber: true,
                        gender: true
                    }
                }
            },
            orderBy: { pickupDate: 'desc' }
        });
        res.json(laundry);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};
exports.getLaundryStatus = getLaundryStatus;
const createLaundryTicket = async (req, res) => {
    const studentId = req.user.id;
    const { bagNumber, shirts, bottoms, towels, bedsheets, others } = req.body;
    try {
        // Get student info
        const student = await prisma_1.default.student.findUnique({
            where: { id: studentId }
        });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        // Calculate total items
        const totalItems = (shirts || 0) + (bottoms || 0) + (towels || 0) + (bedsheets || 0) + (others || 0);
        if (totalItems === 0) {
            return res.status(400).json({ error: "Please add at least one item" });
        }
        const laundry = await prisma_1.default.laundry.create({
            data: {
                studentId,
                bagNumber: student.bagNumber,
                shirts: shirts || 0,
                bottoms: bottoms || 0,
                towels: towels || 0,
                bedsheets: bedsheets || 0,
                others: others || 0,
                totalItems,
                status: "PENDING"
            },
            include: {
                Student: {
                    select: {
                        name: true,
                        email: true,
                        bagNumber: true,
                        gender: true
                    }
                }
            }
        });
        res.status(201).json({
            message: "Laundry ticket created successfully",
            laundry
        });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};
exports.createLaundryTicket = createLaundryTicket;
//# sourceMappingURL=student.controller.js.map