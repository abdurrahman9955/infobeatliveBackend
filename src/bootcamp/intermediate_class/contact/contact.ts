// src/controllers/classContactController.ts
import { Request, Response, NextFunction } from 'express';
import { ClassContactService } from './createContact';

const contactService = new ClassContactService();

export class ClassContactController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {

      const classId = req.params.classId
      
      const contacts = await contactService.getAllContacts(classId);
      res.status(200).json(contacts);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {

      const { id, classId } = req.params
    
      const contact = await contactService.getContactById(id, classId);
      if (!contact) return res.status(404).json({ message: 'Contact not found' });
      res.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, classId } = req.params;
      const contactData = req.body; // Ensure req.body contains name, email, reason, and statement
  
      const newContact = await contactService.createContact(contactData, classId, userId);
      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {

      const id = req.params.id
      const { classId } = req.params

      const updatedContact = await contactService.updateContact(id, classId as any, req.body);
      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {

      const id = req.params.id
      const { classId } = req.params

      await contactService.deleteContact(id, classId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}


export default new ClassContactController();