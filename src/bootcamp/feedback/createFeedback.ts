// src/services/classFeedbackService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ClassFeedbackService {
  async getAllFeedbacks(bootcampId: string) {
    return await prisma.bootcampFeedback.findMany({
      where: { 
        bootcampId
       },
      include: {
        bootcamp: true,
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async createFeedback(
    data: {
      name: string;
      reason: string;
      statement: string;
      rating: string | number;
    },
    bootcampId: string,
    userId: string
  ) {
    return await prisma.bootcampFeedback.create({
      data: {
        ...data,
        rating: parseFloat(data.rating as string), // Ensure rating is stored as a float
        bootcamp: { connect: { id: bootcampId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async getFeedbackById( id:string, bootcampId: string ) {
    return await prisma.bootcampFeedback.findUnique({
      where: { id, bootcampId,
       
       },
      include: { bootcamp: true, user: true },
    });
  }

  
  async updateFeedback(id: string, data: { name?: string; reason?: string;  statement?: string; email?: string }, bootcampId: string ) {
    return await prisma.bootcampFeedback.update({
      where: { id, bootcampId },
      data,
    });
  }

  async deleteFeedback(id: string,bootcampId: string) {
    return await prisma.bootcampFeedback.delete({
      where: {
        bootcampId, 
        id,
       },
    });
  }
}

export default new ClassFeedbackService();