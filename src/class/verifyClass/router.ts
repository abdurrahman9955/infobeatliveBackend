// src/routes/classPricingRoutes.ts
import { Router } from "express";
import ClassVerifyController from "./verify";

const classVerifyRouter = Router();

classVerifyRouter.post("/create/:userId/:classId", ClassVerifyController.create);
classVerifyRouter.put("/update", ClassVerifyController.update);
classVerifyRouter.get("/get-all", ClassVerifyController.getAll);
classVerifyRouter.get("/get-all/:classId", ClassVerifyController.getAllVerifyByClassId);
classVerifyRouter.get("/get/:id", ClassVerifyController.getById);
classVerifyRouter.delete("/delete/:id", ClassVerifyController.delete);

export default classVerifyRouter;
