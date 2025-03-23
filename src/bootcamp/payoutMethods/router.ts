// src/routes/classPricingRoutes.ts
import { Router } from "express";
import ClassPricingController from "./pricing";

const bootCampPayoutRouter = Router();

bootCampPayoutRouter.post("/create/:userId/:bootcampId", ClassPricingController.create);
bootCampPayoutRouter.get("/get-all/:bootcampId", ClassPricingController.getAll);
bootCampPayoutRouter.get("/get/:id", ClassPricingController.getById);
bootCampPayoutRouter.delete("/delete/:id", ClassPricingController.delete);

export default bootCampPayoutRouter;
