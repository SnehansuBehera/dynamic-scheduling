import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [variant, setVariant] = useState('LOGIN');
    const toggleVariant = () => {
        if (variant === 'LOGIN') {
            setVariant("REGISTER");
        } else {
            setVariant("LOGIN")
        }

    }
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if (variant === 'LOGIN') {
                const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('User', JSON.stringify(response.data.user));
                console.log(response.data.user);
                if (response.data.user.isAdmin) {
                    navigate('/admin/dashboard');
                } else {
                    navigate(`/dashboard/${response.data.user._id}`);
                }

            } else {
                const response = await axios.post('http://localhost:5000/api/auth/register', { email, password });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('User', response.data.user);
                navigate('/dashboard');
            }

        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">{variant === 'LOGIN' ? "Login" : "Register"}</button>
            </form>
            <p>{variant === 'LOGIN' ? "New User?" : "Already have account?"}</p>
            <p onClick={toggleVariant}>{variant === 'LOGIN' ? "Register" : "Login"}</p>
        </div>
    );
};

export default Login;
