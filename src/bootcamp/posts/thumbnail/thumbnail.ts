import { Request, Response } from 'express';
import GroupService from './create'; 

class BootcampThumbnailController {

  async createGroupThumbnail(req: Request, res: Response) {
    try {
      const { bootcampId, postId } = req.params;
      const thumbnailFile = req.file?.buffer;
      const mimeType = req.file?.mimetype;

      if (!thumbnailFile || !mimeType) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
     
      const newClass = await GroupService.createGroupThumbnail( bootcampId, postId, thumbnailFile, mimeType);
      return res.status(201).json(newClass);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }
}

export default new BootcampThumbnailController();
