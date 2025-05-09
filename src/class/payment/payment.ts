import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import prisma from '../../utils/prisma';
import { Resend } from 'resend';

dotenv.config();

const classPaymentRouter = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY!); 

async function sendResendOtp(email: string, className?:string, firstName?:string, lastName?:string ): Promise<void> {
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


function verifySignature(secret: string, payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload, 'utf8');
  const digest = hmac.digest('hex');
  return digest === signature;
}

classPaymentRouter.post('/create-checkout/monthly/:id/:userId/:classId', async (req: Request, res: Response) => {

    try {
      const { id, userId, classId } = req.params;

      const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID_MONTHLY!;
      const store_id = process.env.LEMON_SQUEEZY_STORE_ID!;

      const existingPricing = await prisma.cLassPricing.findUnique({
        where:{ id, classId, },
      });

      if (!existingPricing) {
        throw new Error('This pricing did not exists in the class');
      }

      const existingSubscription = await prisma.cLassSubscription.findFirst({
         where:{ userId, classId, },
      });

      const existingClass = await prisma.class.findUnique({
        where:{ id:classId },
     });

      if (existingSubscription) {
        await prisma.cLassSubscription.update({
          where: { id: existingSubscription.id },
          data: {
            type: existingPricing.type,
            amount: Number(existingPricing.amount),
          },
        });
      } else {
        await prisma.cLassSubscription.create({
          data: {
            classId,
            userId,
            type: existingPricing.type,
            amount: Number(existingPricing.amount),
          },
        });
      }

      const checkoutSessionPayload = {
        data: {
          type: 'checkouts',
          attributes: {
            custom_price: Number(existingPricing.amount) * 100, // price in cents
            product_options: {
              redirect_url: `https://www.infobeatlive.com/class/home/${classId}`,
              enabled_variants: [Number(variantId)], // Add this to only allow this variant
            },
            checkout_options: {
              button_color: "#84cc16" // Optional but matches Lemon Squeezy example
            },
            checkout_data: {
              custom: {
                user_id: String(userId),
                class_id: String(classId),
                class_name: String(existingClass?.name || ''),
                subscription_type: String(existingPricing.type),
                amount: String(existingPricing.amount),
              }
            },
            expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Expires in 30 minutes
           // preview: false,
            test_mode: true,
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: store_id,
              }
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId,
              }
            }
          }
        }
      };
      
   
      const response = await axios.post(
        'https://api.lemonsqueezy.com/v1/checkouts',
        checkoutSessionPayload,
        {
          headers: {
            Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json',
          }
        }
      );

      const checkoutUrl = response.data?.data?.attributes?.url;

       if (!checkoutUrl) {
        console.log('Failed to generate checkout URL.');
        throw new Error('Failed to generate checkout URL.');
       }

      res.json({ checkoutUrl });
     } catch (error:any) {
      console.log('Error creating checkout:', error.message);
      res.status(500).json({ message:`Something went wrong creating the checkout ${error.message}` });
     }

  });


  classPaymentRouter.post('/create-checkout/yearly/:id/:userId/:classId', async (req: Request, res: Response) => {

    try {
      const { id, userId, classId } = req.params;

      const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID_YEARLY!;
      const store_id = process.env.LEMON_SQUEEZY_STORE_ID!;

      const existingPricing = await prisma.cLassPricing.findUnique({
        where:{ id, classId, },
      });

      if (!existingPricing) {
        throw new Error('This pricing did not exists in the class');
      }

      const existingSubscription = await prisma.cLassSubscription.findFirst({
         where:{ userId, classId, },
      });

      const existingClass = await prisma.class.findUnique({
        where:{ id:classId },
     });

      if (existingSubscription) {
        await prisma.cLassSubscription.update({
          where: { id: existingSubscription.id },
          data: {
            type: existingPricing.type,
            amount: Number(existingPricing.amount),
          },
        });
      } else {
        await prisma.cLassSubscription.create({
          data: {
            classId,
            userId,
            type: existingPricing.type,
            amount: Number(existingPricing.amount),
          },
        });
      }

      const checkoutSessionPayload = {
        data: {
          type: 'checkouts',
          attributes: {
            custom_price: Number(existingPricing.amount) * 100, // price in cents
            product_options: {
              redirect_url: `https://www.infobeatlive.com/class/home/${classId}`,
              enabled_variants:[Number(variantId)], // Add this to only allow this variant
            },
            checkout_options: {
              button_color: "#84cc16" // Optional but matches Lemon Squeezy example
            },
            checkout_data: {
              custom: {
                user_id: String(userId),
                class_id: String(classId),
                class_name: String(existingClass?.name || ''),
                subscription_type: String(existingPricing.type),
                amount: String(existingPricing.amount),
              }
            },
            expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Expires in 30 minutes
           // preview: false,
            test_mode: true,
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id:store_id,
              }
            },
            variant: {
              data: {
                type: 'variants',
                id:variantId,
              }
            }
          }
        }
      };
    
      const response = await axios.post(
        'https://api.lemonsqueezy.com/v1/checkouts',
        checkoutSessionPayload,
        {
          headers: {
            Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json',
          }
        }
      );
 
 
      const checkoutUrl = response.data?.data?.attributes?.url;

      if (!checkoutUrl) {
       console.log('Failed to generate checkout URL.');
       throw new Error('Failed to generate checkout URL.');
      }

      res.json({ checkoutUrl });
     } catch (error) {
       console.log('Error creating checkout:', error);
       res.status(500).json({ message: `Something went wrong creating the checkout ${error}` });
     }

  });

  classPaymentRouter.post('/create-checkout/one-time/:id/:userId/:classId', async (req: Request, res: Response) => {

    try {
      const { id, userId, classId } = req.params;

      const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID_ONE_TIME!;
      const store_id = process.env.LEMON_SQUEEZY_STORE_ID!;

      const existingPricing = await prisma.cLassPricing.findUnique({
        where:{ id, classId, },
      });

      if (!existingPricing) {
        throw new Error('This pricing did not exists in the class');
      }

      const existingSubscription = await prisma.cLassSubscription.findFirst({
         where:{ userId, classId, },
      });

      const existingClass = await prisma.class.findUnique({
        where:{ id:classId },
     });

      if (existingSubscription) {
        await prisma.cLassSubscription.update({
          where: { id: existingSubscription.id },
          data: {
            type: existingPricing.type,
            amount: Number(existingPricing.amount),
          },
        });
      } else {
        await prisma.cLassSubscription.create({
          data: {
            classId,
            userId,
            type: existingPricing.type,
            amount: Number(existingPricing.amount),
          },
        });
      }

      const checkoutSessionPayload = {
        data: {
          type: 'checkouts',
          attributes: {
            custom_price: Number(existingPricing.amount) * 100, // price in cents
            product_options: {
              redirect_url: `https://www.infobeatlive.com/class/home/${classId}`,
              enabled_variants: [Number(variantId)], // Add this to only allow this variant
            },
            checkout_options: {
              button_color: "#84cc16" // Optional but matches Lemon Squeezy example
            },
            checkout_data: {
              custom: {
                user_id: String(userId),
                class_id: String(classId),
                class_name: String(existingClass?.name || ''),
                subscription_type: String(existingPricing.type),
                amount: String(existingPricing.amount),
              }
            },
            expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Expires in 30 minutes
            //preview:false,
            test_mode: true,
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: store_id,
              }
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId,
              }
            }
          }
        }
      };
 
      const response = await axios.post(
        'https://api.lemonsqueezy.com/v1/checkouts',
        checkoutSessionPayload,
        {
          headers: {
            Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json',
          }
        }
      );
 
 
      const checkoutUrl = response.data?.data?.attributes?.url;

      if (!checkoutUrl) {
       console.log('Failed to generate checkout URL.');
       throw new Error('Failed to generate checkout URL.');
      }

     res.json({ checkoutUrl });
      } catch (error:any) {
      console.log('Error creating checkout:', error.message);
      res.status(500).json({ message:`Something went wrong creating the checkout ${error.message}` });
    }
  });

export default classPaymentRouter;
