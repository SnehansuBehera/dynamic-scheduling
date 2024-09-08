import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleSession from './SchedullingForm';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [availability, setAvailability] = useState([]);

    // Fetch all users except the admin
    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token'); // Auth token
            try {
                const response = await axios.get('http://localhost:5000/api/availability/users', {
                    headers: { Authorization: `${token}` }
                });
                console.log(response.data);
                setUsers(response.data);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        fetchUsers();
    }, []);

    // Fetch availability of the selected user
    const handleSelectUser = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5000/api/availability/${userId}/slot`, {
                headers: { Authorization: `${token}` }
            });
            setSelectedUser(userId);
            setAvailability(response.data);
            setOpen(!open);
            console.log(response.data);
        } catch (err) {
            console.error('Error fetching user availability:', err);
        }
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <h2>All Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        <button onClick={() => handleSelectUser(user._id)}>
                            {user.email}
                        </button>
                    </li>
                ))}
            </ul>

            {selectedUser && open && (
                <div>
                    <h2>User Availability</h2>
                    {availability.length > 0 ? (
                        <ScheduleSession availability={availability} userId={selectedUser} users={users} />
                    ) : (
                        <p>No availability found for this user</p>
                    )}
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
