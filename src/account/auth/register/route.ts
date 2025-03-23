import express, { Request, Response } from 'express';
import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';
import { SES } from '@aws-sdk/client-ses';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const MY_S3_ACCESS_KEY = process.env.MY_S3_ACCESS_KEY!;
const MY_S3_SECRET_KEY = process.env.MY_S3_ACCESS_KEY!;

const MY_S3_REGION = 'us-east-1'
const AUTH_EMAIL="infobeatlive@gmail.com"

const prisma = new PrismaClient();
const registerRoutes = express.Router();

const ses = new SES({
  credentials: {
    accessKeyId:MY_S3_ACCESS_KEY,
    secretAccessKey:MY_S3_SECRET_KEY,
  },
  region:MY_S3_REGION,
});

async function sendSESOtp(email: string, otp: number): Promise<void> {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: `Dear our lovely and valuable user,

                 Your One-Time Password (OTP) is: ${otp}. This code is valid for 60 seconds.
          
                 Please use this OTP to complete your registration on advertConnectPro.com.
          
                 Note: Do not share this OTP with anyone for security reasons. If you did not request

                 this OTP, please ignore this message.`,
        },
      },
      Subject: {
        Data: 'Your OTP for sign-up to advertConnectPro.com',
      },
    },
    Source:AUTH_EMAIL,
  };

  try {
    await ses.sendEmail(params);
    console.log(`Email sent to ${email}: ${otp}`);
  } catch (error) {
    console.error('SES email error:', error);
    throw new Error('Failed to send email OTP');
  }
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

type GenerateToken = (userId: string) => Promise<string>;

const generateAccessToken: GenerateToken = (userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token!);
      }
    });
  });
};

const generateRefreshToken: GenerateToken = (userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token!);
      }
    });
  });
};

registerRoutes.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email' });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid password' });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      const account = await prisma.account.findFirst({
        where: { userId: existingUser.id },
      });

      if (account && !account.isVerified) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            firstName,
            lastName,
            password: password ? await argon2.hash(password) : existingUser.password,
          },
        });

        const otp = Math.floor(100000 + Math.random() * 900000);

        setTimeout(() => {
          console.log(`OTP expired for ${email}: ${otp}`);
        }, 60000);

        const accessToken = await generateAccessToken(existingUser.id );
        const refreshToken = await generateRefreshToken(existingUser.id );

        await prisma.account.update({
          where: { id: account.id },
          data: {
            otp: otp.toString(),
            otpExpiration: new Date(Date.now() + 60000),
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        });

        await sendSESOtp(email, otp);

        return res.status(201).json({ message: 'User updated and OTP sent' });
      }

      return res.status(401).json({ error: 'User already exists and is already verified or inactive' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    setTimeout(() => {
      console.log(`OTP expired for ${email}: ${otp}`);
    }, 60000);

    const hashedPassword = await argon2.hash(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role: 'USER',
      },
    });

    const accessToken = await generateAccessToken(newUser.id);
    const refreshToken = await generateRefreshToken(newUser.id);

    await prisma.account.create({
      data: {
        userId: newUser.id,
        type: 'credentials',
        provider: 'local',
        handle:'@'+firstName+'/'+newUser.count,
        access_token: accessToken,
        refresh_token: refreshToken,
        otp: otp.toString(),
        otpExpiration: new Date(Date.now() + 60000),
        isVerified: false,
      },
    });

       await prisma.user.update({ where: { id: newUser.id },
       data: { handle:'@'+firstName+'/'+newUser.count }, });

       await prisma.createActivities.create({ data:{ email:email, accountCreate:1, },});
       await prisma.deleteActivities.create({ data:{  email:email,},  });
       await prisma.groupActivities.create({ data:{  email:email,},  });
       await prisma.classActivities.create({ data:{  email:email,},  });
       await prisma.bootCampActivities.create({ data:{  email:email,  }, });
      
      await sendSESOtp(email, otp);

      return res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error:'Something went wrong! Please try again' });
  }
});

export default registerRoutes;
