import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
    user: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    duration: { type: Number, required: true },
    scheduledSlots: [
        {
            start: { type: Date, required: true },
            end: { type: Date, required: true },
            attendees: [
                {
                    name: String,
                    email: String,
                },
            ],
        },
    ],
});

const Session = mongoose.model('Session', SessionSchema);
export default Session;
