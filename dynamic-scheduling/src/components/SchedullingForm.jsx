import React, { useState } from 'react';
import axios from 'axios';

const ScheduleSession = ({ availability, userId, users }) => {
    const [selectedDate, setSelectedDate] = useState('');  // Selected date
    const [selectedSlot, setSelectedSlot] = useState(null);  // Selected time slot
    const [availableSlots, setAvailableSlots] = useState([]);  // Slots for the selected date
    const [duration, setDuration] = useState(30);  // Session duration in minutes
    const [isOneOnOne, setIsOneOnOne] = useState(true);  // Default to one-on-one
    const [attendees, setAttendees] = useState([]);  // Attendees list
    const [error, setError] = useState('');  // Error handling

    // Handle selecting a date and updating available slots
    const handleDateChange = (e) => {
        const selectedOption = JSON.parse(e.target.value);  // Parse the selected option
        setSelectedDate(selectedOption.date);  // Set selected date
        setSelectedSlot(null);  // Reset the selected slot
        setAvailableSlots(selectedOption.slots);  // Set available slots for the selected date
    };

    // Handle scheduling a session
    const handleSchedule = async () => {
        if (!selectedDate || !selectedSlot) {
            setError('Please select both a date and a slot.');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                'http://localhost:5000/api/sessions/schedule',
                {
                    userId,
                    selectedDate,
                    selectedSlot,
                    duration,
                    attendees: attendees.map((attendee) => ({
                        name: attendee.name,
                        email: attendee.email,
                    })),
                    isOneOnOne,
                },
                {
                    headers: { Authorization: `${token}` },
                }
            );
            console.log('Session scheduled:', response.data);
            setError('');  // Clear error if successful
        } catch (err) {
            console.error('Error scheduling session:', err);
            setError('Failed to schedule the session. Please try again.');
        }
    };

    // Handle adding an attendee
    const handleAddAttendee = (user) => {
        if (!attendees.some((attendee) => attendee._id === user._id)) {
            setAttendees([...attendees, user]);
        }
    };

    // Handle removing an attendee
    const handleRemoveAttendee = (userId) => {
        setAttendees(attendees.filter((attendee) => attendee._id !== userId));
    };

    return (
        <div className="schedule-session">
            <h3>Schedule a Session</h3>

            {/* Select Date */}
            <label>Select Date:</label>
            <select onChange={handleDateChange} value={selectedDate}>
                <option value="">Select Date</option>
                {availability.map((slot) => (
                    <option key={slot.date} value={JSON.stringify({ date: new Date(slot.date).toISOString().split('T')[0], slots: slot.slots })}>
                        {new Date(slot.date).toISOString().split('T')[0]}  {/* Format date as YYYY-MM-DD */}
                    </option>
                ))}
            </select>

            {/* Select Slot */}
            {selectedDate && (
                <>
                    <label>Select Slot:</label>
                    <select onChange={(e) => setSelectedSlot(JSON.parse(e.target.value))} value={JSON.stringify(selectedSlot)}>
                        <option value="">Select Slot</option>
                        {availableSlots.map((slot) => (
                            <option key={slot.start} value={JSON.stringify({ start: slot.start, end: slot.end })}>
                                {slot.start} - {slot.end}  {/* Display start and end times */}
                            </option>
                        ))}
                    </select>
                </>
            )}

            {/* Session Duration */}
            <label>Session Duration (mins):</label>
            <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
            />

            {/* One-on-One Checkbox */}
            <label>One-on-One Session:</label>
            <input
                type="checkbox"
                checked={isOneOnOne}
                onChange={(e) => setIsOneOnOne(e.target.checked)}
            />

            {/* Select Attendees (Users except the selected user) */}
            <h4>Select Attendees</h4>
            <ul>
                {users
                    .filter((user) => user._id !== userId)  // Exclude the selected user
                    .map((user) => (
                        <li key={user._id}>
                            <span>{user.email}</span>
                            <button onClick={() => handleAddAttendee(user)}>Add</button>
                        </li>
                    ))}
            </ul>

            {/* Show selected attendees */}
            <h5>Selected Attendees:</h5>
            <ul>
                {attendees.map((attendee) => (
                    <li key={attendee._id}>
                        {attendee.email}
                        <button onClick={() => handleRemoveAttendee(attendee._id)}>Remove</button>
                    </li>
                ))}
            </ul>

            {/* Error message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Schedule Session Button */}
            <button onClick={handleSchedule}>Schedule Session</button>
        </div>
    );
};

export default ScheduleSession;
