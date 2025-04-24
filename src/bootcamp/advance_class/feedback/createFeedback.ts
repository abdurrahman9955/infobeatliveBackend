// src/services/classFeedbackService.ts
import prisma from "../../../utils/prisma";

export class ClassFeedbackService {
  async getAllFeedbacks(classId: string) {
    return await prisma.bootcampClassFeedback.findMany({
      where: { 
        classId,
        level:'ADVANCED',
       },
      include: {
        class: true,
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async createFeedback(data: {
    name: string;
    reason: string;
    statement: string;
    rating: string;
  }, classId: string, userId: string,) {
    return await prisma.bootcampClassFeedback.create({
      data: {
        ...data,
        level:'ADVANCED',
        class: { connect: { id: classId } }, // Connects the contact to a class by its ID
        user: { connect: { id: userId } },   // Connects the contact to a user by its ID
      },
    });
  }

  async getFeedbackById( id:string, classId: string ) {
    return await prisma.bootcampClassFeedback.findUnique({
      where: { id, classId, level:'ADVANCED',
       
       },
      include: { class: true, user: true },
    });
  }

  
  async updateFeedback(id: string, data: { name?: string; reason?: string;  statement?: string; email?: string }, classId: string ) {
    return await prisma.bootcampClassFeedback.update({
      where: { id, level:'ADVANCED', classId },
      data,
    });
  }

  async deleteFeedback(id: string,classId: string) {
    return await prisma.bootcampClassFeedback.delete({
      where: {
        classId,  level:'ADVANCED',
        id,
       },
    });
  }
}

export default new ClassFeedbackService();