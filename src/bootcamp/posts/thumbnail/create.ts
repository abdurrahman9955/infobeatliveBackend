import { processImage } from '../../../utils/sharp';
import { uploadToS3, deleteFromS3 } from '../../../utils/s3Upload';
import prisma from '../../../utils/prisma';
import dotenv from "dotenv";

dotenv.config();

class GroupService {

  async createGroupThumbnail( bootcampId:string, postId: string, thumbnailFile: Buffer, mimeType: string): Promise<any> {
    try {
      // Process the image (resize, etc.) before uploading
      // const processedImage =  await processImage(thumbnailFile);
    
      const iconKey = `group-thumbnail/${bootcampId}/${postId}/${Date.now()}`;

      // Upload the image to S3
      const iconUrl = await uploadToS3(thumbnailFile, iconKey, mimeType);

      // Create a new class with the icon URL
      const newIcon = await prisma.bootcampMediaUpload.update({
        where: {id:postId, bootcampId },
        data: { thumbnailUrl: iconUrl  },
       
      });

      return newIcon;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create thumbnailUrl: ${error.message}`);
      } else {
        throw new Error('Failed to create thumbnailUrl: An unexpected error occurred');
      }
    }
  }
}

export default new GroupService();
