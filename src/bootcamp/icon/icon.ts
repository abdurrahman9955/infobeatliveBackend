import { Request, Response } from 'express';
import Service from './createIcon'; 

class IconController {

  async createIcon(req: Request, res: Response) {
    try {
      const {  bootcampId } = req.params;
      const iconFile = req.file?.buffer;
      const mimeType = req.file?.mimetype;

      if (!iconFile || !mimeType) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const newClass = await Service.createIcon( bootcampId, iconFile, mimeType);
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

export default new IconController();
