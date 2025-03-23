// src/services/classContactService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ClassContactService {
  async getAllContacts( classId: string) {
    return await prisma.classContact.findMany({
      where: { 
        classId,
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
    return await prisma.classContact.create({
      data: {
        ...data,
        class: { connect: { id: classId } }, // Connects the contact to a class by its ID
        user: { connect: { id: userId } },   // Connects the contact to a user by its ID
      },
    });
  }
  

  async getContactById( id:string, classId: string) {
    return await prisma.classContact.findUnique({
      where: { id,
        classId,
       },
      include: {  user: true },
    });
  }

  async updateContact(id: string, data: { name?: string; email?: string; reason?: string; statement?: string }, classId: string,) {
    return await prisma.classContact.update({
      where: { id, classId },
      data,
    });
  }

  async deleteContact(id: string, classId: string) {
    return await prisma.classContact.delete({
      where: { id,
        classId,
       },
    });
  }
}

export default new ClassContactService();