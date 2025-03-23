import { Request, Response } from 'express';
import RePostService from './createRepost';

class RePostController {
  // Add an Instructor to a group
  async createRePost(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params; // Get userId from URL parameters
      const { postId } = req.params; // Get classId from URL parameters

      // Ensure you have proper authorization here if needed
      const post = await RePostService.createRePost(userId, postId);
      res.status(201).json(post);
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ message: 'Failed to  rePost', error: typedError.message });
    }
  }

  // Remove an Instructor from a group
  async deleteRePost(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params; // Get userId from URL parameters
      const { postId } = req.params; // Get classId from URL parameters

      // Ensure you have proper authorization here if needed
      await RePostService.deleteRePost(userId, postId);
      res.status(204).end();
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ message: 'Failed to delete  rePost', error: typedError.message });
    }
  }

   // Get all Instructor of a group
   async getRePost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params; // Get classId from URL parameters
      const post = await RePostService.getRePost(postId);
      res.status(200).json(post);
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ message: 'Failed to get rePost', error: typedError.message });
    }
  }

  // Get all Instructor of a group
  async getRePostByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params; // Get classId from URL parameters
      const post = await RePostService.getRePostByUserId(userId);
      res.status(200).json(post);
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ message: 'Failed to get rePost', error: typedError.message });
    }
  }

}

export default new RePostController();
