import { PrismaClient } from '@prisma/client';
import multer, { MulterError } from 'multer';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import express, { Request, Response } from 'express';
import { ObjectCannedACL } from '@aws-sdk/client-s3'; 
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '../../../../../backend/.env' });

const MY_S3_ACCESS_KEY = process.env.MY_S3_ACCESS_KEY!;
const MY_S3_SECRET_KEY = process.env.MY_S3_ACCESS_KEY!;
const MY_S3_REGION = 'us-east-1'
const MY_S3_BUCKET_NAME  = 'infobeatlivebucket'

const prisma = new PrismaClient();
const s3 = new S3Client({
  credentials: {
    accessKeyId:MY_S3_ACCESS_KEY,
    secretAccessKey:MY_S3_SECRET_KEY,
  },
  region:MY_S3_REGION,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

interface UploadResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface GetProfileResponse {
    success: boolean;
    imageUrl?: string;
    error?: string;
  }
  
  interface DeleteProfileResponse {
    success: boolean;
    message?: string;
    error?: string;
  }

const handleFileUpload = async (req: Request, res: Response<UploadResponse>): Promise<void> => {
  try {
    await new Promise<void>((resolve, reject) => {
      upload(req, res, (err: any) => {
        if (err) {
          if (err instanceof MulterError) {
            return reject(new Error(`Multer error: ${err.message}`));
          }
          return reject(err);
        }
        resolve();
      });
    });

    const userId = req.headers['user-id'] as string; 
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, error: 'No file provided', message: 'Upload failed' });
      return;
    }

    const uniqueFilename = uuidv4();
    const imageKey = `profile/${userId}/images/${uniqueFilename}.${file.originalname.split('.').pop()}`;
    
    const processedImageBuffer = await sharp(file.buffer)
      .resize({
        width: 300,
        height: 300,
        kernel: sharp.kernel.lanczos3,
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      })
      .toFormat('jpeg', {
        quality:95,
        nearLossless: true,
      })
      .withMetadata()
      .toBuffer();

    // const uploadParams = {
    //   Bucket:MY_S3_BUCKET_NAME,
    //   Key: imageKey,
    //   Body: processedImageBuffer,
    //   ACL: 'public-read' as ObjectCannedACL, // Cast the string to ObjectCannedACL
    // };

    const uploadParams = {
      Bucket: MY_S3_BUCKET_NAME,
      Key: imageKey,
      Body: processedImageBuffer,
    };

    const uploadResult = await s3.send(new PutObjectCommand(uploadParams));

    if (!uploadResult) {
      console.error('Error: Upload result is missing.');
      res.status(500).json({ success: false, error: 'Upload failed', message: 'Upload failed' });
      return;
    }

    const bucketUrl = `https://${MY_S3_BUCKET_NAME}.s3.${MY_S3_REGION}.amazonaws.com`;
    const fileUrl = `${bucketUrl}/${imageKey}`;

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: userId },
    });

    if (existingProfile) {
      await prisma.profile.update({
        where: { userId: userId },
        data: { photoUrl: fileUrl },
      });
    } else {
      await prisma.profile.create({
        data: {
          userId: userId,
          photoUrl: fileUrl,
        },
      });
    }

    res.status(201).json({ success: true, message: 'Profile image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error', message: 'Upload failed' });
  }
};

const profileRoutes = express.Router();

profileRoutes.post('/user/profile/image/upload', handleFileUpload);


profileRoutes.get('/user/profile/image/get', async (req: Request<{ userId: string }>, res: Response<GetProfileResponse>) => {
    try {
      const userId = req.headers['user-id'] as string;  
 
      const user = await prisma.profile.findUnique({
        where: { userId: userId },
        select: { photoUrl: true },
      });
  
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
  
      if (!user.photoUrl) {
        return res.status(404).json({ success: false, error: 'Profile image not found' });
      }
  
      res.status(200).json({ success: true, imageUrl: user.photoUrl });
    } catch (error) {
      console.error('Error getting profile image:', error);
      if (error) {
        return res.status(500).json({ success: false, error: 'Database Error' });
      }
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
 
  profileRoutes.delete('/user/profile/image/delete', async (req: Request<{ userId: string }>,  res: Response<DeleteProfileResponse>) => {
    try {
      const userId = req.headers['user-id'] as string; 
  
      const user = await prisma.profile.findUnique({
        where: { userId: userId },
        select: { photoUrl: true },
      });
  
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
  
      if (!user.photoUrl) {
        return res.status(404).json({ success: false, error: 'Profile image not found' });
      }
  
      const imageKey = user.photoUrl.split('/').slice(-1)[0];
      const deleteParams = {
        Bucket:MY_S3_BUCKET_NAME,
        Key: `profile/${userId}/images/${imageKey}`, 
      };
  
      await s3.send(new DeleteObjectCommand(deleteParams));
  
      await prisma.profile.update({
        where: { userId: userId },
        data: { photoUrl: null },
      });
 
      res.status(200).json({ success: true, message: 'Profile image deleted successfully' });
    } catch (error) {
      console.error('Error deleting profile image:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

export default profileRoutes;
