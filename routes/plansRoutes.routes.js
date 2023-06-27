import express from 'express';
import {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan,
    buyPlan,
} from '../controllers/planControllers.js';
import cors from "cors";

const router = express.Router();
router.use(cors({ origin: "*" }));

// Create a new plan
router.post('/', createPlan);

// Get all plans
router.get('/', getAllPlans);

// Get a single plan by ID
router.get('/:id', getPlanById);

// Update a plan
router.put('/:id', updatePlan);

// Delete a plan
router.delete('/:id', deletePlan);
// User routes
router.put('/users/:userId/buy-plan/:planId', buyPlan);
export default router;
