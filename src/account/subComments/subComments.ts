import express, { Request, Response } from 'express';
import prisma from '../../utils/prisma';

const subComments = express.Router();

subComments.get('/user/get/subComment/:commentId', async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;

    if (!commentId) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    const comments = await prisma.subComment.findMany({
      where: {
        commentId,
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

subComments.post('/user/create/subComment/:userId/:commentId', async (req:Request, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.params.userId;
    const commentId = req.params.commentId ;

    if ((!userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    if ((!commentId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const newComment = await prisma.subComment.create({
      data: {
        userId,
        content,
        commentId,
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'An error occurred while adding the comment' });
  }
});

subComments.delete('/user/delete/subComment/:commentId', async (req:Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
  
    if (!commentId) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    // Check if the comment belongs to the user
    const comment = await prisma.subComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    await prisma.subComment.delete({
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

export default subComments;
