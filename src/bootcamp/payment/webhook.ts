import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import prisma from '../../utils/prisma';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY!); 

const academyClassWebhookRouter = express.Router();

async function sendResendOtp(email: string, className:string, firstName:string, lastName:string ): Promise<void> {
  try {
    await resend.emails.send({
      from: 'noreply@infobeatlive.com',
      to: email,
      subject:`Welcome to ${className}, ${firstName}!`,
      html: `
       <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Class Subscription Confirmation</title>
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
        <h1>Welcome to ${className}!</h1>
      </div>
      <div class="body">
        <p>Hi ${firstName} ${lastName},</p>

        <p>Thank you for subscribing to the <strong>${className}</strong> class on Infobeatlive.</p>

         <p>We’re excited to have you on board and are committed to helping you learn, grow, and succeed 
         with expert-led instruction and practical content tailored to your goals.</p>


        <p>Your learning journey has just begun, and we can’t wait to see the progress you’ll make.</p>


        <p>In the meantime, feel free to explore our platform and discover more opportunities to 
        enhance your skills through Infobeatlive's powerful e-learning features.</p>


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

async function sendMessageToNotifyStudents(
    email: string,
    className: string,
    firstName: string,
    lastName: string,
    expectedAmount: number,
    paidAmount: number,
    classId:string,
    classPurpose:string,
    bootcampId:string,
  ): Promise<void> {
    try {
      await resend.emails.send({
        from: 'support@infobeatlive.com',
        to: email,
        subject: `Payment Issue for ${className}, ${firstName}`,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Payment Notification</title>
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
              background-color: #d9534f;
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
              <h1>Payment Issue Detected</h1>
            </div>
            <div class="body">
              <p>Hi ${firstName} ${lastName},</p>
  
              <p>We received a payment of <strong>$${(paidAmount / 100).toFixed(2)}</strong> for the <strong>${className}</strong> class, but the expected amount is <strong>$${(expectedAmount / 100).toFixed(2)}</strong>.</p>
  
              <p>Unfortunately, this payment does not match the required total. To complete your enrollment, you must pay the full amount.</p>
  
              <p>Please take one of the following actions:</p>

             <ul>
              <li>academy id ${bootcampId}</li>
              <li>class id ${classId}</li>
              <li>class name: <strong>${className}</strong> through the app or website</li>
              <li>class purpose: ${classPurpose}</li>
             </ul>
            

              <ul>
                <li>
                 Visit our <strong>Support Center <a href="https://www.infobeatlive.com/support" style="color: #007bff; text-decoration: underline;">support center</a></strong> through the app or website
                </li>
                <li>
                  Contact us directly inside the app <a href="https://www.infobeatlive.com/contact" style="color: #007bff; text-decoration: underline;">contact us</a>
                </li>
                <li>
                  Email our support team at <a href="mailto:support@infobeatlive.com" style="color: #007bff; text-decoration: underline;">support@infobeatlive.com</a>
                </li>
              </ul>
    

              <p>We’re here to assist you and help resolve this issue as quickly as possible so you can begin learning without delay.</p>
 
              <a href="https://www.infobeatlive.com" class="button">Go to Infobeatlive</a>
  
              <p class="signature">Warm regards,<br />
              The Infobeatlive Team</p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Infobeatlive. All rights reserved.<br/>
              <a href="https://www.infobeatlive.com">infobeatlive.com</a>
            </div>
          </div>
        </body>
        </html>
        `,
      });
    } catch (error) {
      console.error('Resend email error:', error);
      throw new Error('Failed to send payment notification email.');
    }
  }
  


function verifySignature(secret: string, payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload, 'utf8');
  const digest = hmac.digest('hex');
  return digest === signature;
}

  academyClassWebhookRouter.post('/webhook',  express.raw({ type: 'application/json' }), async (req, res) => {
    try {

    const signature = req.headers['x-signature'] as string;
    if (!signature) {
      return res.status(400).send('Missing signature');
    }

    const rawBody = req.body.toString('utf8');
    const secret = process.env.LEMONSQUEEZY_SIGNING_SECRET!;
  
    const isValid = verifySignature(secret, rawBody, signature);
    if (!isValid) {
      return res.status(400).send('Invalid signature');
    }
 
    const event = JSON.parse(rawBody);
    const eventType = event.meta?.event_name;
   

    if (eventType === 'order_created' || eventType === 'subscription_payment_success') {
      const customData = event.meta?.custom_data;
      const formatted = event.data?.attributes?.total_formatted;

      if (!customData) {
        console.warn('Missing custom_data in webhook');
        return res.status(400).send('Missing custom_data');
      }

      if (!customData.academy_id || !customData.user_id || !customData.class_id || !customData.subscription_type || !customData.level || !customData.amount) {
        console.warn('Missing custom_data in webhook');
        return res.status(400).send('Missing custom_data');
      };

      const totalCents = event.data?.attributes?.total;
      const expectedAmount = Number(customData.amount) * 100; // convert dollars to cents

      if (totalCents < expectedAmount) {
      // Optional: fetch existing subscription
      const existingSubscription = await prisma.bootcampClassSubscription.findFirst({
         where: {
          bootcampId: customData.academy_id,
          classId: customData.class_id,
          userId: customData.user_id,
          amount: expectedAmount,
          },
        });

        if (existingSubscription) {
          await prisma.bootcampClassSubscription.update({
           where: { id: existingSubscription.id },
           data: {
           type: customData.subscription_type,
           amount: expectedAmount, // cents
           },
         });
       }

            
       const user = await prisma.user.findUnique({
        where: { id: customData.user_id,  },
      });

      const existingClass = await prisma.bootcampClass.findUnique({
        where:{ id:customData.class_id, bootcampId: customData.academy_id, },
     });


      if (user && existingClass) {
        await sendMessageToNotifyStudents( user?.email as any, existingClass?.name as any,
        user?.firstName as any, user?.lastName as any, expectedAmount, totalCents,
        existingClass?.id as any, existingClass?.purpose as any, existingClass?.bootcampId as any );
     }

       console.warn('The customer did not pay the exact required amount');
       return res.status(400).send('Student must pay the total amount');
      }


      const existingMember = await prisma.bootcampStudent.findUnique({
        where: { userId_classId: { userId: customData.user_id, classId: customData.class_id } },
      });


      const durationInDays = customData.subscription_type === "MONTHLY" ? 30 : customData.subscription_type === "YEARLY" ? 365 : null;

      if (existingMember) {
          await prisma.bootcampStudent.update({
            where: { id: existingMember.id},
            data: { 
                planType:customData.subscription_type, 
                amount:Number(totalCents),
                isStudent:true, 
                isSuspended: false, 
                expiresAt: durationInDays ? new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000) : new Date(),
             },
           
          });
      }
 
      if (!existingMember) {
      await prisma.bootcampStudent.create({
        data: {
          userId:customData.user_id,
          classId:customData.class_id,
          planType:customData.subscription_type,
          amount:Number(totalCents),
          isStudent:true,
          level:customData.level,
          expiresAt: durationInDays ? new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000) : new Date(),
        },
      });}

      const classEarning = await prisma.bootcampCLassEarning.findFirst({
        where: { bootcampId: customData.academy_id, classId: customData.class_id  },
      });

      if (classEarning) {
        await prisma.bootcampCLassEarning.update({
          where: { id:classEarning.id},
          data: { 
              balance:{ increment:Number(customData.amount) },
              Total:{increment:Number(customData.amount)}, 
             
           }, });}

           if (!classEarning) {
            await prisma.bootcampCLassEarning.create({
              data: {
                bootcampId: customData.academy_id,
                classId:customData.class_id,
                balance:Number(customData.amount),
                payout:0,
                Total:Number(customData.amount),
                level:customData.level,

              },
            });}

            await prisma.bootcampClassSubscribed.create({
              data: {
                bootcampId:customData.academy_id,
                classId:customData.class_id,
                userId:customData.user_id,
                type: customData.subscription_type,
                amount: Number(customData.amount),
                level:customData.level,
              },
            });

             
            const user = await prisma.user.findUnique({
              where: { id: customData.user_id,  },
            });

            const existingClass = await prisma.bootcampClass.findUnique({
              where:{ id:customData.class_id, bootcampId: customData.academy_id, },
           });


            if (user && existingClass) {
              await sendResendOtp( user?.email as any, existingClass?.name as any, user?.firstName as any, user?.lastName as any);
           }
    
    } else {
      console.log("Unhandled webhook event:", eventType);
    }
 
    if (eventType === 'subscription_created') {
      console.log('📦 Subscription created.');
    }
  
    res.status(200).send('Webhook received');
    } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).send(`Internal error ${err}`);
  }
  });
  

export default academyClassWebhookRouter;
