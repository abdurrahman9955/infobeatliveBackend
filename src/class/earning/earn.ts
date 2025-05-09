import express from 'express';
import prisma from '../../utils/prisma';

const classEarningRouter = express.Router();

// CREATE a new CLassEarning
classEarningRouter.post('/class/earn/:classId', async (req, res) => {
  try {
    const {  balance, payout, Total } = req.body;
    const { classId } = req.params;

    const classEarning = await prisma.cLassEarning.create({
      data: {
        classId,
        balance,
        payout,
        Total,
      },
    });

    res.status(201).json(classEarning);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create class earning', details: error });
  }
});

// READ all CLassEarnings
classEarningRouter.get('/class/earn/get', async (_req, res) => {
  try {
    const classEarnings = await prisma.cLassEarning.findMany();
    res.json(classEarnings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch class earnings', details: error });
  }
});

// READ a single CLassEarning by ID
classEarningRouter.get('/class/earn/get/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const classEarning = await prisma.cLassEarning.findUnique({ where: { id } });

    if (!classEarning) return res.status(404).json({ error: 'Class earning not found' });

    res.json(classEarning);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch class earning', details: error });
  }
});

// READ a single CLassEarning by ID
classEarningRouter.get('/class/earn/get/class/:classId', async (req, res) => {
    try {
      const { classId } = req.params;
      const classEarning = await prisma.cLassEarning.findMany({ where: { classId } });
  
      if (!classEarning) return res.status(404).json({ error: 'Class earning not found' });
  
      res.json(classEarning);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch class earning', details: error });
    }
  });

// UPDATE a CLassEarning by ID
classEarningRouter.put('/class/earn/update/:id/:classId', async (req, res) => {
  try {
    const { id, classId } = req.params;
    const { balance, payout, Total } = req.body;

    const updated = await prisma.cLassEarning.update({
      where: { id, classId },
      data: { balance, payout, Total },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update class earning', details: error });
  }
});

// DELETE a CLassEarning by ID
classEarningRouter.delete('/class/earn/delete/:id/:classId', async (req, res) => {
  try {
    const { id, classId } = req.params;

    await prisma.cLassEarning.delete({ where: { id, classId } });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete class earning', details: error });
  }
});

export default classEarningRouter;
