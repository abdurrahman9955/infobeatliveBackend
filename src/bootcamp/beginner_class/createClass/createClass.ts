// src/services/group.service.ts
import prisma from '../../../utils/prisma';
import { Prisma } from '@prisma/client';

class ClassService {
 
  async createClass(data: Prisma.ClassCreateInput, bootcampId:string, userId: string) {
    const {
      name,
      purpose,
      rules,
      description,
      icon,
    } = data;

    return prisma.bootcampClass.create({
      data: {
        name,
        purpose,
        rules,
        description,
        icon,
        level:'BEGINNER',
        bootcamp: {
          connect: { id: bootcampId },
        },
        creator: {
          connect: { id: userId },
        },
      },
    });
  }

  async getClassById(id: string) {
    return prisma.bootcampClass.findUnique({
      where: { id, level:'BEGINNER', },
      include: {
        creator: true,
        instructors: true,
        students: {
          where: {
            isSuspended: false, 
          },
        },
      },
    });
  }

  async getClassByUserId(userId: string) {
    return prisma.bootcampClass.findMany({
      where: { createdBy: userId, level:'BEGINNER', },
      include: {
        creator: true,
        instructors: true,
        students: {
          where: {
            isSuspended: false, 
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateClass(id: string, data: Prisma.GroupUpdateInput) {
    const classes = await prisma.bootcampClass.findUnique({ where: { id, level:'BEGINNER',} });

    const {
      name,
      purpose,
      rules,
      description,
      isBlocked,
    } = data;

    return prisma.bootcampClass.update({
      where: { id, level:'BEGINNER', },
      data: {
        name,
        purpose,
        rules,
        description,
        isBlocked,
      },
    });
  }

  async deleteClass(id: string, userId: string) {
    const classId = await prisma.bootcampClass.findUnique({ where: { id } });
    if (classId?.createdBy !== userId) {
      throw new Error('Not authorized to delete this group');
    }

    return prisma.bootcampClass.delete({
      where: { id, level:'BEGINNER', },
    });
  }

  async getClassesByBootCampId(bootcampId:string,) {
    return prisma.bootcampClass.findMany({
      where: { bootcampId, level:'BEGINNER' },
      include: {
        creator: true,
        instructors: true,
        students: true,
        // classMediaUploads: true,
        // chats: true,
        // lectures: true,
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });
  }

  async getAllClasses() {
    return prisma.bootcampClass.findMany({
      include: {
        creator: true,
        instructors: true,
        students: true,
        // classMediaUploads: true,
        // chats: true,
        // lectures: true,
        
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });
  }
}

export default new ClassService();
