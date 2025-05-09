import express from 'express';
import prisma from '../../utils/prisma';

const classSubscribeRouter = express.Router();

// CREATE a new CLassEarning
classSubscribeRouter.post('/class/subscribe/:classId/:userId', async (req, res) => {
  try {
    const {  type, amount } = req.body;
    const { classId, userId } = req.params;

    const classEarning = await prisma.classSubscribed.create({
      data: {
        classId,
        userId,
        type,
        amount,
      },
    });

    res.status(201).json(classEarning);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create class earning', details: error });
  }
});

// READ all CLassEarnings
classSubscribeRouter.get('/class/subscribe/get', async (_req, res) => {
  try {
    const classEarnings = await prisma.classSubscribed.findMany();
    res.json(classEarnings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch class earnings', details: error });
  }
});

// READ a single CLassEarning by ID
classSubscribeRouter.get('/class/subscribe/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const classEarning = await prisma.classSubscribed.findUnique({ where: { id } });

    if (!classEarning) return res.status(404).json({ error: 'Class earning not found' });

    res.json(classEarning);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch class earning', details: error });
  }
});

// READ a single CLassEarning by ID
classSubscribeRouter.get('/class/subscribe/get/class/:classId', async (req, res) => {
    try {
      const { classId } = req.params;
      const classEarning = await prisma.classSubscribed.findMany({ where: { classId } });
 
      if (!classEarning) return res.status(404).json({ error: 'Class earning not found' });
  
      res.json(classEarning);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch class earning', details: error });
    }
  });

// UPDATE a CLassEarning by ID
classSubscribeRouter.put('/class/subscribe/update/:id/:classId', async (req, res) => {
  try {
    const { id, classId } = req.params;
    const { type, amount} = req.body;

    const updated = await prisma.classSubscribed.update({
      where: { id, classId },
      data: { type, amount},
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update class earning', details: error });
  }
});

// DELETE a CLassEarning by ID
classSubscribeRouter.delete('/class/subscribe/delete/:id/:classId', async (req, res) => {
  try {
    const { id, classId } = req.params;

    await prisma.classSubscribed.delete({ where: { id, classId } });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete class earning', details: error });
  }
});

export default classSubscribeRouter;
