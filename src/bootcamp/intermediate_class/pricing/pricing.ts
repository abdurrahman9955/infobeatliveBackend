// src/controllers/classPricingController.ts
import { Request, Response } from "express";
import ClassPricingService from "./createPricing";

export default class ClassPricingController {
  static async create(req: Request, res: Response) {
    try {
      const {title, benefit1, benefit2, benefit3, benefit4, benefit5, type, amount, description } = req.body;
      const {bootcampId, classId, userId,  } = req.params;

      const classPricing = await ClassPricingService.createClassPricing(
        {bootcampId, 
         classId, 
         userId, 
         title, 
         benefit1, 
         benefit2, 
         benefit3, 
         benefit4, 
         benefit5, 
         type, 
         amount, 
         description }
      );

      res.status(201).json(classPricing);
    } catch (error) {
      res.status(400).json({ error: "Failed to create class pricing" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
        
      const {bootcampId, classId } = req.params;

      const classPricings = await ClassPricingService.getAllClassPricings( bootcampId, classId);
      res.json(classPricings);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve class pricings" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const {bootcampId, classId, id } = req.params;
      const classPricing = await ClassPricingService.getClassPricingById(bootcampId, classId, id);
      if (!classPricing) return res.status(404).json({ error: "Not found" });

      res.json(classPricing);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve class pricing" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {

      const {bootcampId, classId, id } = req.params;
     
      await ClassPricingService.deleteClassPricing(bootcampId, classId, id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete class pricing" });
    }
  }
}
