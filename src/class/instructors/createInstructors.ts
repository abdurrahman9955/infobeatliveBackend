import prisma from '../../utils/prisma';

class ClassInstructorService {
  async addInstructor(userId: string, classId: string) {
    try {

      const existingMember = await prisma.student.findUnique({
        where: { userId_classId: { userId, classId } },
      });

      if (!existingMember) {
         await prisma.student.create({
           data: {
             userId,
             classId,
             planType:'INSTRUCTOR'
          },
         });
      }

      const existingAdmin = await prisma.instructor.findUnique({
        where: { userId_classId: { userId, classId } },
      });
      if (existingAdmin) {
        throw new Error('User is already an instructor of this class');
      }

      await prisma.instructor.create({
        data: {
          userId,
          classId,
          isInstructor: true,
        },
      });
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to add admin: ${error.message}`);
      } else {
        throw new Error('Failed to add Instructor: An unknown error occurred');
      }
    }
  }
  
  async removeInstructor(userId: string, classId: string) {
    try {

      const member = await prisma.student.findUnique({
        where: { userId_classId: { userId, classId } },
      });

      if (member) {
           await prisma.student.delete({
           where: { id: member.id },
          }); }
      
      const instructor = await prisma.instructor.findUnique({
        where: { userId_classId: { userId, classId },
       },
      });
      if (!instructor) {
        throw new Error('User is not an Instructor of this group');
      }

      return prisma.instructor.delete({
        where: { id: instructor.id,
         },
      });
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove Instructor: ${error.message}`);
      } else {
        throw new Error('Failed to remove Instructor: An unknown error occurred');
      }
    }
  }

  
  async existClass(userId: string, classId: string) {
    try {

      const member = await prisma.student.findUnique({
        where: { userId_classId: { userId, classId } },
      });

      if (member) {
           await prisma.student.delete({
           where: { id: member.id },
          }); }
      
      const admin = await prisma.instructor.findUnique({
        where: { userId_classId: { userId, classId } }, });

      if (admin) {  await prisma.instructor.delete({ where: { id: admin.id },});}

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove admin: ${error.message}`);
      } else {
        throw new Error('Failed to remove admin: An unknown error occurred');
      }
    }
  }

  async getInstructors(classId: string) {
    try {
      return prisma.instructor.findMany({
        where: { classId, isInstructor: true },
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
        throw new Error(`Failed to get Instructors: ${error.message}`);
      } else {
        throw new Error('Failed to get Instructors: An unknown error occurred');
      }
    }
  }
}

export default new ClassInstructorService();
