import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const bootcampAdvanceClassCourseComments = express.Router();

bootcampAdvanceClassCourseComments.get('/class/course/user/get/comment/:postId', async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    if (!postId) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const comments = await prisma.bootcampClassCourseComment.findMany({
      where: {
        postId,
      },
      include: {
        User: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(comments);
  } catch (error) {
    console.error('Error retrieving comments:', error);
    res.status(500).json({ error: 'An error occurred while retrieving comments' });
  }
});

bootcampAdvanceClassCourseComments.post('/class/course/user/create/comment/:userId/:postId', async (req:Request, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.params.userId;
    const postId = req.params.postId ;

    if ((!userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    if ((!postId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const newComment = await prisma.bootcampClassCourseComment.create({
      data: {
        userId,
        content,
        postId,
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'An error occurred while adding the comment' });
  }
});
bootcampAdvanceClassCourseComments.delete('/class/course/user/delete/comment/:commentId', async (req:Request, res: Response) => {
  try {
    const commentId = req.params.commentId;

    // Check if the comment belongs to the user
    const comment = await prisma.bootcampClassCourseComment.findFirst({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    await prisma.bootcampClassCourseComment.delete({
      where: {
        id: comment.id,
      },
    });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'An error occurred while deleting the comment' });
  }
});

export default bootcampAdvanceClassCourseComments;
