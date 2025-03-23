import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const thirdComments = express.Router();

thirdComments.get('/user/get/thirdComment/:subCommentId', async (req: Request, res: Response) => {
  try {
    const subCommentId = req.params.subCommentId;

    if (!subCommentId) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    const comments = await prisma.thirdComment.findMany({
      where: {
        subCommentId,
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

thirdComments.post('/user/create/thirdComment/:userId/:subCommentId', async (req:Request, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.params.userId;
    const subCommentId = req.params.subCommentId ;

    if ((!userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    if ((!subCommentId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const newComment = await prisma.thirdComment.create({
      data: {
        userId,
        content,
        subCommentId,
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'An error occurred while adding the comment' });
  }
});

thirdComments.delete('/user/delete/thirdComment/:subCommentId', async (req:Request, res: Response) => {
  try {
    const commentId = req.params.subCommentId;

    if (!commentId) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    // Check if the comment belongs to the user
    const comment = await prisma.thirdComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    await prisma.thirdComment.delete({
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

export default thirdComments;
