import prisma from '../../utils/prisma';
class GroupMemberService {
  // Add a member to a group
  async addMember(userId: string, groupId: string) {
    try {
      const existingMember = await prisma.groupMember.findUnique({
        where: { userId_groupId: { userId, groupId } },
      });

      if (existingMember) {
         return await prisma.groupMember.update({
          where:{id: existingMember.id},
          data: {
            isMember: true,
          },
        });
      }

       await prisma.groupMember.create({
        data: {
          userId,
          groupId,
          isMember: true,
        },
      });

     await prisma.group.update({
        where: {
          id: groupId, 
        },
        data: {
          
          membersCount: {
            increment: 1, // Increment the current value by 1
          },
         
        },
      });

      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to add member: ${error.message}`);
      } else {
        throw new Error('Failed to add member: An unknown error occurred');
      }
    }
  }

  async requestMember(userId: string, groupId: string) {
    try {

      const existingMember = await prisma.groupMember.findUnique({
        where: { userId_groupId: { userId, groupId } },
      });
      if (existingMember) {
        throw new Error('User is already a member of this group');
      }

       await prisma.groupMember.create({
        data: {
          userId,
          groupId,
        },
      });

      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to add member: ${error.message}`);
      } else {
        throw new Error('Failed to add member: An unknown error occurred');
      }
    }
  }


  // Remove a member from a group
  async removeMember(userId: string, groupId: string) {
    try {
      const member = await prisma.groupMember.findUnique({
        where: { userId_groupId: { userId, groupId } },
      });

      if (!member) {
        throw new Error('User is not a member of this group');
      }
      
      const existingMember = await prisma.groupMember.findUnique({
        where: { userId_groupId: { userId, groupId } },
      });

      if (existingMember?.isAdmin === true) {
        throw new Error('you cannot remove the member who is admin');
      }

      await prisma.groupMember.delete({
        where: { id: member.id },
      });


     await prisma.group.update({
      where: {
        id: groupId, 
      },
      data: {
        membersCount: {
          decrement: 1, // Increment the current value by 1
        },
      },
    });

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove member: ${error.message}`);
      } else {
        throw new Error('Failed to remove member: An unknown error occurred');
      }
    }
  }

  // Get all members of a group
  async getMembers(groupId: string) {
    try {
      return prisma.groupMember.findMany({
        where: { groupId, isMember: true },

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
        throw new Error(`Failed to get members: ${error.message}`);
      } else {
        throw new Error('Failed to get members: An unknown error occurred');
      }
    }
  }

  // Get all members of a group
  async getMembersByGroups(userId: string) {
    try {
      return prisma.groupMember.findMany({
        where: { userId, isMember: true },
        include: {
          group: {
            include: {
              creator: {
                include: {
                  profile: true,
                },
              },
            },
          },
          user: {
            include: {
              profile: true,
            },
          }, 
        },

      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get members: ${error.message}`);
      } else {
        throw new Error('Failed to get members: An unknown error occurred');
      }
    }
  }

  // Get all members of a group
  async getRequestMembers(groupId: string) {
    try {
      return prisma.groupMember.findMany({
        where: { groupId, isMember: false },

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
        throw new Error(`Failed to get members: ${error.message}`);
      } else {
        throw new Error('Failed to get members: An unknown error occurred');
      }
    }
  }
  
}

export default new GroupMemberService();
