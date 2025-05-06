// src/routes/classPricingRoutes.ts
import { Router } from "express";
import ClassVerifyController from "./verify";

const bootcampVerifyRouter = Router();

bootcampVerifyRouter.post("/create/:userId/:bootcampId", ClassVerifyController.create);
bootcampVerifyRouter.post("/update", ClassVerifyController.update);
bootcampVerifyRouter.get("/get-all", ClassVerifyController.getAll);
bootcampVerifyRouter.get("/get-all/:bootcampId", ClassVerifyController.getAllVerifyByClassId);
bootcampVerifyRouter.get("/get/:id", ClassVerifyController.getById);
bootcampVerifyRouter.delete("/delete/:id", ClassVerifyController.delete);

export default bootcampVerifyRouter;
