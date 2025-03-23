import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { SES } from '@aws-sdk/client-ses';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '../../../../../backend/.env' });

const MY_S3_ACCESS_KEY = process.env.MY_S3_ACCESS_KEY!;
const MY_S3_SECRET_KEY = process.env.MY_S3_ACCESS_KEY!;

const MY_S3_REGION = 'us-east-1'
const AUTH_EMAIL="infobeatlive@gmail.com"

const prisma = new PrismaClient();
const routerOtpVerification = express.Router();

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
    jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: '30d' }, (err, token) => {
      if (err || !token) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};


routerOtpVerification.post('/verifySignUpOtp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the account associated with the user
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Check if the OTP matches
    if (account.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check if OTP has expired
    if (account.otpExpiration && new Date(account.otpExpiration) < new Date()) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Generate new tokens and expiration time
    const accessToken = await generateAccessToken(user.id); 
    const refreshToken = await generateRefreshToken(user.id);
    const tokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration

    // Update the account to mark the email as verified and set token expiration
    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        otp: otp,
        otpExpiration: new Date(Date.now() + 60000), // OTP expiration set to 1 minute
        isVerified: true,  // Mark the email as verified
        emailVerified: new Date(), // Set the current date as email verified date
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: tokenExpiration, // Set token expiration
      },
    });

    // Respond with success
    return res.status(200).json({
      message: 'OTP verified successfully',
      accessToken,
      userId: user.id
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

routerOtpVerification.post('/resendSignUpOtp', async (req, res) => {
  try {
    const { email }: { email: string } = req.body;

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the account associated with the user
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Generate a new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        otp: newOtp.toString(),
        otpExpiration: new Date(Date.now() + 60000), // OTP expiration set to 1 minute
      },
    });

     // Send the OTP to the user
     await sendSESOtp(email, newOtp);

    // Respond with success
    return res.status(200).json({
      message: 'OTP resent successfully',
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to send the OTP via SES (email service)
async function sendSESOtp(email: string, otp: string): Promise<void> {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: `Dear our lovely and valuable user,

          Your One-Time Password (OTP) is: ${otp}. This code is valid for 60 seconds.
   
          Please use this OTP to complete your registration on advertConnectPro.
   
          Note: Do not share this OTP with anyone for security reasons. If you did not request

         this OTP, please ignore this message.`,
        },
      },
      Subject: {
        Data: 'Your OTP for sign-up to advertConnectPro',
      },
    },
    Source:AUTH_EMAIL, // Ensure this is set correctly in your environment variables
  };

  try {
    await ses.sendEmail(params);
    console.log(`Email sent to ${email}: ${otp}`);
  } catch (error) {
    console.error('SES email error:', error);
    throw new Error('Failed to send email OTP');
  }
}

export default routerOtpVerification;
