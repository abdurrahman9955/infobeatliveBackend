import { Request, Response } from 'express';
import ClassService from './createClass';

class ClassController {
 
  async createClass(req: Request, res: Response): Promise<void> {
    try {
      const { name, purpose, rules, description, icon } = req.body;
      const userId = req.params.userId;
  
      // Validate required fields
      if (!name || !purpose || !rules || !description) {
        res.status(400).json({ message: 'Missing required fields: name, purpose, rules, description' });
        return;
      }
  
      // Pass the entire data object and userId
      const group = await ClassService.createClass(
        {
          name,
          purpose,
          rules,
          description,
          icon,
          creator: {
            connect: { id: userId },
          },
        },
        userId
      );
  
      res.status(201).json(group);
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ message: 'Failed to create group', error: typedError.message });
    }
  }

  async getClassById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const group = await ClassService.getClassById(id);

      if (!group) {
        res.status(404).json({ message: 'Group not found' });
        return;
      }

      res.status(200).json(group);
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ message: 'Failed to fetch group', error: typedError.message });
    }
  }

  async getClassByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const groups = await ClassService.getClassByUserId(userId);

      if (!groups || groups.length === 0) {
        res.status(404).json({ message: 'No groups found for this user' });
        return;
      }

      res.status(200).json(groups);
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ message: 'Failed to fetch groups', error: typedError.message });
    }
  }

  async updateClass(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, purpose, rules, description, isBlocked } = req.body;

      const group = await ClassService.updateClass(
        id, { name, purpose, rules, description, isBlocked},);

      res.status(200).json(group);
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ message: 'Failed to update group', error: typedError.message });
    }
  }

  async deleteClass(req: Request, res: Response): Promise<void> {
    try {
      const { id, userId } = req.params;

      await ClassService.deleteClass(id, userId);
      res.status(204).end();
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ message: 'Failed to delete group', error: typedError.message });
    }
  }

  async getAllClasses(req: Request, res: Response): Promise<void> {
    try {

      const searchQuery = req.query.searchQuery as string | undefined;
     
      const groups = await ClassService.getAllClasses(searchQuery);
      res.status(200).json(groups);
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ message: 'Failed to fetch groups', error: typedError.message });
    }
  }
}

export default new ClassController();
