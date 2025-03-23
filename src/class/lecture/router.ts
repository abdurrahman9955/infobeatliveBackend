
  // src/routes/programRoutes.ts
  import { Router } from "express";
  import { createProgram, getPrograms, getProgramById, updateProgram, deleteProgram } from "./create";
  
  const classLectureRouter = Router();

  classLectureRouter.post("/create/:classId/:userId", createProgram);
  classLectureRouter.get("/get/:classId", getPrograms);
  classLectureRouter.get("/getById/:classId/:id", getProgramById);
  classLectureRouter.put("/update/:classId/:id", updateProgram);
  classLectureRouter.delete("/delete/:classId/:id", deleteProgram);
  
  export default classLectureRouter;