import { Request, Response } from 'express';
import GroupService from './createGroup';

class GroupController {
  
  async createGroup(req: Request, res: Response): Promise<void> {
    try {
      const { name, purpose, rules, description, icon } = req.body;
      const userId = req.params.userId;
  
      // Validate required fields
      if (!name || !purpose || !rules || !description) {
        res.status(400).json({ message: 'Missing required fields: name, purpose, rules, description' });
        return;
      }
  
      // Pass the entire data object and userId
      const group = await GroupService.createGroup(
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

  async getGroupByIdInTheGroup(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const group = await GroupService.getGroupByIdInTheGroup(id);

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

  async getGroupById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const group = await GroupService.getGroupById(id);

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

  async getGroupByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const groups = await GroupService.getGroupByUserId(userId);

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

  async updateGroup(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, purpose, rules, description, isBlocked, isSuspend } = req.body;

      const group = await GroupService.updateGroup(
        id, { name, purpose, rules, description, isBlocked, isSuspend },);

      res.status(200).json(group);
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ message: 'Failed to update group', error: typedError.message });
    }
  }

  async deleteGroup(req: Request, res: Response): Promise<void> {
    try {
      const { id, userId } = req.params;

      await GroupService.deleteGroup(id, userId);
      res.status(204).end();
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ message: 'Failed to delete group', error: typedError.message });
    }
  }

  async getAllGroups(req: Request, res: Response): Promise<void> {
    try {

      const searchQuery = req.query.searchQuery as string | undefined;
     
      const groups = await GroupService.getAllGroups(searchQuery);
      res.status(200).json(groups);
    } catch (error) {
      const typedError = error as Error;
      res.status(500).json({ message: 'Failed to fetch groups', error: typedError.message });
    }
  }


}

export default new GroupController();
