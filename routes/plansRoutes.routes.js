import express from 'express';
import {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan,
} from '../controllers/planControllers.js';

const router = express.Router();

// Create a new plan
router.post('/plans', createPlan);

// Get all plans
router.post('/plans', getAllPlans);

// Get a single plan by ID
router.get('/plans/:id', getPlanById);

// Update a plan
router.put('/plans/:id', updatePlan);

// Delete a plan
router.delete('/plans/:id', deletePlan);

export default router;
