import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class ClassPayoutService {

    static async createClassPayout(data: {
      userId:string,
      classId:string,
      country?:string,
      currency?:string,
      city?:string,
      email?:string,
      fullName?:string,
      bankName?:string,
      bankAccountNumber?:string,
      bankAddress?:string,
      swiftOrBic?:string,
      iBan?:string,
      routingNumber?:string,
      phoneNumber?:string,
      description?:string,
      accountType?:string,
      postalCode?:string,
      type?:string,
      }) {
        // Check if pricing already exists for the given classId and userId
        const existingPricing = await prisma.cLassPayoutMethod.findFirst({
          where: {
            userId: data.userId,
            classId: data.classId,
            type: data.type,
          },
        });
  
        if (existingPricing) {
          // If it exists, update it
          return prisma.cLassPayoutMethod.update({
            where: { id: existingPricing.id },
            data: {
              country:data.country,
              currency:data.currency,
              city:data.city,
              email:data.email,
              fullName:data.fullName,
              bankName:data.bankName,
              bankAccountNumber:data.bankAccountNumber,
              bankAddress:data.bankAddress,
              swiftOrBic:data.swiftOrBic,
              iBan:data.iBan,
              routingNumber:data.routingNumber,
              phoneNumber:data.phoneNumber,
              description:data.description,
              accountType:data.accountType,
              postalCode:data.postalCode,
              type:data.type,
            },
          });
        }
    
        // If no existing record, create a new one
        return prisma.cLassPayoutMethod.create({
          data: {
            userId: data.userId,
            classId: data.classId,
            country:data.country,
            currency:data.currency,
            city:data.city,
            email:data.email,
            fullName:data.fullName,
            bankName:data.bankName,
            bankAccountNumber:data.bankAccountNumber,
            bankAddress:data.bankAddress,
            swiftOrBic:data.swiftOrBic,
            iBan:data.iBan,
            routingNumber:data.routingNumber,
            phoneNumber:data.phoneNumber,
            description:data.description,
            accountType:data.accountType,
            postalCode:data.postalCode,
            type:data.type,
          },
        });
        
      }

  static async getAllClassPayouts(classId: string) {
    return prisma.cLassPayoutMethod.findMany({ 
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

  static async getClassPayoutById(id: string) {
    return prisma.cLassPayoutMethod.findUnique({
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

  static async deleteClassPayout(id: string) {
    return prisma.cLassPayoutMethod.delete({ where: { id } });
  }
}
