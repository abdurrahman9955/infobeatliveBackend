import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import prisma from '../../utils/prisma';

dotenv.config();

const academyClassPaymentRouter = express.Router();

function verifySignature(secret: string, payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload, 'utf8');
  const digest = hmac.digest('hex');
  return digest === signature;
}

academyClassPaymentRouter.post('/create-checkout/monthly/:id/:userId/:classId/:bootcampId', async (req: Request, res: Response) => {
    try {
      const { id, userId, classId, bootcampId } = req.params;

      const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID_MONTHLY!;

      const existingPricing = await prisma.bootcampCLassPricing.findUnique({
        where:{ id, classId, bootcampId },
      });

      if (!existingPricing) {
        throw new Error('This pricing did not exists in the class');
      }

      const existingSubscription = await prisma.bootcampClassSubscription.findFirst({
         where:{ bootcampId, classId, userId, },
      });

      if (existingSubscription) {
        await prisma.bootcampClassSubscription.update({
          where:{ id:existingSubscription.id },
          data: { 
            type:existingPricing.type,
            amount:Number(existingPricing.amount)
          },
        });
    }

      if (!existingSubscription) {
          await prisma.bootcampClassSubscription.create({
            data: {
              bootcampId,
              classId,
              userId,
              type:existingPricing.type,
              amount:Number(existingPricing.amount),
              level:existingPricing.level,
            },
          });
      }

      const checkoutData = {
        checkout: {
          variant_id: variantId,
          custom_price:existingPricing.amount,
          currency: 'USD',
          expires_at: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
          custom_data: {
            user_id: userId,
            class_id: classId,
            academy_id:bootcampId,
            level:existingPricing.level,
            currency: 'USD',
            amount:existingPricing.amount,
            subscription_type:existingPricing.type
          }
        }
      };
  
      const response = await axios.post( 'https://api.lemonsqueezy.com/v1/checkouts',
        checkoutData,
        {
          headers: {
            'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );
  
      res.json({ checkoutUrl: response.data.data.checkout.url });
    } catch (error) {
      console.error('Error creating checkout:', error);
      res.status(500).json({ message: 'Something went wrong creating the checkout' });
    }
  });

  
academyClassPaymentRouter.post('/create-checkout/yearly/:id/:userId/:classId/:bootcampId', async (req: Request, res: Response) => {
  try {
    const { id, userId, classId, bootcampId } = req.params;

    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID_YEARLY!;

    const existingPricing = await prisma.bootcampCLassPricing.findUnique({
      where:{ id, classId, bootcampId },
    });

    if (!existingPricing) {
      throw new Error('This pricing did not exists in the class');
    }

    const existingSubscription = await prisma.bootcampClassSubscription.findFirst({
       where:{ bootcampId, classId, userId, },
    });

    if (existingSubscription) {
      await prisma.bootcampClassSubscription.update({
        where:{ id:existingSubscription.id },
        data: { 
          type:existingPricing.type,
          amount:Number(existingPricing.amount)
        },
      });
  }

    if (!existingSubscription) {
        await prisma.bootcampClassSubscription.create({
          data: {
            bootcampId,
            classId,
            userId,
            type:existingPricing.type,
            amount:Number(existingPricing.amount),
            level:existingPricing.level,
          },
        });
    }

    const checkoutData = {
      checkout: {
        variant_id: variantId,
        custom_price:existingPricing.amount,
        currency: 'USD',
        expires_at: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
        custom_data: {
          user_id: userId,
          class_id: classId,
          academy_id:bootcampId,
          level:existingPricing.level,
          currency: 'USD',
          amount:existingPricing.amount,
          subscription_type:existingPricing.type
        }
      }
    };

    const response = await axios.post( 'https://api.lemonsqueezy.com/v1/checkouts',
      checkoutData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    res.json({ checkoutUrl: response.data.data.checkout.url });
  } catch (error) {
    console.error('Error creating checkout:', error);
    res.status(500).json({ message: 'Something went wrong creating the checkout' });
  }
});


academyClassPaymentRouter.post('/create-checkout/one-time/:id/:userId/:classId/:bootcampId', async (req: Request, res: Response) => {
  try {
    const { id, userId, classId, bootcampId } = req.params;

    const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID_ONE_TIME!;

    const existingPricing = await prisma.bootcampCLassPricing.findUnique({
      where:{ id, classId, bootcampId },
    });

    if (!existingPricing) {
      throw new Error('This pricing did not exists in the class');
    }

    const existingSubscription = await prisma.bootcampClassSubscription.findFirst({
       where:{ bootcampId, classId, userId, },
    });

    if (existingSubscription) {
      await prisma.bootcampClassSubscription.update({
        where:{ id:existingSubscription.id },
        data: { 
          type:existingPricing.type,
          amount:Number(existingPricing.amount)
        },
      });
  }

    if (!existingSubscription) {
        await prisma.bootcampClassSubscription.create({
          data: {
            bootcampId,
            classId,
            userId,
            type:existingPricing.type,
            amount:Number(existingPricing.amount),
            level:existingPricing.level,
          },
        });
    }

    const checkoutData = {
      checkout: {
        variant_id: variantId,
        custom_price:existingPricing.amount,
        currency: 'USD',
        expires_at: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
        custom_data: {
          user_id: userId,
          class_id: classId,
          academy_id:bootcampId,
          level:existingPricing.level,
          currency: 'USD',
          amount:existingPricing.amount,
          subscription_type:existingPricing.type
        }
      }
    };

    const response = await axios.post( 'https://api.lemonsqueezy.com/v1/checkouts',
      checkoutData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    res.json({ checkoutUrl: response.data.data.checkout.url });
  } catch (error) {
    console.error('Error creating checkout:', error);
    res.status(500).json({ message: 'Something went wrong creating the checkout' });
  }
});
  

  academyClassPaymentRouter.post('/webhook',  express.raw({ type: 'application/json' }), async (req, res) => {
    try {
    const signature = req.headers['x-signature'] as string;
    const rawBody = req.body.toString('utf8');
    const secret = process.env.LEMONSQUEEZY_SIGNING_SECRET!;
  
    const isValid = verifySignature(secret, rawBody, signature);
    if (!isValid) {
      return res.status(400).send('Invalid signature');
    }
 
    const event = JSON.parse(rawBody);
    const eventType = event.meta?.event_name;
 
    if (eventType === 'subscription_payment_success' || eventType === 'order_created') {
      const customData = event.data?.attributes?.custom_data;

      if (!customData) {
        console.warn('Missing custom_data in webhook');
        return res.status(400).send('Missing custom_data');
      }

      const existingMember = await prisma.bootcampStudent.findUnique({
        where: { userId_classId: { userId: customData.user_id, classId: customData.class_id } },
      });

      if (existingMember) {
          await prisma.bootcampStudent.update({
            where: { id: existingMember.id},
            data: { 
                planType:customData.subscription_type, 
                amount:Number(customData.amount),
                isStudent:true, 
                isSuspended: false 
             },
           
          });
      }
   
      if (!existingMember) {
      await prisma.bootcampStudent.create({
        data: {
          userId:customData.user_id,
          classId:customData.class_id,
          planType:customData.subscription_type,
          amount:Number(customData.amount),
          isStudent:true,
          level:customData.level,
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
    
    } else {
      console.log("Unhandled webhook event:", eventType);
    }

    if (eventType === 'subscription_payment_failed') {
      const customData = event.data?.attributes?.custom_data;
      console.log('❌ Payment failed:');
      // Notify user, stop access, etc.
    }
 
    if (eventType === 'subscription_created') {
      console.log('📦 Subscription created.');
    }
  
    res.status(200).send('Webhook received');
    } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).send('Internal error');
  }
  });
  

export default academyClassPaymentRouter;
