// src/controllers/classContactController.ts
import { Request, Response, NextFunction } from 'express';
import { ClassContactService } from './createContact';

const contactService = new ClassContactService();

export class ClassContactController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {

      const bootcampId = req.params.bootcampId
     
      const contacts = await contactService.getAllContacts(bootcampId);
      res.status(200).json(contacts);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {

      const id = req.params.id
     
      const contact = await contactService.getContactById(id);
      if (!contact) return res.status(404).json({ message: 'Contact not found' });
      res.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {

      const bootcampId = req.params.bootcampId
      const userId = req.params.userId

      const newContact = await contactService.createContact( bootcampId as any, userId, req.body);
      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {

      const { id } = req.params

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