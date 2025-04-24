// src/services/group.service.ts
import prisma from '../../utils/prisma';
import { Prisma } from '@prisma/client';

class ClassService {
  
  async createClass(data: Prisma.ClassCreateInput, userId: string) {
    const {
      name,
      purpose,
      rules,
      description,
      icon,
    } = data;

    return prisma.class.create({
      data: {
        name,
        purpose,
        rules,
        description,
        icon,
        creator: {
          connect: { id: userId },
        },
      },
    });
  }

  async getClassById(id: string) {
    return prisma.class.findUnique({
      where: { id },
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
    return prisma.class.findMany({
      where: { createdBy: userId },
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
    const classes = await prisma.class.findUnique({ where: { id } });

    const {
      name,
      purpose,
      rules,
      description,
      isBlocked,
    } = data;

    return prisma.class.update({
      where: { id },
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
    const classId = await prisma.class.findUnique({ where: { id } });
    if (classId?.createdBy !== userId) {
      throw new Error('Not authorized to delete this group');
    }

    return prisma.class.delete({
      where: { id },
    });
  }

  async getAllClasses(searchQuery?: string) {

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

    return prisma.class.findMany({
      where: whereGroups,
      include: {
        creator: true,
        instructors: true,
        students: true,
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });
  }
}

export default new ClassService();
