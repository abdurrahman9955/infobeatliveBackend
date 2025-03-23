// src/routes/classPricingRoutes.ts
import { Router } from "express";
import ClassPricingController from "./pricing";

const bootCampBeginnerClassPricingRouter = Router();

bootCampBeginnerClassPricingRouter.post("/create/:bootcampId/:classId/:userId", ClassPricingController.create);
bootCampBeginnerClassPricingRouter.get("/get-all/:bootcampId/:classId", ClassPricingController.getAll);
bootCampBeginnerClassPricingRouter.get("/get/:bootcampId/:classId/:id", ClassPricingController.getById);
bootCampBeginnerClassPricingRouter.delete("/delete/:bootcampId/:classId/:id", ClassPricingController.delete);

export default bootCampBeginnerClassPricingRouter;
