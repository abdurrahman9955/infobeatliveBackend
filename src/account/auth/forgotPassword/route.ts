import express, { Request, Response } from 'express';
import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';
import { SES, SendEmailCommandInput } from '@aws-sdk/client-ses';
import validator from 'validator';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '../../../../../backend/.env' });

const MY_S3_ACCESS_KEY = process.env.MY_S3_ACCESS_KEY!;
const MY_S3_SECRET_KEY = process.env.MY_S3_ACCESS_KEY!;

const MY_S3_REGION = 'us-east-1'
const AUTH_EMAIL="infobeatlive@gmail.com"

const prisma = new PrismaClient();
const resetPasswordRouter = express.Router();

const ses = new SES({
  credentials: {
    accessKeyId:MY_S3_ACCESS_KEY,
    secretAccessKey:MY_S3_SECRET_KEY,
  },
  region:MY_S3_REGION,
});

async function sendSESOtp(email: string, otp: number): Promise<void> {
  const params: SendEmailCommandInput = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: `Dear our lovely and valuable user,

          Your One-Time Password (OTP) is: ${otp}. This code is valid for 60 seconds.

          Please use this OTP to update your password on advertConnectPro.

          Note: Do not share this OTP with anyone for security reasons. If you did not request this OTP, please ignore this message.`,
        },
      },
      Subject: {
        Data: 'Your OTP for updating password on advertConnectPro',
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

resetPasswordRouter.post('/update-password', async (req: Request, res: Response) => {
  try {
    const { email, newPassword }: { email: string; newPassword: string } = req.body;

    // Validate email input
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email.' });
    }

    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Please provide a valid password (at least 8 characters).' });
    }

    // Check if the user exists
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the account exists
    const account = await prisma.account.findFirst({
      where: { userId: user.id },
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    // Generate reset OTP and expiry
    const resetOtp = Math.floor(100000 + Math.random() * 900000);
    const resetOtpExpiry = new Date(Date.now() + 60000); // OTP valid for 60 seconds

    // Hash the new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update the account with reset OTP, expiry, and hashed new password
    await prisma.account.update({
      where: { id: account.id },
      data: {
        otp: resetOtp.toString(),
        otpExpiration: resetOtpExpiry,
        tempPassword: hashedPassword,
      },
    });

    // Send OTP to user's email
    await sendSESOtp(email, resetOtp);

    return res.status(200).json({ message: 'Reset OTP sent to your email.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Something went wrong! Please try again.' });
  }
});

export default resetPasswordRouter;
