// src/controllers/classPricingController.ts
import { Request, Response } from "express";
import ClassPricingService from "./createPricing";
import { DatabaseSync } from "node:sqlite";

export default class ClassPricingController {
  static async create(req: Request, res: Response) {
    try {
      const { country,
        currency,
        city,
        email,
        fullName,
        bankName,
        bankAccountNumber,
        bankAddress,
        swiftOrBic,
        iBan,
        routingNumber,
        phoneNumber,
        description,
        accountType,
        postalCode,
        type, } = req.body;

      const { userId, bootcampId, } = req.params;

      const classPricing = await ClassPricingService.createClassPayout({
        userId,
        bootcampId,
        country,
        currency,
        city,
        email,
        fullName,
        bankName,
        bankAccountNumber,
        bankAddress,
        swiftOrBic,
        iBan,
        routingNumber,
        phoneNumber,
        description,
        accountType,
        postalCode,
        type,
      });

      res.status(201).json(classPricing);
    } catch (error) {
      console.error("Error creating Payout:", error); // ✅ Log full error
      res.status(400).json({ error: "Failed to create class pricing" });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
        
      const { bootcampId } = req.params;

      const classPricings = await ClassPricingService.getAllClassPayouts(bootcampId);
      res.json(classPricings);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve class pricings" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const classPricing = await ClassPricingService.getClassPayoutById(id);
      if (!classPricing) return res.status(404).json({ error: "Not found" });

      res.json(classPricing);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve class pricing" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ClassPricingService.deleteClassPayout(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete class pricing" });
    }
  }
}
