import express, { Request, Response } from 'express';
import prisma from '../../../../utils/prisma';

const bootcampAdvanceClassSubComments = express.Router();

bootcampAdvanceClassSubComments.get('/class/user/get/subComment/:commentId', async (req: Request, res: Response) => {
  try {
    const commentId = req.params.commentId;

    if (!commentId) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    const comments = await prisma.bootcampClassSubComment.findMany({
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

bootcampAdvanceClassSubComments.post('/class/user/create/subComment/:userId/:commentId', async (req:Request, res: Response) => {
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

    const newComment = await prisma.bootcampClassSubComment.create({
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

bootcampAdvanceClassSubComments.delete('/class/user/delete/subComment/:commentId', async (req:Request, res: Response) => {
  try {
    const commentId = req.params.commentId;
  
    if (!commentId) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    // Check if the comment belongs to the user
    const comment = await prisma.bootcampClassSubComment.findFirst({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    await prisma.bootcampClassSubComment.delete({
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

export default bootcampAdvanceClassSubComments;
