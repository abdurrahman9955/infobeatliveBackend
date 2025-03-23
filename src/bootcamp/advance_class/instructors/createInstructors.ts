import prisma from '../../../utils/prisma';

class ClassInstructorService {
  async addInstructor(userId: string, classId: string) {
    try {


      const existingMember = await prisma.bootcampStudent.findUnique({
        where: { userId_classId: { userId, classId }, level:'ADVANCED', },
      });

      if (!existingMember) {
         await prisma.bootcampStudent.create({
           data: {
             userId,
             classId,
             planType:'INSTRUCTOR',
             level:'ADVANCED'
          },
         });
      }

      const existingAdmin = await prisma.bootcampInstructor.findUnique({
        where: { userId_classId: { userId, classId } },
      });
      if (existingAdmin) {
        throw new Error('User is already an instructor of this class');
      }

      await prisma.bootcampInstructor.create({
        data: {
          userId,
          classId,
          level:'ADVANCED'
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


      const member = await prisma.bootcampStudent.findUnique({
        where: { userId_classId: { userId, classId }, level:'ADVANCED', },
      });

      if (member) {
           await prisma.bootcampStudent.delete({
           where: { id: member.id },
          }); }

      const instructor = await prisma.bootcampInstructor.findUnique({
        where: { userId_classId: { userId,  classId }, level:'ADVANCED',
       },
      });
      if (!instructor) {
        throw new Error('User is not an Instructor of this group');
      }

      return prisma.bootcampInstructor.delete({
        where: { id: instructor.id, level:'ADVANCED',
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


      const member = await prisma.bootcampStudent.findUnique({
        where: { userId_classId: { userId, classId }, level:'ADVANCED', },
      });

      if (member) {
           await prisma.bootcampStudent.delete({
           where: { id: member.id },
          }); }

      const admin = await prisma.bootcampInstructor.findUnique({
        where: { userId_classId: { userId,  classId }, level:'ADVANCED', }, });

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
      return prisma.bootcampInstructor.findMany({
        where: { classId, level:'ADVANCED', isInstructor: true
         },
        
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
