import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import availabilityRoutes from './routes/availability.js';
import sessionRoutes from './routes/session.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/sessions', sessionRoutes);

mongoose.connect('mongodb+srv://Snehansu:Snehansu@cluster0.ynnomo7.mongodb.net/eventScheduling')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
