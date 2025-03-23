// src/routes/classPricingRoutes.ts
import { Router } from "express";
import ClassPricingController from "./pricing";

const bootCampIntermediateClassPricingRouter = Router();

bootCampIntermediateClassPricingRouter.post("/create/:bootcampId/:classId/:userId", ClassPricingController.create);
bootCampIntermediateClassPricingRouter.get("/get-all/:bootcampId/:classId", ClassPricingController.getAll);
bootCampIntermediateClassPricingRouter.get("/get/:bootcampId/:classId/:id", ClassPricingController.getById);
bootCampIntermediateClassPricingRouter.delete("/delete/:bootcampId/:classId/:id", ClassPricingController.delete);

export default bootCampIntermediateClassPricingRouter;
