// src/services/group.service.ts
import prisma from './prisma';
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
        level:'INTERMEDIATE',
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
      where: {level:'INTERMEDIATE', id },
      include: {
        creator: true,
        instructors: true,
        students: true,
        // classMediaUploads: true,
        // chats: true,
        // lectures: true,
      },
    });
  }

  async getClassByUserId(userId: string) {
    return prisma.bootcampClass.findMany({
      where: {level:'INTERMEDIATE', createdBy: userId },
      include: {
        creator: true,
        instructors: true,
        students: true,
        // classMediaUploads: true,
        // chats: true,
        // lectures: true,
      },
    });
  }

  async updateClass(id: string, data: Prisma.GroupUpdateInput) {
    const classes = await prisma.bootcampClass.findUnique({ where: { id } });

    const {
      name,
      purpose,
      rules,
      description,
      isBlocked,
    } = data;

    return prisma.bootcampClass.update({
      where: {level:'INTERMEDIATE', id },
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
    const classId = await prisma.bootcampClass.findUnique({ where: {level:'INTERMEDIATE', id } });
    if (classId?.createdBy !== userId) {
      throw new Error('Not authorized to delete this group');
    }

    return prisma.bootcampClass.delete({
      where: {level:'INTERMEDIATE', id },
    });
  }

  async getClassesByBootCampId(bootcampId:string,) {
    return prisma.bootcampClass.findMany({
      where: { bootcampId, level:'INTERMEDIATE'},
      include: {
        creator: true,
        instructors: true,
        students: true,
        // classMediaUploads: true,
        // chats: true,
        // lectures: true,
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
    });
  }
}

export default new ClassService();
