import prisma from "../../utils/prisma";

export default class ClassPricingService {

    static async createClassPricing(data: {
        userId: string;
        classId: string;
        title: string;
        benefit1: string;
        benefit2: string;
        benefit3: string;
        benefit4: string;
        benefit5: string;
        type: string;
        amount: string;
        description: string;
      }) {
        // Check if pricing already exists for the given classId and userId
        const existingPricing = await prisma.cLassPricing.findFirst({
          where: {
            userId: data.userId,
            classId: data.classId,
            type: data.type,
          },
        });
    
        if (existingPricing) {
          // If it exists, update it
          return prisma.cLassPricing.update({
            where: { id: existingPricing.id },
            data: {
              title: data.title,
              benefit1: data.benefit1,
              benefit2: data.benefit2,
              benefit3: data.benefit3,
              benefit4: data.benefit4,
              benefit5: data.benefit5,
              type: data.type,
              amount: data.amount,
              description: data.description,
              updatedAt: new Date(),
            },
          });
        }
      
        // If no existing record, create a new one
        return prisma.cLassPricing.create({
          data: {
            userId: data.userId,
            classId: data.classId,
            title: data.title,
            benefit1: data.benefit1,
            benefit2: data.benefit2,
            benefit3: data.benefit3,
            benefit4: data.benefit4,
            benefit5: data.benefit5,
            type: data.type,
            amount: data.amount,
            description: data.description,
          },
        });
      }

  static async getAllClassPricings(classId: string) {
    return prisma.cLassPricing.findMany({ 
      where: { classId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
     });
  }

  static async getClassPricingById(id: string) {
    return prisma.cLassPricing.findUnique({ 
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
     });
  }

  static async updateClassPricing(
     id:string, classId: string,
    data: {
      title?: string;
      benefit1?: string;
      benefit2?: string;
      benefit3?: string;
      benefit4?: string;
      benefit5?: string;
      type?: string;
      amount?: string;
      description?: string;
    }
  ) {
    return prisma.cLassPricing.update({
      where: { id, classId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.benefit1 && { benefit1: data.benefit1 }),
        ...(data.benefit2 && { benefit2: data.benefit2 }),
        ...(data.benefit3 && { benefit3: data.benefit3 }),
        ...(data.benefit4 && { benefit4: data.benefit4 }),
        ...(data.benefit5 && { benefit5: data.benefit5 }),
        ...(data.type && { type: data.type }),
        ...(data.amount && { amount: data.amount }),
        ...(data.description && { description: data.description }),
      },
    });
  }

  static async deleteClassPricing(id: string) {
    return prisma.cLassPricing.delete({ where: { id } });
  }
}
