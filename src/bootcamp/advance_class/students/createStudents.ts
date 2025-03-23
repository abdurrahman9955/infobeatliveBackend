import prisma from '../../../utils/prisma';
class ClassMemberService {
  // Add a member to a group
 
  async addMember(userId: string, classId: string) {
    try {
      const existingMember = await prisma.bootcampStudent.findUnique({
        where: { userId_classId: { userId, classId } },
      });
      if (existingMember) {
        throw new Error('User is already a member of this group');
      }

       await prisma.bootcampStudent.create({
        data: {
          userId,
          classId,
          planType:'MONTHLY',
          level:'ADVANCED',
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
  async removeMember(userId: string, classId: string) {
    try {
      const member = await prisma.bootcampStudent.findUnique({
        where: { userId_classId: { userId, classId }, level:'ADVANCED', },
      });
      if (!member) {
        throw new Error('User is not a member of this group');
      }

      await prisma.bootcampStudent.delete({
        where: { level:'ADVANCED', id: member.id },
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
  async getMembers(classId: string) {
    try {
      return prisma.bootcampStudent.findMany({
        where: { classId, level:'ADVANCED', isSuspended: false },

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

export default new ClassMemberService();
