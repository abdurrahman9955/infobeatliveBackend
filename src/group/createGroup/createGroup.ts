// src/services/group.service.ts
import prisma from '../../utils/prisma';
import { Prisma } from '@prisma/client';

class GroupService {
  
  async createGroup(data: Prisma.GroupCreateInput, userId: string) {
    const {
      name,
      purpose,
      rules,
      description,
      icon,
    } = data;

    return prisma.group.create({
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

  async getGroupByIdInTheGroup(id: string) {
    return prisma.group.findUnique({
      where: { id },
      include: {
        creator: true,
        admins: true,
        members: true,
      },
    });
  }

  async getGroupById(id: string) {
    return prisma.group.findUnique({
      where: { id },
      include: {
        creator: true,
        admins: true,
        members: {
          where: {
            isMember: true, 
          },
        },
      },
    });
  }

  async getGroupByUserId(userId: string) {
    return prisma.group.findMany({
      where: { createdBy: userId },
      include: {
        creator: true,
        admins: true,
        members: {
          where: {
            isMember: true, 
          },
        },
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });
  }

  async updateGroup(id: string, data: Prisma.GroupUpdateInput) {
    const group = await prisma.group.findUnique({ where: { id } });

    const {
      name,
      purpose,
      rules,
      description,
      isBlocked,
      isSuspend
    } = data;

    return prisma.group.update({
      where: { id },
      data: {
        name,
        purpose,
        rules,
        description,
        isBlocked,
        isSuspend
      },
    });
  }

  async deleteGroup(id: string, userId: string) {
    const group = await prisma.group.findUnique({ where: { id } });
    if (group?.createdBy !== userId) {
      throw new Error('Not authorized to delete this group');
    }

    return prisma.group.delete({
      where: { id },
    });
  }

  async getAllGroups(searchQuery?: string, cursor?:string, limit?:number) {

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

    return prisma.group.findMany({
      where: whereGroups, 
      take: Number(limit), // How many posts to return
      ...(cursor && {
        skip: 1, // Skip the post with the cursor ID itself
        cursor: {
          id: String(cursor), // Start after this ID
        },
      }),
      include: {
        creator: true,
        admins: true,
        members: true,
      },
      orderBy: {
        createdAt: 'desc', 
      },
    });
  }
}

export default new GroupService();
