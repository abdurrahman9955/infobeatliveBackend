import prisma from "../../utils/prisma";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!); 

async function sendResendOtp(email: string,subject:string, title:string, reason:string, description:string, conclusion:string ): Promise<void> {
  try {
    await resend.emails.send({
      from: 'noreply@infobeatlive.com',
      to: email,
      subject: subject,
      html: `
       <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Thank You for Reaching Out</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .container {
        background-color: #ffffff;
        max-width: 600px;
        margin: 30px auto;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0,0,0,0.05);
      }
      .header {
        background-color: #599334;
        color: #ffffff;
        padding: 30px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .body {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
      }
      .footer {
        background-color: #f1f1f1;
        text-align: center;
        padding: 15px;
        font-size: 13px;
        color: #888;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        background-color: #599334;
        color: #ffffff !important;
        padding: 12px 25px;
        text-decoration: none;
        border-radius: 5px;
      }
      .signature {
        margin-top: 25px;
        font-style: italic;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${title}</h1>
      </div>
      <div class="body">
        <p>Hi there,</p>

        <p>${reason}</p>

        <p>${description}</p>

        <p>${conclusion}</p>

        <p>In the meantime, feel free to explore our platform and learn more about how Infobeatlive helps
             students and instructors grow through smart and powerful e-learning solutions.</p>

        <a href="https://www.infobeatlive.com" class="button">Visit Our Website</a>

        <p class="signature">Warm regards,<br />
        The Infobeatlive Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Infobeatlive. All rights reserved.<br/>
        <a href="https://www.infobeatlive.com">infobeatlive</a>
      </div>
    </div>
  </body>
  </html>`,});

  } catch (error) {
    console.error('Resend email error:', error);
    throw new Error('Failed to send OTP via Resend');
  }
}

export default class ClassVerifyService {

 
    static async createVerifyClass(data: {
      userId:string,
      classId:string,
      country?:string,        
      state?:string,           
      email?:string,            
      fullName?:string,            
      linkedinProfile?:string,    
      phoneNumber?:string,         
      aboutYourSelf?:string,     
      howToRunClass?:string,     
      personalBrand?:string,      
      description?:string,       
      why?:string,        
      }) {
        // Check if pricing already exists for the given classId and userId
        const existingVerification = await prisma.verifyClass.findFirst({
          where: {
            userId: data.userId,
            classId: data.classId,
          },
        });

        if (existingVerification) {

          await prisma.class.update({
            where: { id: data.classId },
            data: {
              verify:'PENDING'
            },
          });
         
          return prisma.verifyClass.update({
            where: { id: existingVerification.id },
            data: {
              country:data.country,        
              state:data.state,          
              email:data.email,            
              fullName:data.fullName,           
              linkedinProfile:data.linkedinProfile,  
              phoneNumber:data.phoneNumber,         
              aboutYourSelf:data.aboutYourSelf,   
              howToRunClass:data.howToRunClass,    
              personalBrand:data.personalBrand,     
              description:data.description,      
              why:data.why,  
            },
          });
        }


        if (!existingVerification) {
           await prisma.class.update({
            where: { id: data.classId },
            data: {
              verify:'PENDING'
            },
          });
        }
 
        // If no existing record, create a new one
        return prisma.verifyClass.create({
          data: {
            userId: data.userId,
            classId: data.classId,
            country:data.country,        
            state:data.state,          
            email:data.email,            
            fullName:data.fullName,           
            linkedinProfile:data.linkedinProfile,  
            phoneNumber:data.phoneNumber,         
            aboutYourSelf:data.aboutYourSelf,   
            howToRunClass:data.howToRunClass,    
            personalBrand:data.personalBrand,     
            description:data.description,      
            why:data.why,  
          },
        });
        
      }

  static async updateVerifyClass(data: {
    userId:string, classId:string, isVerified:boolean, verify:any, subject:string,
    title:string,  reason:string, description:string, conclusion:string
    }) {
     
      const existingVerification = await prisma.verifyClass.findFirst({
        where: {
          userId: data.userId,
          classId: data.classId,
        },
      });

      
      if (existingVerification) {
        await sendResendOtp(existingVerification.email as any, data.subject, data.title, 
        data.reason, data.description, data.conclusion);
     }
       
   return await prisma.class.update({
      where: { id: data.classId, createdBy: data.userId },
       data: {
         isVerified: data.isVerified, 
         verify: data.verify},});
   }

  static async getAllVerifyClass() {
    return prisma.verifyClass.findMany({ 
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
     });
  }

  static async getClassVerifyClassId(classId: string) {
    return prisma.verifyClass.findMany({ 
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


  static async getVerifyClass(id: string) {
    return prisma.verifyClass.findUnique({
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

  static async deleteVerifyClass(id: string) {
    return prisma.verifyClass.delete({ where: { id } });
  }
}
