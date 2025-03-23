import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class ClassPayoutService {

    static async createClassPayout(data: {
      userId:string,
      bootcampId:string,
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
        const existingPricing = await prisma.bootcampPayoutMethod.findFirst({
          where: {
            userId: data.userId,
            bootcampId: data.bootcampId,
            type: data.type,
          },
        });
 
        if (existingPricing) {
          // If it exists, update it
          return prisma.bootcampPayoutMethod.update({
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
        return prisma.bootcampPayoutMethod.create({
          data: {
            userId: data.userId,
            bootcampId: data.bootcampId,
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

  static async getAllClassPayouts(bootcampId: string) {
    return prisma.bootcampPayoutMethod.findMany({ 
    where: { bootcampId },
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
    return prisma.bootcampPayoutMethod.findUnique({ 
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
    return prisma.bootcampPayoutMethod.delete({ where: { id } });
  }
}
