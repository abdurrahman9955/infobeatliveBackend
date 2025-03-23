// src/services/classContactService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ClassContactService {
  async getAllContacts( bootcampId: string) {
    return await prisma.bootcampContact.findMany({
      where: { 
        bootcampId,
       },
      include: {
        bootcamp: true,
        user: true,
      },
    });
  }

  async createContact(data: {
    name: string;
    email: string;
    reason: string;
    statement: string;
  }, bootcampId: string, userId: string) {
    return await prisma.bootcampContact.create({
      data: {
        ...data,
        bootcamp: { connect: { id: bootcampId } }, // Connects the contact to a class by its ID
        user: { connect: { id: userId } },   // Connects the contact to a user by its ID
      },
    });
  }

  async getContactById(id: string) {
    return await prisma.bootcampContact.findUnique({
      where: { id},
      include: {  user: true },
    });
  }

  async updateContact(id: string, data: { name?: string; email?: string; reason?: string; statement?: string }) {
    return await prisma.bootcampContact.update({
      where: { id },
      data,
    });
  }

  async deleteContact(id: string) {
    return await prisma.bootcampContact.delete({
      where: { id,
       
       },
    });
  }
}

export default new ClassContactService();