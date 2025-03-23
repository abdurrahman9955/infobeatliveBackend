import prisma from '../../utils/prisma';

class GroupAdminService {
  async addAdmin(userId: string, groupId: string) {
    try {

      const existingAdmin = await prisma.groupAdmin.findUnique({
        where: { userId_groupId: { userId, groupId } },
      });
      if (existingAdmin) {
        throw new Error('User is already an admin of this group');
      }

      const existingMember = await prisma.groupMember.findUnique({
        where: { userId_groupId: { userId, groupId } },
      });

      if (!existingMember) {
        await prisma.groupMember.create({
          data: {
            userId,
            groupId,
            isAdmin: true,
            isMember: true,
          },
        });
      }

      await prisma.groupAdmin.create({
        data: {
          userId,
          groupId,
          isAdmin: true,
        },
      });


     await prisma.group.update({
      where: {
        id: groupId, 
      },
      data: {
        adminsCount: {
          increment: 1, // Increment the current value by 1
         },
       },

      });

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to add admin: ${error.message}`);
      } else {
        throw new Error('Failed to add admin: An unknown error occurred');
      }
    }
  }

  async removeAdmin(userId: string, groupId: string) {
    try {
      const admin = await prisma.groupAdmin.findUnique({
        where: { userId_groupId: { userId, groupId } },
      });
      if (!admin) {
        throw new Error('User is not an admin of this group');
      }

      await prisma.groupAdmin.delete({
        where: { id: admin.id },
      });

     await prisma.group.update({
      where: {
        id: groupId, 
      },
      data: {
        adminsCount: {
          decrement: 1, // Increment the current value by 1
         },
       },

      });

      
      const existingMember = await prisma.groupMember.findUnique({
        where: { userId_groupId: { userId, groupId } },
      });

      if (existingMember) {
        await prisma.groupMember.update({
          where: { userId_groupId: { userId, groupId } },
          data: {
            isAdmin: false,
          },
        });
      }

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove admin: ${error.message}`);
      } else {
        throw new Error('Failed to remove admin: An unknown error occurred');
      }
    }
  }

  
  async existGroup(userId: string, groupId: string) {
    try {
      const admin = await prisma.groupAdmin.findUnique({
        where: { userId_groupId: { userId, groupId } },
      });

      if (admin) {
         await prisma.groupAdmin.delete({ where: { id: admin.id },});

         await prisma.group.update({ where: { id: groupId}, 
          data: { adminsCount: { decrement: 1 },}, });
      }

      const member = await prisma.groupMember.findUnique({
        where: { userId_groupId: { userId, groupId } },
      });

      if (member) {
        await prisma.groupMember.delete({ where: { id: member.id },});

        await prisma.group.update({ where: { id: groupId,  },
          data: {membersCount: { decrement: 1 }}});
      }

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove admin: ${error.message}`);
      } else {
        throw new Error('Failed to remove admin: An unknown error occurred');
      }
    }
  }

  async getAdmins(groupId: string) {
    try {
      return prisma.groupAdmin.findMany({
        where: { groupId },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get admins: ${error.message}`);
      } else {
        throw new Error('Failed to get admins: An unknown error occurred');
      }
    }
  }
}

export default new GroupAdminService();
