import { processImage } from '../../utils/sharp';
import { uploadToS3, deleteFromS3 } from '../../utils/s3Upload';
import prisma from '../../utils/prisma';
import dotenv from "dotenv";

dotenv.config();

class ClassService {

  async createClassIcon(  classId: string,  iconFile: Buffer, mimeType: string): Promise<any> {
    try {
      // Process the image (resize, etc.) before uploading
      //const processedImage =  await processImage(iconFile);
   
      const iconKey = `class-icons/${Date.now()}`;

      // Upload the image to S3
      const iconUrl = await uploadToS3(iconFile, iconKey, mimeType);

      // Create a new class with the icon URL
      const newIcon = await prisma.class.update({
        where: { id: classId},
        data: { icon: iconUrl  },
       
      });

      return newIcon;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create class: ${error.message}`);
      } else {
        throw new Error('Failed to create class: An unexpected error occurred');
      }
    }
  }
}

export default new ClassService();
