import express, { Request, Response } from 'express';
import argon2 from 'argon2';
import { SES } from '@aws-sdk/client-ses';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '../../../../../backend/.env' });

const MY_S3_ACCESS_KEY = process.env.MY_S3_ACCESS_KEY!;
const MY_S3_SECRET_KEY = process.env.MY_S3_ACCESS_KEY!;

const MY_S3_REGION = 'us-east-1'
const AUTH_EMAIL="infobeatlive@gmail.com"

const prisma = new PrismaClient();
const loginRoutes = express.Router();

const ses = new SES({
  credentials: {
    accessKeyId:MY_S3_ACCESS_KEY,
    secretAccessKey:MY_S3_SECRET_KEY,
  },
  region:MY_S3_REGION,
});

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const generateAccessToken = (userId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err || !token) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

const generateRefreshToken = (userId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err || !token) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

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
   
          Please use this OTP to complete your Login on advertConnectPro.com .
   
          Note: Do not share this OTP with anyone for security reasons. If you did not request

         this OTP, please ignore this message.`,
        },
      },
      Subject: {
        Data: 'Your OTP for login to your account',
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

loginRoutes.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Email not registered. Please create a new account.' });
    }

    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!account) {
      return res.status(401).json({ error: 'Account not found. Please contact support.' });
    }

    // Verify the password
    const isPasswordValid = await argon2.verify(user.password as any, password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password. Please enter the correct password and try again.' });
    }

    // Generate OTP and expiration
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiration = new Date(Date.now() + 60000); // 1 minute validity

    // Update OTP and tokens in the account model
    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        otp: otp.toString(),
        otpExpiration: otpExpiration,
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });

    // Send OTP via email
    await sendSESOtp(email, otp);

    return res.status(200).json({
      message: 'OTP sent successfully. Please verify your email to continue.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default loginRoutes;
