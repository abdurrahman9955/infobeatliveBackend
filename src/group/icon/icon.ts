import { Request, Response } from 'express';
import GroupService from './createIcon'; 

class GroupIconController {

  async createGroupIcon(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const iconFile = req.file?.buffer;
      const mimeType = req.file?.mimetype;

      if (!iconFile || !mimeType) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const newClass = await GroupService.createGroupIcon( groupId, iconFile, mimeType);
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

export default new GroupIconController();
