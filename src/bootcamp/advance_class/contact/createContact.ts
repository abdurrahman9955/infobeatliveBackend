// src/services/classContactService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ClassContactService {
  async getAllContacts( classId: string) {
    return await prisma.bootcampClassContact.findMany({
      where: { 
        classId, level:'ADVANCED',
       },
      include: {
        user: true,
      },
    });
  }


  async createContact(data: {
    name: string;
    email: string;
    reason: string;
    statement: string;
  }, classId: string, userId: string) {
    return await prisma.bootcampClassContact.create({
      data: {
        ...data,
        level:'ADVANCED',
        class: { connect: { id: classId } }, // Connects the contact to a class by its ID
        user: { connect: { id: userId } },   // Connects the contact to a user by its ID
      },
    });
  }
  

  async getContactById( id:string, classId: string) {
    return await prisma.bootcampClassContact.findUnique({
      where: { id, level:'ADVANCED',
        classId,
       },
      include: {  user: true },
    });
  }

  async updateContact(id: string, data: { name?: string; email?: string; reason?: string; statement?: string }, classId: string,) {
    return await prisma.bootcampClassContact.update({
      where: { id, level:'ADVANCED', classId },
      data,
    });
  }

  async deleteContact(id: string, classId: string) {
    return await prisma.bootcampClassContact.delete({
      where: { id, level:'ADVANCED',
        classId,
       },
    });
  }
}

export default new ClassContactService();