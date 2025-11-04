import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { generateToken } from "../utils/jwt";

/* ------------------------- Student Registration/Login ------------------------- */
export const studentRegister = async (req: Request, res: Response) => {
    const { name, email, password, bagNumber, gender } = req.body;

    // Validate domain
    if (!email.endsWith("rishihood.edu.in")) {
        return res.status(400).json({ error: "Invalid email domain" });
    }

    try {
        const hashed = await bcrypt.hash(password, 10);
        const student = await prisma.student.create({
            data: { name, email, password: hashed, bagNumber: String(bagNumber), gender },
        });
        res.status(201).json({ message: "Student registered successfully", student });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const studentLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email.endsWith("rishihood.edu.in")) {
        return res.status(400).json({ error: "Only university emails allowed" });
    }

    try {
        const student = await prisma.student.findUnique({ where: { email } });
        if (!student) return res.status(404).json({ error: "No student found" });

        const match = await bcrypt.compare(password, student.password);
        if (!match) return res.status(401).json({ error: "Incorrect password" });

        const token = generateToken({ id: student.id, role: "student" });
        res.json({ token });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

/* ---------------------------- Staff Registration/Login ---------------------------- */
export const staffRegister = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const hashed = await bcrypt.hash(password, 10);
        const staff = await prisma.staff.create({
            data: { name, email, password: hashed, role: "staff" },
        });
        res.status(201).json({ message: "Staff registered successfully", staff });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const staffLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const staff = await prisma.staff.findUnique({ where: { email } });
        if (!staff) return res.status(404).json({ error: "No staff found" });

        const match = await bcrypt.compare(password, staff.password);
        if (!match) return res.status(401).json({ error: "Incorrect password" });

        const token = generateToken({ id: staff.id, role: "staff" });
        res.json({ token });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
