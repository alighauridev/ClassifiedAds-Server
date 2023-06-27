import Plan from '../models/PlanSchema.js';
import User from '../models/user.js';
import { convertCurrency } from '../utils/currenyConverter.js';

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
async function testCurrencyConversion() {
    try {
        const amount = 100; // The amount to convert
        const baseCurrency = 'USD'; // The base currency
        const targetCurrency = 'EUR'; // The target currency

        const convertedAmount = await convertCurrency(amount, baseCurrency, targetCurrency);

        console.log(`Converted amount: ${convertedAmount} ${targetCurrency}`);
    } catch (error) {
        console.error('Currency conversion failed:', error.message);
    }
}

testCurrencyConversion();
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
const buyPlan = async (req, res) => {
    try {
        const { userId, planId } = req.params;

        // Find the user and the selected plan
        const user = await User.findById(userId);
        const plan = await Plan.findById(planId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        // Update the user's plan status
        user.plan = plan;
        await user.save();

        return res.status(200).json({ message: 'Plan purchased successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export { createPlan, getAllPlans, getPlanById, updatePlan, deletePlan, buyPlan };
