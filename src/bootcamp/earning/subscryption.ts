import express from 'express';
import prisma from '../../utils/prisma';

const academySubscribeRouter = express.Router();

// CREATE a new CLassEarning
academySubscribeRouter.post('/class/subscribe/:userId/:classId/:bootcampId', async (req, res) => {
  try {
    const {  type, amount,  level } = req.body;
    const { classId, bootcampId, userId } = req.params;

    const classEarning = await prisma.bootcampClassSubscribed.create({
      data: {
        bootcampId,
        classId,
        userId,
        type,
        amount,
        level
      },
    });

    res.status(201).json(classEarning);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create class earning', details: error });
  }
});

// READ all CLassEarnings
academySubscribeRouter.get('/class/subscribe/get', async (_req, res) => {
  try {
    const classEarnings = await prisma.bootcampClassSubscribed.findMany();
    res.json(classEarnings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch class earnings', details: error });
  }
});

// READ a single CLassEarning by ID
academySubscribeRouter.get('/class/subscribe/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const classEarning = await prisma.bootcampClassSubscribed.findUnique({ where: { id } });

    if (!classEarning) return res.status(404).json({ error: 'Class earning not found' });

    res.json(classEarning);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch class earning', details: error });
  }
});

// READ a single CLassEarning by ID
academySubscribeRouter.get('/class/subscribe/get/class/:classId/:bootcampId', async (req, res) => {
    try {
      const { classId, bootcampId } = req.params;
      const classEarning = await prisma.bootcampClassSubscribed.findMany({ where: { classId, bootcampId } });
 
      if (!classEarning) return res.status(404).json({ error: 'Class earning not found' });
  
      res.json(classEarning);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch class earning', details: error });
    }
  });

// UPDATE a CLassEarning by ID
academySubscribeRouter.put('/class/subscribe/update/:id/:classId/:bootcampId', async (req, res) => {
  try {
    const { id, classId, bootcampId } = req.params;
    const { type, amount } = req.body;

    const updated = await prisma.bootcampClassSubscribed.update({
      where: { id, classId, bootcampId },
      data: { type, amount },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update class earning', details: error });
  }
});

// DELETE a CLassEarning by ID
academySubscribeRouter.delete('/class/subscribe/delete/:id/:classId/:bootcampId', async (req, res) => {
  try {
    const { id, classId, bootcampId } = req.params;

    await prisma.bootcampClassSubscribed.delete({ where: { id, classId, bootcampId } });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete class earning', details: error });
  }
});

export default academySubscribeRouter;
