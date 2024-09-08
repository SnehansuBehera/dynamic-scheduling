import React, { useState } from 'react';
import axios from 'axios';

const SetAvailability = () => {
    const [availability, setAvailability] = useState([
        { date: '', slots: [{ start: '', end: '' }] },
    ]);

    const handleAddSlot = (index) => {
        const newAvailability = [...availability];
        newAvailability[index].slots.push({ start: '', end: '' });
        setAvailability(newAvailability);
    };

    const handleAddDate = () => {
        setAvailability([...availability, { date: '', slots: [{ start: '', end: '' }] }]);
    };

    const handleDateChange = (index, value) => {
        const newAvailability = [...availability];
        newAvailability[index].date = value;
        setAvailability(newAvailability);
    };

    const handleSlotChange = (dateIndex, slotIndex, field, value) => {
        const newAvailability = [...availability];
        newAvailability[dateIndex].slots[slotIndex][field] = value;
        setAvailability(newAvailability);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('User'));

            // Check if the token exists
            if (!token) {
                throw new Error('No authentication token found. Please log in.');
            }
            console.log(availability);
            // Make the API request
            const response = await axios.post(
                `http://localhost:5000/api/availability/set/${user._id}`,
                { availability },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Availability submitted successfully:', response.data);
        } catch (err) {
            // Log the error to the console
            console.error('Error submitting availability:', err);

            // Optionally show a user-friendly message (e.g., in a notification or an alert)
            alert('An error occurred while submitting availability. Please try again.');
        }
    };


    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Set Your Availability</h2>
            <form onSubmit={handleSubmit}>
                {availability.map((dateAvailability, dateIndex) => (
                    <div key={dateIndex} className="mb-6">
                        <label className="block mb-2">Date</label>
                        <input
                            type="date"
                            value={dateAvailability.date}
                            onChange={(e) => handleDateChange(dateIndex, e.target.value)}
                            className="border border-gray-300 p-2 rounded mb-4 w-full"
                        />

                        {dateAvailability.slots.map((slot, slotIndex) => (
                            <div key={slotIndex} className="mb-4">
                                <div className="flex gap-4">
                                    <div>
                                        <label className="block mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            value={slot.start}
                                            onChange={(e) =>
                                                handleSlotChange(dateIndex, slotIndex, 'start', e.target.value)
                                            }
                                            className="border border-gray-300 p-2 rounded w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1">End Time</label>
                                        <input
                                            type="time"
                                            value={slot.end}
                                            onChange={(e) =>
                                                handleSlotChange(dateIndex, slotIndex, 'end', e.target.value)
                                            }
                                            className="border border-gray-300 p-2 rounded w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => handleAddSlot(dateIndex)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Add Another Slot
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddDate}
                    className="bg-green-500 text-white px-4 py-2 rounded mb-6"
                >
                    Add Another Date
                </button>

                <button type="submit" className="bg-indigo-500 text-white px-6 py-2 rounded">
                    Submit Availability
                </button>
            </form>
        </div>
    );
};

export default SetAvailability;
