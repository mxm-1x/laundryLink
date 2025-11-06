import { Request, Response } from "express";
import prisma from "../config/prisma";

// Get all laundry items (for staff)
export const getAllLaundry = async (req: Request, res: Response) => {
  try {
    const laundryItems = await prisma.laundry.findMany({
      include: {
        Student: {
          select: {
            name: true,
            email: true,
            gender: true,
            bagNumber: true,
          },
        },
      },
      orderBy: {
        pickupDate: 'desc',
      },
    });

    res.json(laundryItems);
  } catch (error) {
    console.error('Error fetching all laundry:', error);
    res.status(500).json({ message: "Failed to fetch laundry items" });
  }
};

// Update laundry status (for staff)
export const updateLaundryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = (req as any).user?.role; // Get user role from auth middleware

    console.log('Update request received:', { id, status, userRole });

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    // Validate status
    const validStatuses = ['PENDING', 'PICKED_UP', 'WASHED', 'DELIVERED'];
    if (!validStatuses.includes(status)) {
      console.log('Invalid status received:', status);
      return res.status(400).json({ message: "Invalid status" });
    }

    // Role-based status validation
    if (userRole === 'staff') {
      // Staff can only set to PENDING or WASHED
      if (!['PENDING', 'WASHED'].includes(status)) {
        return res.status(403).json({ message: "Staff can only set status to PENDING or WASHED" });
      }
    } else if (userRole === 'student') {
      // Students can only set to PICKED_UP
      if (status !== 'PICKED_UP') {
        return res.status(403).json({ message: "Students can only mark items as PICKED_UP" });
      }
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const updateData: any = { status };

    // Update deliveryDate when status is DELIVERED (though this shouldn't happen with new rules)
    if (status === 'DELIVERED') {
      updateData.deliveryDate = new Date();
    }

    const updatedLaundry = await prisma.laundry.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        Student: {
          select: {
            name: true,
            email: true,
            gender: true,
            bagNumber: true,
          },
        },
      },
    });

    console.log('Laundry updated successfully:', updatedLaundry.id);
    res.json(updatedLaundry);
  } catch (error) {
    console.error('Error updating laundry status:', error);
    res.status(500).json({ message: "Failed to update laundry status" });
  }
};

// Update laundry issue (for staff)
export const updateLaundryIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { issue } = req.body;

    console.log('Update issue request received:', { id, issue });

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const updatedLaundry = await prisma.laundry.update({
      where: { id: parseInt(id) },
      data: { issue: issue || null },
      include: {
        Student: {
          select: {
            name: true,
            email: true,
            gender: true,
            bagNumber: true,
          },
        },
      },
    });

    console.log('Laundry issue updated successfully:', updatedLaundry.id);
    res.json(updatedLaundry);
  } catch (error) {
    console.error('Error updating laundry issue:', error);
    res.status(500).json({ message: "Failed to update laundry issue" });
  }
};
