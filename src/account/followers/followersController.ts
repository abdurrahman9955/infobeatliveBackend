import { Request, Response } from 'express';
import prisma from '../../utils/prisma';

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  message?: string;
  followingCount?: number;
  followerCount?: number;
  followers?:T[];
  followerStatus?: boolean;
  followingStatus?: Record<string, boolean>;
  following?: boolean;
}

export type CustomRequest = Request & {
  user?: any; 
};

export interface UserProfile {
    id: number;
    
  }

export interface Follower {
    User: UserProfile;
    
  }
  


export const getFollowingCount = async (req: Request<{ userId: string }>, res: Response<ApiResponse<any>>): Promise<void> => {
  try {
    const followerId = req.params.userId;

    if (!followerId) {
      res.status(400).json({ success: false, error: 'User ID is missing or invalid' });
      return;
    }

    const following = await prisma.following.findMany({
      where: { followerId },
      include: {
        User: {
          include: {
            profile: true,
          },
        },
      },
    });

    res.json({ success: true, followingCount: following.length, following:following as any });
  } catch (error) {
    console.error('Error getting following:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const getFollowerCount = async (req: Request<{ userId: string }>, res: Response<ApiResponse<any>>): Promise<void> => {
  try {
    const followingId = req.params.userId;

    if (!followingId) {
      res.status(400).json({ success: false, error: 'User ID is missing or invalid' });
      return;
    }

    const userIdFromLocalStorage = parseInt(req.headers['user-id'] as string);

    const followers = await prisma.following.findMany({
      where: { followingId },
      include: {
        User: {
          include: {
            profile: true,
          },
        },
      },
    });

    const followersWithFollowStatus = followers.map((follower:any) => ({
      ...follower,
      isFollowing: follower.followerId === userIdFromLocalStorage,
    }));

    res.json({ success: true, followerCount: followers.length, followers: followersWithFollowStatus });
  } catch (error) {
    console.error('Error getting followers:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


export const getFollowing = async (req: CustomRequest, res: Response<ApiResponse<any>>): Promise<void> => {
  try {
    const followerId = req.params.userId;

    if (!followerId) {
      res.status(400).json({ success: false, error: 'User ID is missing or invalid in request headers' });
      return;
    }

    const following = await prisma.following.findMany({
      where: { followerId },
      include: {
        FollowingProfile: {
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

    res.json({ success: true, followingCount: following.length, following:following as any });
  } catch (error) {
    console.error('Error getting following:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const getFollowers = async (req: Request, res: Response<ApiResponse<any>>): Promise<void> => {
    try {
      const followingId = req.params.userId;
  
      if (!followingId) {
        res.status(400).json({ success: false, error: 'User ID is missing or invalid in request headers' });
        return;
      }
  
      const followers = await prisma.following.findMany({
        where: { followingId },
        include: {
          User: {
            include: {
              profile: true,
            },
          },
        },
      }); // Type assertion here
  
      const followingStatus: Record<string, boolean> = {};
      followers.forEach((follower) => {
        const userId = follower.User.id;
        followingStatus[userId] = true;
      });
  
      res.json({ success: true, followerCount: followers.length, followers, followingStatus });
    } catch (error) {
      console.error('Error getting followers:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };

export const followUser = async (req: Request<{ userId: string, followerId: string }>, res: Response<ApiResponse<any>>): Promise<void> => {
  try {
    const followerId = req.params.followerId;
    const followingId = req.params.userId;

    if (!followerId || !followingId) {
      res.status(400).json({ success: false, error: 'Follower ID or Following ID is missing or invalid' });
      return;
    }

    const userFollowerExists = await prisma.user.findFirst({
      where: {id:followerId,  },
    });

    if (!userFollowerExists) {
      res.status(400).json({ success: false, message: 'user not found' });
      return;
    }

    const userFollowingExist = await prisma.user.findFirst({
      where: {id:followingId,  },
    });

    if (!userFollowingExist) {
      res.status(400).json({ success: false, message: 'user not found' });
      return;
    }


    const followingExists = await prisma.following.findFirst({
      where: { followerId, followingId },
    });

    if (followingExists) {
      res.status(200).json({ success: false, message: 'Already following this user' });
      return;
    }

    await prisma.following.create({
      data: { followerId, followingId },
    });

    await prisma.user.update({
      where: {
        id: userFollowerExists.id, 
      },
      data: {
        followingCount: {
          increment: 1, // Increment the current value by 1
        },
      },
    });

    await prisma.user.update({
      where: {
        id: userFollowingExist.id, 
      },
      data: {
        followerCount: {
          increment: 1, // Increment the current value by 1
        },
      },
    });

    res.json({ success: true, message: 'Followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const unfollowUser = async (req: Request<{ userId: string, followerId: string }>, res: Response<ApiResponse<any>>): Promise<void> => {
  try {
    const followerId = req.params.followerId;
    const followingId = req.params.userId;

    if (!followerId || !followingId) {
      res.status(400).json({ success: false, error: 'Follower ID or Following ID is missing or invalid' });
      return;
    }

    const userFollowerExists = await prisma.user.findFirst({
      where: {id:followerId,  },
    });

    if (!userFollowerExists) {
      res.status(400).json({ success: false, message: 'user not found' });
      return;
    }

    const userFollowingExist = await prisma.user.findFirst({
      where: {id:followingId,  },
    });

    if (!userFollowingExist) {
      res.status(400).json({ success: false, message: 'user not found' });
      return;
    }

    const followingExists = await prisma.following.findFirst({
      where: { followerId, followingId },
    });
    if (!followingExists) {
      res.status(200).json({ success: false, message: 'Not following this user' });
      return;
    }

    await prisma.following.deleteMany({
      where: { followerId, followingId },
    });

    await prisma.user.update({
      where: {
        id: userFollowerExists.id, 
      },
      data: {
        followingCount: {
          decrement: 1, // Increment the current value by 1
        },
      },
    });

    await prisma.user.update({
      where: {
        id: userFollowingExist.id, 
      },
      data: {
        followerCount: {
          decrement: 1, // Increment the current value by 1
        },
      },
    });

    res.json({ success: true, message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export const checkFollowingStatus = async (req: Request<{ userId: string, followerId: string }>, res: Response<ApiResponse<any>>): Promise<void> => {
    try {
      const followerId = req.params.followerId;
      const followingId = req.params.userId;

      if (!followerId || !followingId) {
        res.status(400).json({ success: false, error: 'Follower ID or Following ID is missing or invalid' });
        return;
      }
  
      const followingExists = await prisma.following.findFirst({
        where: { followerId, followingId },
      });
  
      res.json({ success: true, following: !!followingExists });
    } catch (error) {
      console.error('Error checking following status:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
  
