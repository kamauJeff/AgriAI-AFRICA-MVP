import express from 'express';
import { protect } from '../middleware/auth';
import {
  createFarm,
  getFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
  createField,
  updateField,
  deleteField
} from '../controllers/farmController';

const router = express.Router();

// All farm routes are protected
router.use(protect);

// Farm CRUD
router.route('/')
  .post(createFarm)
  .get(getFarms);

router.route('/:id')
  .get(getFarmById)
  .put(updateFarm)
  .delete(deleteFarm);

// Field CRUD nested under farms
router.post('/:farmId/fields', createField);

// Separate routes for field updates/deletes (optional)
router.route('/fields/:fieldId')
  .put(updateField)
  .delete(deleteField);

export default router;