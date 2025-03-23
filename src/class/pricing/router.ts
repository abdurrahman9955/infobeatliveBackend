// src/routes/classPricingRoutes.ts
import { Router } from "express";
import ClassPricingController from "./pricing";

const classPricingRouter = Router();

classPricingRouter.post("/create/:classId/:userId", ClassPricingController.create);
classPricingRouter.get("/get-all/:classId", ClassPricingController.getAll);
classPricingRouter.get("/get/:id", ClassPricingController.getById);
classPricingRouter.put("/update/:classId/:id", ClassPricingController.update);
classPricingRouter.delete("/delete/:id", ClassPricingController.delete);

export default classPricingRouter;
