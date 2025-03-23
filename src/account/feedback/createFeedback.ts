// src/services/classFeedbackService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ClassFeedbackService {

  async getAllFeedbacks() {
    return await prisma.feedback.findMany({ });
  }

  async createFeedback(data: {
    name: string;
    reason: string;
    statement: string;
    rating: number;
  } ) {
    return await prisma.feedback.create({
      data: {...data},
    });
  }

  async getFeedbackById( id:string) {
    return await prisma.feedback.findUnique({
      where: { id },
    });
  }

  
  async updateFeedback(id: string, data: { name?: string; reason?: string;  statement?: string; email?: string } ) {
    return await prisma.feedback.update({
      where: { id },
      data,
    });
  }

  async deleteFeedback(id: string) {
    return await prisma.feedback.delete({
      where: {id},
    });
  }
}

export default new ClassFeedbackService();