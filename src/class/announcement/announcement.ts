// src/controllers/classContactController.ts
import { Request, Response, NextFunction } from 'express';
import { AnnouncementService } from './createAnnounce';

const announcementService = new AnnouncementService();

export class ClassAnnouncementController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {

      const classId = req.params.classId
      
      const announcements = await announcementService.getAllAnnouncements(classId);
      res.status(200).json(announcements);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {

      const id = req.params.id
      const userId = req.params.userId
      
      const announcement = await announcementService.getAnnouncementById(id, userId);
      if (!announcement) return res.status(404).json({ message: 'Contact not found' });
      res.status(200).json(announcement);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {

      const { classId, userId }= req.params

      const newAnnouncement = await announcementService.createAnnouncement(classId as any, userId, req.body);
      res.status(201).json(newAnnouncement);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {

      const id = req.params.id
      const { classId, userId }= req.params

      const updatedAnnouncement = await announcementService.updateAnnouncement( id, classId as any, userId, req.body);
      res.status(200).json(updatedAnnouncement);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {

      const id = req.params.id
      const { classId, userId }= req.params

      await announcementService.deleteAnnouncement(id, classId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

}


export default new ClassAnnouncementController();