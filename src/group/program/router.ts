
  // src/routes/programRoutes.ts
  import { Router } from "express";
  import { createProgram, getPrograms, getProgramById, updateProgram, deleteProgram } from "./create";
  
  const groupProgramRouter = Router();

  groupProgramRouter.post("/create/:groupId/:userId", createProgram);
  groupProgramRouter.get("/get/:groupId", getPrograms);
  groupProgramRouter.get("/getById/:groupId/:id", getProgramById);
  groupProgramRouter.put("/update/:groupId/:id", updateProgram);
  groupProgramRouter.delete("/delete/:groupId/:id", deleteProgram);

  export default groupProgramRouter;