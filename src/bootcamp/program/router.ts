
  // src/routes/programRoutes.ts
  import { Router } from "express";
  import { createProgram, getPrograms, getProgramById, updateProgram, deleteProgram } from "./create";
  
  const bootcampProgramRouter = Router();

  bootcampProgramRouter.post("/create/:bootcampId/:userId", createProgram);
  bootcampProgramRouter.get("/get/:bootcampId", getPrograms);
  bootcampProgramRouter.get("/getById/:bootcampId/:id", getProgramById);
  bootcampProgramRouter.put("/update/:bootcampId/:id", updateProgram);
  bootcampProgramRouter.delete("/delete/:bootcampId/:id", deleteProgram);
  
  export default bootcampProgramRouter;