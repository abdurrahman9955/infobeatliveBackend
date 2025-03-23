import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { processImage } from "../../../../utils/sharp";
import { uploadToS3, deleteFromS3 } from "../../../../utils/s3Upload";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Create a new course
export const createCourse = async (req: Request, res: Response) => {
  const { title, description, category} = req.body;
  const { classId, instructorId } = req.params
  const thumbnail = req.file;

  if (!title || !description || !category || !instructorId || !classId ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {

    const uniqueFilename = uuidv4();

    let thumbnailUrl: string | undefined = undefined;

    if (thumbnail) {
      const processedImage = await processImage(thumbnail.buffer);
      const key = `images/${classId}/image/${uniqueFilename}/${Date.now()}-${thumbnail.originalname}`;
      thumbnailUrl = await uploadToS3(processedImage, key, 'image/jpeg');
    } else {
      return res.status(400).json({ message: 'Invalid or missing file' });
    }

    // Save course to the database
    const course = await prisma.bootcampCourse.create({
      data: {
        title,
        description,
        category,
        instructorId,
        classId,
        thumbnailUrl: thumbnailUrl,
        level:'ADVANCED'
      },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

// Get all courses
export const getAllCourses = async (req: Request, res: Response) => {
  try {

    const {  classId } = req.params

    const courses = await prisma.bootcampCourse.findMany({
      where: { classId,level:'ADVANCED',},
      include: {
        instructor: {
          include: {
            profile: true, 
          },
        },
        sections: true,
      },
    
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// Get a single course by ID
export const getCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { classId } = req.params

  try {
    const course = await prisma.bootcampCourse.findUnique({
      where: { id, classId, level:'ADVANCED', },
       include: {
        instructor: {
          include: {
            profile: true, 
          },
        },
        sections: true,
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  const { id, classId } = req.params;
  const { title, description, category } = req.body;
  const thumbnail = req.file;

  try {
    let updateData: any = {}; // Create an empty object to store only fields that need updating

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;

    if (thumbnail) {
      const uniqueFilename = uuidv4();
      const processedImage = await processImage(thumbnail.buffer);
      const key = `images/${classId}/image/${uniqueFilename}/${Date.now()}-${thumbnail.originalname}`;
      updateData.thumbnailUrl = await uploadToS3(processedImage, key, 'image/jpeg');
    }

    const updatedCourse = await prisma.bootcampCourse.update({
      where: { id, level:'ADVANCED', classId },
      data: updateData, // Only update fields that are provided
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};


// Delete a course
export const deleteCourse = async (req: Request, res: Response) => {
  const { id, classId } = req.params;

  try {

     // Find the post to retrieve the S3 object keys
     const course = await prisma.bootcampCourse.findUnique({ where: {level:'ADVANCED', id } });

     if (!course) {
       return res.status(404).json({ message: 'Post not found' });
     }

     // Delete the associated thumbnail file from S3 if it exists
     if (course.thumbnailUrl) {
      const thumbnailKey = course.thumbnailUrl.split('.com/')[1]; // Extract the key from the S3 URL
      await deleteFromS3(thumbnailKey);
    }

    await prisma.bootcampCourse.delete({ where: { id, level:'ADVANCED', classId } });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};
