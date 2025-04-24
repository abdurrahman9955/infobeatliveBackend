// src/services/classContactService.ts
import prisma from "../../../utils/prisma";

export class ClassContactService {
  async getAllContacts( classId: string) {
    return await prisma.bootcampClassContact.findMany({
      where: { 
        classId, level:'BEGINNER',
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
        level: 'BEGINNER',
        class: { connect: { id: classId } }, // Connects the contact to a class by its ID
        user: { connect: { id: userId } },   // Connects the contact to a user by its ID
      },
    });
  }
  

  async getContactById( id:string, classId: string) {
    return await prisma.bootcampClassContact.findUnique({
      where: { id, level:'BEGINNER',
        classId,
       },
      include: {  user: true },
    });
  }

  async updateContact(id: string, data: { name?: string; email?: string; reason?: string; statement?: string }, classId: string,) {
    return await prisma.bootcampClassContact.update({
      where: { id, classId, level:'BEGINNER', },
      data,
    });
  }

  async deleteContact(id: string, classId: string) {
    return await prisma.bootcampClassContact.delete({
      where: { id, level:'BEGINNER',
        classId,
       },
    });
  }
}

export default new ClassContactService();