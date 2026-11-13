import { Router } from 'express';
import {
  getApplications,
  getSummary,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationsController.js';

const router = Router();

router.get('/', getApplications);
router.get('/summary', getSummary);
router.get('/:id', getApplicationById);
router.post('/', createApplication);
router.patch('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;