import express from 'express';
import prisma from '../../utils/prisma';

const academyEarningRouter = express.Router();

// CREATE a new CLassEarning
academyEarningRouter.post('/class/earn/:classId/:bootcampId', async (req, res) => {
  try {
    const {  balance, payout, Total, level } = req.body;
    const { classId, bootcampId  } = req.params;

    const classEarning = await prisma.bootcampCLassEarning.create({
      data: {
        bootcampId,
        classId,
        balance,
        payout,
        Total,
        level
      },
    });

    res.status(201).json(classEarning);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create class earning', details: error });
  }
});

// READ all CLassEarnings
academyEarningRouter.get('/class/earn/get', async (_req, res) => {
  try {
    const classEarnings = await prisma.bootcampCLassEarning.findMany();
    res.json(classEarnings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch class earnings', details: error });
  }
});

// READ a single CLassEarning by ID
academyEarningRouter.get('/class/earn/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const classEarning = await prisma.bootcampCLassEarning.findUnique({ where: { id } });

    if (!classEarning) return res.status(404).json({ error: 'Class earning not found' });

    res.json(classEarning);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch class earning', details: error });
  }
});

// READ a single CLassEarning by ID
academyEarningRouter.get('/class/earn/get/class/:classId/:bootcampId', async (req, res) => {
    try {
      const { classId, bootcampId } = req.params;
      const classEarning = await prisma.bootcampCLassEarning.findMany({ where: { classId, bootcampId } });
  
      if (!classEarning) return res.status(404).json({ error: 'Class earning not found' });
  
      res.json(classEarning);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch class earning', details: error });
    }
  });

// UPDATE a CLassEarning by ID
academyEarningRouter.put('/class/earn/update/:id/:classId/:bootcampId', async (req, res) => {
  try {
    const { id, classId, bootcampId } = req.params;
    const { balance, payout, Total } = req.body;

    const updated = await prisma.bootcampCLassEarning.update({
      where: { id, classId, bootcampId },
      data: { balance, payout, Total },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update class earning', details: error });
  }
});

// DELETE a CLassEarning by ID
academyEarningRouter.delete('/class/earn/delete/:id/:classId/:bootcampId', async (req, res) => {
  try {
    const { id, classId, bootcampId } = req.params;

    await prisma.bootcampCLassEarning.delete({ where: { id, classId, bootcampId } });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete class earning', details: error });
  }
});

export default academyEarningRouter;
