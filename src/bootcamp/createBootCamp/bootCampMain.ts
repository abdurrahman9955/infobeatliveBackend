import { Router } from 'express';
import {
  createBootcamp,
  getAllBootcamps,
  getBootcampById,
  updateBootcamp,
  deleteBootcamp,
  getBootcampByUserId,
  getBootCampMembers,
  getAllBootCampMembers
} from './create';


const createBootcampRouter = Router();

createBootcampRouter.post('/create/:userId', createBootcamp);
createBootcampRouter.get('/get/get-all-bootcamps', getAllBootcamps);
createBootcampRouter.get('/get/get-by-id/:id', getBootcampById);
createBootcampRouter.get('/get/members/:id', getBootCampMembers);
createBootcampRouter.get('/get/members', getAllBootCampMembers);
createBootcampRouter.get('/get/get-by-user-id/:userId', getBootcampByUserId);
createBootcampRouter.put('/update/:userId/:id', updateBootcamp);
createBootcampRouter.delete('/delete/:userId/:id', deleteBootcamp);

export default createBootcampRouter;
