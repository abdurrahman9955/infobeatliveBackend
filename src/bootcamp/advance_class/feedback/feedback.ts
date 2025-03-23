// src/controllers/classFeedbackController.ts
import { Request, Response, NextFunction } from 'express';
import { ClassFeedbackService } from './createFeedback';

const feedbackService = new ClassFeedbackService();

export class ClassFeedbackController {
  
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {

      const classId = req.params.userId

      const feedbacks = await feedbackService.getAllFeedbacks(classId);
      res.status(200).json(feedbacks);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {

      const { id, classId } = req.params

      const feedback = await feedbackService.getFeedbackById( id, classId );
      if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
      res.status(200).json(feedback);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, classId } = req.params;
      const feedbackData = req.body; // Ensure req.body contains name, email, reason, and statement
  
      const newFeedback = await feedbackService.createFeedback(feedbackData, classId, userId);
      res.status(201).json(newFeedback);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {

      const id = req.params.id
      const { classId } = req.params

      const updatedFeedback = await feedbackService.updateFeedback(id, classId as any, req.body);
      res.status(200).json(updatedFeedback);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {

      const id = req.params.id
      const { classId } = req.params

      await feedbackService.deleteFeedback(id, classId );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ClassFeedbackController();