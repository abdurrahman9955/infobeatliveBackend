import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new Bootcamp
export const createBootcamp = async (req: Request, res: Response): Promise<void> => {
  try {

    const {  userId } = req.params;

    const { name, purpose, country, language, rules, description, icon } = req.body;
    const bootcamp = await prisma.bootcamp.create({
      data: {
        name,
        purpose,
        country,
        language,
        rules,
        description,
        icon,
        creatorId: userId
      },
    });
    res.status(201).json(bootcamp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bootcamp' });
  }
};

// Get all Bootcamps
export const getAllBootcamps = async (req: Request, res: Response): Promise<void> => {
  try {

    const searchQuery = req.query.searchQuery as string | undefined;
    
    let whereGroups = {};

    if (searchQuery) {
      whereGroups = {
        OR: [
          { id: { contains: searchQuery, mode: 'insensitive' } },
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { purpose: { contains: searchQuery, mode: 'insensitive' } },
          { rules: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
        ],
      };
    }

    const bootcamps = await prisma.bootcamp.findMany({
      where: whereGroups,
      include: {
        creator: true,
        classes:true,
      },
    });
    res.status(200).json(bootcamps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bootcamps' });
  }
};

// Get a single Bootcamp by ID
export const getBootcampById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const bootcamp = await prisma.bootcamp.findUnique({
      where: { id  },
      include: {
        creator: true,
        classes:true,
      },
    });
    if (!bootcamp) {
      res.status(404).json({ error: 'Bootcamp not found' });
      return;
    }
    res.status(200).json(bootcamp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bootcamp' });
  }
};

// Get all members (students & instructors) of a Bootcamp in a single response
export const getBootCampMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Fetch the bootcamp with all its classes, students, and instructors
    const bootcamp = await prisma.bootcamp.findUnique({
      where: { id },
      include: {
        creator: true,
        classes: {
          include: {
            students: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
            instructors: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!bootcamp) {
      res.status(404).json({ error: 'Bootcamp not found' });
      return;
    }

    // Flatten and extract all unique instructors and students across all classes
    const instructorsMap = new Map();
    const studentsMap = new Map();

    bootcamp.classes.forEach((bootcampClass) => {
      bootcampClass.instructors.forEach((instructor) => {
        instructorsMap.set(instructor.userId, instructor.user);
      });

      bootcampClass.students.forEach((student) => {
        studentsMap.set(student.userId, student.user);
      });
    });

    // Convert maps to arrays
    const instructors = Array.from(instructorsMap.values());
    const students = Array.from(studentsMap.values());

    res.status(200).json({
      bootcampId: bootcamp.id,
      name: bootcamp.name,
      instructors,
      students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bootcamp members' });
  }
};


// Get a single Bootcamp by ID
export const getBootcampByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const {  userId } = req.params;
    const bootcamp = await prisma.bootcamp.findMany({
      where: { creatorId: userId  },
      include: {
        creator: true,
        classes:true,
      },
    });
    if (!bootcamp) {
      res.status(404).json({ error: 'Bootcamp not found' });
      return;
    }
    res.status(200).json(bootcamp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bootcamp' });
  }
};

// Update a Bootcamp
export const updateBootcamp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, userId} = req.params;
    const { name, purpose, country, language, rules, description, icon } = req.body;
    const bootcamp = await prisma.bootcamp.update({
      where: { id },
      data: {
        name,
        purpose,
        country,
        language,
        rules,
        description,
        icon,
        creatorId: userId
      },
    });
    res.status(200).json(bootcamp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bootcamp' });
  }
};

// Delete a Bootcamp
export const deleteBootcamp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, userId } = req.params;
    await prisma.bootcamp.delete({
      where: { id, creatorId: userId },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bootcamp' });
  }
};

// Get all members (students & instructors) of all Bootcamps in a single response
export const getAllBootCampMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all bootcamps with their classes, students, and instructors
    const bootcamps = await prisma.bootcamp.findMany({
      include: {
        creator: true,
        classes: {
          include: {
            students: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
            instructors: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!bootcamps.length) {
      res.status(404).json({ error: 'No bootcamps found' });
      return;
    }

    // Process all bootcamps
    const bootcampMembers = bootcamps.map((bootcamp) => {
      const instructors: any[] = [];
      const students: any[] = [];

      bootcamp.classes.forEach((bootcampClass) => {
        bootcampClass.instructors.forEach((instructor) => {
          instructors.push(instructor.user);
        });

        bootcampClass.students.forEach((student) => {
          students.push(student.user);
        });
      });

      return {
        bootcampId: bootcamp.id,
        name: bootcamp.name,
        instructors,
        students,
      };
    });

    res.status(200).json(bootcampMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bootcamp members' });
  }
};
