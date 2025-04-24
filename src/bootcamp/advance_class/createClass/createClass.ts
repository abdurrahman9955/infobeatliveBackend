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
        level:'ADVANCED',
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
      where: { level:'ADVANCED', id },
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
      where: { level:'ADVANCED', createdBy: userId },
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
    const classes = await prisma.bootcampClass.findUnique({ where: {level:'ADVANCED', id } });

    const {
      name,
      purpose,
      rules,
      description,
      isBlocked,
    } = data;

    return prisma.bootcampClass.update({
      where: {level:'ADVANCED', id },
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
    const classId = await prisma.bootcampClass.findUnique({ where: { level:'ADVANCED', id } });
    if (classId?.createdBy !== userId) {
      throw new Error('Not authorized to delete this group');
    }

    return prisma.bootcampClass.delete({
      where: {level:'ADVANCED', id },
    });
  }

  async getClassesByBootCampId(bootcampId:string,) {
    return prisma.bootcampClass.findMany({
      where: { bootcampId, level:'ADVANCED' },
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
