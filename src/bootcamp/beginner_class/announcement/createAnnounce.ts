// src/services/classContactService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnnouncementService {
  async getAllAnnouncements( classId: string) {
    return await prisma.classAnnouncement.findMany({
      where: { 
        classId,
       },
      include: {
        user: true,
      },
    });
  }

  async createAnnouncement(data: {
    title: string;
    startDate: Date;
    endDate: Date;
    statement: string;
  }, classId: string, userId: string) {
    return await prisma.classAnnouncement.create({
      data: {
        ...data,
        class: { connect: { id: classId } }, // Connects the contact to a class by its ID
        user: { connect: { id: userId } },   // Connects the contact to a user by its ID
      },
    });
  }

  async getAnnouncementById(id: string,  userId: string) {
    return await prisma.classAnnouncement.findUnique({
      where: { id,
        userId,
       },
      include: {  user: true },
    });
  }


  async updateAnnouncement(id: string, data: { title?: string; startDate?: Date;  endDate?: Date;
    statement?: string; }, classId: string, userId: string) {
    return await prisma.classAnnouncement.update({
      where: { id, classId, userId },
      data,
    });
  }


  async deleteAnnouncement(id: string, classId: string,  userId: string) {
    return await prisma.classAnnouncement.delete({
      where: { 
        classId,
        id,
        userId,
       },
    });
  }

}

export default new AnnouncementService();