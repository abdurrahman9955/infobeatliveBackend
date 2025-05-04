import prisma from '../../utils/prisma';
import multer, { MulterError } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { deleteFromS3, uploadToS3 } from '../../utils/s3Upload';

dotenv.config();
dotenv.config({ path: '../../../../../backend/.env' });

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
    const fileExtension = file.originalname.split('.').pop();
    const imageKey = `profile/${userId}/images/${uniqueFilename}.${fileExtension}`;

    // Upload to GCP Storage
    const fileUrl = await uploadToS3(file.buffer, imageKey, file.mimetype);
   
    if (!fileUrl) {
      console.error('Error: Upload result is missing.');
      res.status(500).json({ success: false, error: 'Upload failed', message: 'Upload failed' });
      return;
    }

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

  profileRoutes.delete('/user/profile/image/delete', async (req: Request<{ userId: string }>, res: Response<DeleteProfileResponse>) => {
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


      const urlParts = user.photoUrl.split('.digitaloceanspaces.com/');
      const imageKey = urlParts[1];
 
      if (!imageKey) {
        return res.status(400).json({ success: false, error: 'Invalid image URL' });
      }
  
      // Delete file from GCP bucket
      await deleteFromS3(imageKey);
  
      // Remove photoUrl from database
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
