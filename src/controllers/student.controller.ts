import { Request, Response } from "express";
import prisma from "../config/prisma";

export const registerStudent = async (req: Request, res: Response) => {
    const { name, email, bagNumber, gender } = req.body;
    try {
        const student = await prisma.student.create({
            data: { name, email, bagNumber, gender },
        });
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};

export const getLaundryStatus = async (req: Request, res: Response) => {
    const { bagNumber } = req.params;

    if (!bagNumber) {
        return res.status(400).json({ error: "Bag number is required" });
    }

    try {
        const student = await prisma.student.findUnique({
            where: { bagNumber: bagNumber },
            include: { laundry: true },
        });

        if (!student) return res.status(404).json({ error: "Student not found" });

        res.json(student.laundry);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
};
