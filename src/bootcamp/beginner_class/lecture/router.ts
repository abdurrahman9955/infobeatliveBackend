
  // src/routes/programRoutes.ts
  import { Router } from "express";
  import { createProgram, getPrograms, getProgramById, updateProgram, deleteProgram } from "./create";
  
  const bootcampBeginnerLectureRouter = Router();

  bootcampBeginnerLectureRouter.post("/create/:classId/:userId", createProgram);
  bootcampBeginnerLectureRouter.get("/get/:classId", getPrograms);
  bootcampBeginnerLectureRouter.get("/getById/:classId/:id", getProgramById);
  bootcampBeginnerLectureRouter.put("/update/:classId/:id", updateProgram);
  bootcampBeginnerLectureRouter.delete("/delete/:classId/:id", deleteProgram);
 
  export default bootcampBeginnerLectureRouter;