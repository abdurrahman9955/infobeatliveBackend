import cron from 'node-cron';
import prisma from '../../utils/prisma';

async function suspendExpiredUsers() {
  const now = new Date();

  await prisma.bootcampStudent.updateMany({
    where: {
      planType: { in: ['MONTHLY', 'YEARLY'] },
      expiresAt: { lt: now },
      isSuspended: false,
    },
    data: {
      isSuspended: true,
      isStudent:false
    },
  });

  console.log('Expired users suspended at', now.toISOString());
}

// ⏱ Runs every 5 minutes
cron.schedule('*/5 * * * *', suspendExpiredUsers);
