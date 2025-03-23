// src/routes/classContactRoutes.ts
import { Router } from 'express';
import { ClassAnnouncementController } from './announcement';
import announcementService from './deleteTime';

const classAnnouncement = Router();
const announcementController = new ClassAnnouncementController();

classAnnouncement.get('/class/get/announcement/:classId', announcementController.getAll);
classAnnouncement.get('/class/get/announcement/:id/:userId', announcementController.getById);
classAnnouncement.post('/class/create/announcement/:classId/:userId', announcementController.create);
classAnnouncement.put('/class/update/announcement/:classId/:userId/:id', announcementController.update);
classAnnouncement.delete('/class/delete/announcement/:classId/:userId/:id', announcementController.delete);
classAnnouncement.delete('/class/delete/announcement/auto-delete', announcementService.deleteExpiredAnnouncements)

export default classAnnouncement;
