import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/createToken.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered!' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    const token = generateToken(res, user._id);
    res.json({ token, user });
});
router.post('/logout', async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(201).json({
        message: "Logged out successfully"
    })
})

export default router;
