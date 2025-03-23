 import { PrismaClient } from "@prisma/client";
 import { Request, Response } from "express";
  
  const prisma = new PrismaClient();

  export const createProgram = async (req: Request, res: Response) => {
    try {
      const {  
        title, 
        type, 
        participantLimit, 
        startDate, 
        startTime, 
        category, 
        timeZone, 
        description, 
        link 
      } = req.body;
      
      const creatorId = req.params.userId as string;
      const bootcampId = req.params.bootcampId as string;

      const program = await prisma.bootcampMeetings.create({
        data: {
          bootcampId,
          creatorId,
          title,
          type,
          participantLimit,
          startDate,
          startTime,
          category,
          timeZone,
          description,
          link,
        },
      });
      res.status(201).json(program);
    } catch (error) {
      console.error("Error creating program:", error); // ✅ Log full error
      res.status(500).json({ error: "Failed to create program" });
    }
  };
 
  export const getPrograms = async (req: Request, res: Response) => {
    try {

     const bootcampId = req.params.bootcampId as string;

      const programs = await prisma.bootcampMeetings.findMany({
        where: { bootcampId },
        include: {
          creator: {
            include: {
              profile: true,
            },
          },
        },
      });
      res.json(programs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch programs" });
    }
  };
  
  export const getProgramById = async (req: Request, res: Response) => {
    try {

      const id = req.params.id as string;
      const bootcampId = req.params.bootcampId as string;

      const program = await prisma.bootcampMeetings.findUnique({
        where: { bootcampId, id},
        include: {
          creator: {
            include: {
              profile: true,
            },
          },
        },
      });
      if (!program) return res.status(404).json({ error: "Program not found" });
      res.json(program);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch program" });
    }
  };
  
  export const updateProgram = async (req: Request, res: Response) => {
    try {

     
        const id = req.params.id as string;
        const bootcampId = req.params.bootcampId as string;

      const program = await prisma.bootcampMeetings.update({
        where: { bootcampId, id },
        data: req.body,
      });
      res.json(program);
    } catch (error) {
      res.status(500).json({ error: "Failed to update program" });
    }
  };
  
  export const deleteProgram = async (req: Request, res: Response) => {
    try {


     const id = req.params.id as string;
     const bootcampId = req.params.bootcampId as string;

      await prisma.bootcampMeetings.delete({ where: { bootcampId, id } });
      res.json({ message: "Program deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete program" });
    }
  };
  
  
 