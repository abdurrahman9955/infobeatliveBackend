import express, { Request, Response } from 'express';
import prisma from '../../../../utils/prisma';

const classCourseComments = express.Router();

classCourseComments.get('/class/course/user/get/comment/:postId', async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    if (!postId) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const comments = await prisma.classCourseComment.findMany({
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

classCourseComments.post('/class/course/user/create/comment/:userId/:postId', async (req:Request, res: Response) => {
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

    const newComment = await prisma.classCourseComment.create({
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
classCourseComments.delete('/class/course/user/delete/comment/:commentId', async (req:Request, res: Response) => {
  try {
    const commentId = req.params.commentId;

    // Check if the comment belongs to the user
    const comment = await prisma.classCourseComment.findFirst({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(400).json({ error: 'Invalid commentId' });
    }

    await prisma.classCourseComment.delete({
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

export default classCourseComments;
