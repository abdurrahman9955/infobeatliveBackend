import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class ClassPricingService {
  
    static async createClassPricing(data: {
        bootcampId: string;
        classId: string;
        userId:string;
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
        const existingPricing = await prisma.bootcampCLassPricing.findFirst({
          where: {
            userId: data.userId,
            classId: data.classId,
            bootcampId: data.bootcampId,
            level:'INTERMEDIATE',
            type: data.type,
          },
        });
   
        if (existingPricing) {
          // If it exists, update it
          return prisma.bootcampCLassPricing.update({
            where: { id: existingPricing.id, level:'INTERMEDIATE', },
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
        return prisma.bootcampCLassPricing.create({
          data: {
            userId: data.userId,
            classId: data.classId,
            bootcampId: data.bootcampId,
            title: data.title,
            benefit1: data.benefit1,
            benefit2: data.benefit2,
            benefit3: data.benefit3,
            benefit4: data.benefit4,
            benefit5: data.benefit5,
            type: data.type,
            amount: data.amount,
            description: data.description,
            level:'INTERMEDIATE',
          },
        });
      }
      
  static async getAllClassPricings(bootcampId: string,  classId:string,) {
    return prisma.bootcampCLassPricing.findMany({ 
    where: { bootcampId,  classId, level:'INTERMEDIATE', },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
     });
  }

  static async getClassPricingById( bootcampId: string, classId:string,  id: string) {
    return prisma.bootcampCLassPricing.findUnique({ 
      where: {bootcampId, classId, id, level:'INTERMEDIATE', },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
     });
  }


  static async deleteClassPricing(bootcampId:string, classId:string,id: string) {
    return prisma.bootcampCLassPricing.delete({ where: {bootcampId, classId, id, level:'INTERMEDIATE',} });
  }
}
