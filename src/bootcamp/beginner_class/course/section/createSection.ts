import { Request, Response } from "express";
import prisma from "../../../../utils/prisma";
import { processImage } from "../../../../utils/sharp";
import { uploadToS3, deleteFromS3 } from "../../../../utils/s3Upload";
import { v4 as uuidv4 } from 'uuid';


// Create a new section
export const createSection = async (req: Request, res: Response) => {
  const { title, description, category} = req.body;
  const { courseId, instructorId } = req.params
  const thumbnail = req.file;

  if (!title || !description || !category  || !courseId || !thumbnail) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {

    const uniqueFilename = uuidv4();
  
    let thumbnailUrl: string | undefined = undefined;

    if (thumbnail) {
      // const processedImage = await processImage(thumbnail.buffer);
      const key = `images/${courseId}/image/${uniqueFilename}/${Date.now()}-${thumbnail.originalname}`;
      thumbnailUrl = await uploadToS3(thumbnail.buffer, key, thumbnail.mimetype);
    } else {
      return res.status(400).json({ message: 'Invalid or missing file' });
    }

    // Save section to the database
    const section = await prisma.bootcampCourseSection.create({
      data: {
        title,
        instructorId,
        description,
        category,
        courseId,
        thumbnailUrl:thumbnailUrl,
        level:'BEGINNER'
      },
    });

    res.status(201).json(section);
  } catch (error) {
    console.error("Error creating section:", error);
    res.status(500).json({ error: "Failed to create section" });
  }
};

// Get all sections
export const getAllSections = async (req: Request, res: Response) => {
  try {

    const { courseId } = req.params

    const courses = await prisma.bootcampCourseSection.findMany({
      where: {  courseId,level:'BEGINNER',  },
      include: {
        instructor: {
          include: {
            profile: true, 
          },
        },
        media: true,
        course: true
      },
      
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching section:", error);
    res.status(500).json({ error: "Failed to fetch section" });
  }
};

// Get a single section by ID
export const getSectionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { courseId } = req.params

  try {
    const course = await prisma.bootcampCourseSection.findUnique({
      where: { id,  courseId,level:'BEGINNER',},
      include: {
        instructor: {
          include: {
            profile: true, 
          },
        },
        media: true,
        course: true
      },
     
    });

    if (!course) {
      return res.status(404).json({ error: "Section not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching section:", error);
    res.status(500).json({ error: "Failed to fetch section" });
  }
};

export const updateSection = async (req: Request, res: Response) => {
  const { id, courseId } = req.params;
  const { title, description, category } = req.body;
  const thumbnail = req.file;

  try {

    console.log(" Updating section with id in the backend:", id, "and courseId:", courseId);

    
    // Check if section exists before updating
    const existingSection = await prisma.bootcampCourseSection.findUnique({
      where: { id, level:'BEGINNER', },
    });

    if (!existingSection) {
      return res.status(404).json({ error: "Section not found" });
    }

    let updateData: any = {}; // Store only provided fields

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;

    if (thumbnail) {
      const uniqueFilename = uuidv4();
     // const processedImage = await processImage(thumbnail.buffer);
      const key = `images/${courseId}/image/${uniqueFilename}/${Date.now()}-${thumbnail.originalname}`;
      updateData.thumbnailUrl = await uploadToS3(thumbnail.buffer, key, thumbnail.mimetype);
    }

    console.log("Updating section with id:", id, "and courseId:", courseId);

    const updatedCourse = await prisma.bootcampCourseSection.update({
      where: {
        id, level:'BEGINNER',
        courseId // Ensure courseId is correct
      },
      data: updateData,
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({ error: "Failed to update section" });
  }
};

// Delete a section
export const deleteSection = async (req: Request, res: Response) => {
  const { id, courseId } = req.params;

  try {
    console.log(" Updating section with id in the backend:", id, "and courseId:", courseId);
     // Find the post to retrieve the S3 object keys
     const section = await prisma.bootcampCourseSection.findUnique({ where: { id, level:'BEGINNER', } });

     if (!section) {
       return res.status(404).json({ message: 'Post not found' });
     }

     // Delete the associated thumbnail file from S3 if it exists
     if (section.thumbnailUrl) {
      const thumbnailKey = section.thumbnailUrl.split('.com/')[1]; // Extract the key from the S3 URL
      await deleteFromS3(thumbnailKey);
    }

    await prisma.bootcampCourseSection.delete({ where: { id, courseId, level:'BEGINNER', } });

    res.status(200).json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({ error: "Failed to delete section" });
  }
};
