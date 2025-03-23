// src/controllers/classPricingController.ts
import { Request, Response } from "express";
import ClassPricingService from "./createPricing";

export default class ClassPricingController {
  static async create(req: Request, res: Response) {
    try {
      const {title, benefit1, benefit2, benefit3, benefit4, benefit5, type, amount, description } = req.body;
      const { userId, classId, } = req.params;
 
      const classPricing = await ClassPricingService.createClassPricing({
        userId,
        classId,
        title,
        benefit1,
        benefit2,
        benefit3,
        benefit4,
        benefit5,
        type,
        amount,
        description,
      });

      res.status(201).json(classPricing);
    } catch (error) {
      res.status(400).json({ error: "Failed to create class pricing" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
        
      const { classId } = req.params;

      const classPricings = await ClassPricingService.getAllClassPricings(classId);
      res.json(classPricings);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve class pricings" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const classPricing = await ClassPricingService.getClassPricingById(id);
      if (!classPricing) return res.status(404).json({ error: "Not found" });

      res.json(classPricing);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve class pricing" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id, classId } = req.params;
      const { title, benefit1, benefit2, benefit3, benefit4, benefit5, type, amount, description } = req.body;

      const updatedPricing = await ClassPricingService.updateClassPricing(id, classId, {
        title,
        benefit1,
        benefit2,
        benefit3,
        benefit4,
        benefit5,
        type,
        amount,
        description,
      });

      res.json(updatedPricing);
    } catch (error) {
      res.status(400).json({ error: "Failed to update class pricing" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ClassPricingService.deleteClassPricing(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete class pricing" });
    }
  }
}
