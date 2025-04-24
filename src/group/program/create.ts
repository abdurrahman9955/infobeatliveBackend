 import prisma from "../../utils/prisma";
 import { Request, Response } from "express";
  
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
      const groupId = req.params.groupId as string;

      const program = await prisma.program.create({
        data: {
          groupId,
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
      res.status(500).json({ error: "Failed to create program" });
    }
  };
 
  export const getPrograms = async (req: Request, res: Response) => {
    try {

     const groupId = req.params.groupId as string;

      const programs = await prisma.program.findMany({
        where: { groupId },
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
      const groupId = req.params.groupId as string;

      const program = await prisma.program.findUnique({
        where: { groupId, id},
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
        const groupId = req.params.groupId as string;

      const program = await prisma.program.update({
        where: { groupId, id },
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
     const groupId = req.params.groupId as string;

      await prisma.program.delete({ where: { groupId, id } });
      res.json({ message: "Program deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete program" });
    }
  };
  
  
 