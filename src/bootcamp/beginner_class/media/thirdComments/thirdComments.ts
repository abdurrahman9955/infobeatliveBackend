import express, { Request, Response } from 'express';
import prisma from '../../../../utils/prisma';

const bootcampClassThirdComments = express.Router();

bootcampClassThirdComments.get('/class/user/get/thirdComment/:subCommentId', async (req: Request, res: Response) => {
  try {
    const subCommentId = req.params.subCommentId;

    if (!subCommentId) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    const comments = await prisma.bootcampClassThirdComment.findMany({
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

bootcampClassThirdComments.post('/class/user/create/thirdComment/:userId/:subCommentId', async (req:Request, res: Response) => {
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

    const newComment = await prisma.bootcampClassThirdComment.create({
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

bootcampClassThirdComments.delete('/class/user/delete/thirdComment/:subCommentId', async (req:Request, res: Response) => {
  try {
    const commentId = req.params.subCommentId;

    if (!commentId) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    // Check if the comment belongs to the user
    const comment = await prisma.bootcampClassThirdComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    await prisma.bootcampClassThirdComment.delete({
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

export default bootcampClassThirdComments;
