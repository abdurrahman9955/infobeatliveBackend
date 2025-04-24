import express, { Request, Response } from 'express';
import prisma from '../../../utils/prisma';

const groupSubComments = express.Router();

groupSubComments.get('/group/user/get/subComment/:commentId', async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;

    if (!commentId) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    const comments = await prisma.groupSubComment.findMany({
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

groupSubComments.post('/group/user/create/subComment/:userId/:commentId', async (req:Request, res: Response) => {
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

    const newComment = await prisma.groupSubComment.create({
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

groupSubComments.delete('/group/user/delete/subComment/:commentId', async (req:Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
  
    if (!commentId) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    // Check if the comment belongs to the user
    const comment = await prisma.groupSubComment.findFirst({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    await prisma.groupSubComment.delete({
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

export default groupSubComments;
