// src/routes/classPricingRoutes.ts
import { Router } from "express";
import ClassPricingController from "./pricing";

const bootCampAdvanceClassPricingRouter = Router();

bootCampAdvanceClassPricingRouter.post("/create/:bootcampId/:classId/:userId", ClassPricingController.create);
bootCampAdvanceClassPricingRouter.get("/get-all/:bootcampId/:classId", ClassPricingController.getAll);
bootCampAdvanceClassPricingRouter.get("/get/:bootcampId/:classId/:id", ClassPricingController.getById);
bootCampAdvanceClassPricingRouter.delete("/delete/:bootcampId/:classId/:id", ClassPricingController.delete);

export default bootCampAdvanceClassPricingRouter;
