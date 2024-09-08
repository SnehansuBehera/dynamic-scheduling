import Session from '../models/Session.js';
import User from '../models/User.js'; // Assuming you have a User model
import nodemailer from 'nodemailer';
import { authenticate } from '../middleware/auth.js';
import express from 'express';

const router = express.Router();
// Email setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'snehansbehera080903@gmail.com',
        pass: 'S08092003@',
    },
});

const sendEmailNotification = (email, subject, text) => {
    const mailOptions = {
        from: 'snehansbehera080903@gmail.com',
        to: email,
        subject,
        text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

// Schedule a session
router.post('/schedule', authenticate, async (req, res) => {
    try {
        const { userId, selectedDate, selectedSlot, isOneOnOne, attendees } = req.body;

        // Fetch user by ID
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the selected slot is available on the given date
        const availability = user.availability.find(avl => new Date(avl.date).toISOString().split('T')[0] === selectedDate);
        if (!availability) return res.status(400).json({ message: 'No availability on the selected date' });

        const isSlotAvailable = availability.slots.some(slot => {
            return slot.start === selectedSlot.start && slot.end === selectedSlot.end;
        });

        if (!isSlotAvailable) return res.status(400).json({ message: 'Selected slot is unavailable' });

        // Create new session
        const session = new Session({
            user: user._id,
            start: new Date(`${selectedDate}T${selectedSlot.start}`),
            end: new Date(`${selectedDate}T${selectedSlot.end}`),
            duration: 30, // Assuming 30 minutes duration
            scheduledSlots: [
                {
                    start: new Date(`${selectedDate}T${selectedSlot.start}`),
                    end: new Date(`${selectedDate}T${selectedSlot.end}`),
                    attendees,
                }
            ]
        });

        await session.save();

        // Notify attendees via email
        attendees.forEach(att => {
            sendEmailNotification(att.email, 'Session Scheduled', `A session has been scheduled for you on ${selectedDate} at ${selectedSlot.start}`);
        });

        res.status(200).json({ message: 'Session scheduled successfully' });
    } catch (err) {
        console.error('Error scheduling session:', err);
        res.status(500).json({ message: 'Error scheduling session' });
    }
});

export default router;