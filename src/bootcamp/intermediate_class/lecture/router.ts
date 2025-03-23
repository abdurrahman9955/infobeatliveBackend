
  // src/routes/programRoutes.ts
  import { Router } from "express";
  import { createProgram, getPrograms, getProgramById, updateProgram, deleteProgram } from "./create";
  
  const bootcampIntermediateLectureRouter = Router();

  bootcampIntermediateLectureRouter.post("/create/:classId/:userId", createProgram);
  bootcampIntermediateLectureRouter.get("/get/:classId", getPrograms);
  bootcampIntermediateLectureRouter.get("/getById/:classId/:id", getProgramById);
  bootcampIntermediateLectureRouter.put("/update/:classId/:id", updateProgram);
  bootcampIntermediateLectureRouter.delete("/delete/:classId/:id", deleteProgram);
  
  export default bootcampIntermediateLectureRouter;