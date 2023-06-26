import Plan from '../models/PlanSchema.js';

// Create a new plan
const createPlan = async (req, res) => {
    try {
        const plan = new Plan(req.body);
        await plan.save();
        res.status(201).json(plan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all plans
const getAllPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single plan by ID
const getPlanById = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) {
            res.status(404).json({ message: 'Plan not found' });
            return;
        }
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a plan
const updatePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!plan) {
            res.status(404).json({ message: 'Plan not found' });
            return;
        }
        res.json(plan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a plan
const deletePlan = async (req, res) => {
    try {
        const plan = await Plan.findByIdAndDelete(req.params.id);
        if (!plan) {
            res.status(404).json({ message: 'Plan not found' });
            return;
        }
        res.json({ message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan };
