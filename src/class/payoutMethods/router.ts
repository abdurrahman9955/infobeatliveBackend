// src/routes/classPricingRoutes.ts
import { Router } from "express";
import ClassPricingController from "./pricing";

const classPayoutRouter = Router();

classPayoutRouter.post("/create/:userId/:classId", ClassPricingController.create);
classPayoutRouter.get("/get-all/:classId", ClassPricingController.getAll);
classPayoutRouter.get("/get/:id", ClassPricingController.getById);
classPayoutRouter.delete("/delete/:id", ClassPricingController.delete);

export default classPayoutRouter;
