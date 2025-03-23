
  // src/routes/programRoutes.ts
  import { Router } from "express";
  import { createProgram, getPrograms, getProgramById, updateProgram, deleteProgram } from "./create";
  
  const bootcampAdvanceLectureRouter = Router();

  bootcampAdvanceLectureRouter.post("/create/:classId/:userId", createProgram);
  bootcampAdvanceLectureRouter.get("/get/:classId", getPrograms);
  bootcampAdvanceLectureRouter.get("/getById/:classId/:id", getProgramById);
  bootcampAdvanceLectureRouter.put("/update/:classId/:id", updateProgram);
  bootcampAdvanceLectureRouter.delete("/delete/:classId/:id", deleteProgram);
 
  export default bootcampAdvanceLectureRouter;