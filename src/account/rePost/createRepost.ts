import prisma from '../../utils/prisma';

class RePostService {
  async createRePost(userId: string, postId: string) {
    try {

      const existingPost = await prisma.rePost.findFirst({
        where: { userId, postId },
      });
      if (existingPost) {
        throw new Error('User  already rePost   this post');
      }

      await prisma.rePost.create({
        data: {
          userId,
          postId,
        },
      });
      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to  rePost: ${error.message}`);
      } else {
        throw new Error('Failed to rePost: An unknown error occurred');
      }
    }
  }
  
  async deleteRePost(userId: string, postId: string) {
    try {
      const post = await prisma.rePost.findFirst({
        where: { userId, postId },
      });
      if (!post) {
        throw new Error('User did not rePost this post ');
      }

      return prisma.rePost.delete({
        where: { id: post.id,
         },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete rePost: ${error.message}`);
      } else {
        throw new Error('Failed to delete rePost: An unknown error occurred');
      }
    }
  }

  async getRePost(postId: string) {
    try {
      return prisma.rePost.findMany({
        where: { postId },
        
        include: {
          user: {
            include: {
              profile: true,
            },
          },
          post: {
            include: {
              user: {
                include: {
                  profile: true,
                  },
                },
              },
            },
        },
        
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get rePost: ${error.message}`);
      } else {
        throw new Error('Failed to get rePost: An unknown error occurred');
      }
    }
  }

  async getRePostByUserId(userId: string) {
    try {
      return prisma.rePost.findMany({
        where: { userId },
        
        include: {
          user: {
            include: {
              profile: true,
            },
          },
          post: {
            include: {
              user: {
                include: {
                  profile: true,
                  },
                },
              },
            },
        },
        
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get rePost: ${error.message}`);
      } else {
        throw new Error('Failed to get rePost: An unknown error occurred');
      }
    }
  }

}

export default new RePostService();
