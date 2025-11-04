"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLaundryStatus = exports.registerStudent = void 0;
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
    const { bagNumber } = req.params;
    if (!bagNumber) {
        return res.status(400).json({ error: "Bag number is required" });
    }
    try {
        const student = await prisma_1.default.student.findUnique({
            where: { bagNumber: bagNumber },
            include: { laundry: true },
        });
        if (!student)
            return res.status(404).json({ error: "Student not found" });
        res.json(student.laundry);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};
exports.getLaundryStatus = getLaundryStatus;
//# sourceMappingURL=student.controller.js.map