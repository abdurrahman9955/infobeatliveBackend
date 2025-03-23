// src/controllers/classContactController.ts
import { Request, Response, NextFunction } from 'express';
import { ClassContactService } from './createContact';

const contactService = new ClassContactService();

export class ClassContactController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
     
      const contacts = await contactService.getAllContacts();
      res.status(200).json(contacts);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {

      const { id } = req.params
    
      const contact = await contactService.getContactById(id);
      if (!contact) return res.status(404).json({ message: 'Contact not found' });
      res.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {

      const contactData = req.body; // Ensure req.body contains name, email, reason, and statement
  
      const newContact = await contactService.createContact(contactData);
      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {

      const id = req.params.id

      const updatedContact = await contactService.updateContact(id, req.body);
      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {

      const id = req.params.id

      await contactService.deleteContact(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}


export default new ClassContactController();