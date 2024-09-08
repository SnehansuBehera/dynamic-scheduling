import express from 'express';
import { authenticate, admin } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Set user availability
router.post('/set/:id', async (req, res) => {
    try {
        const { availability } = req.body;// Make sure you're accessing the availability array
        const { id } = req.params;
        console.log(id);
        if (!availability || !Array.isArray(availability)) {
            return res.status(400).json({ message: 'Invalid availability data' });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.availability = [];  // Optionally clear previous availability
        availability.forEach(item => {
            user.availability.push({ date: item.date, slots: item.slots });
        });

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error('Error saving availability:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Get all user availability (Admin only)
// Assuming you're using Express.js
router.get('/users', authenticate, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});
router.get('/:id/slot', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user.availability);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching slot of the user' });
    }
})


export default router;
