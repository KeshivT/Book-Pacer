import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


axios.defaults.baseURL = `${process.env.REACT_APP_API_URL}`;

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [notification, setNotification] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (username.length < 3) {
            setValidationError('Username must be at least 3 characters long.');
            return false;
        }
        if (password.length < 6) {
            setValidationError('Password must be at least 6 characters long.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setValidationError(null);
        setSuccess(null);
        setLoading(true);

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, {
                username,
                password,
                email,
                notification
            });
            if (response.data.message === 'User created successfully') {
                console.log('Signup successful');
                setSuccess('Signup successful');
                // Redirect to login or another page
            }
        } catch (err) {
            setError('Signup failed. Username may already be taken.');
            console.error('Signup error:', err);
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
                username,
                password,
            });

            if (response.data.token) {
                console.log('Login successful');
                localStorage.setItem('token', response.data.token); // Save token to local storage
                // Redirect to the main page (replace with actual route)
                navigate('/main');
            }
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error('Login error:', err);
        }
    };

    return(
        <div className="flex justify-center items-center min-h-screen church-pattern">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-bold mb-2">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-myBlue"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-bold mb-2">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-myBlue"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-bold mb-2">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-myBlue"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="notification" className="text-sm font-bold mb-2 px-4">Enable email notifications for chapter updates?</label>
                    <input
                        type="checkbox"
                        id="notification"
                        checked={notification}
                        onChange={(e) => setNotification(e.target.checked)}
                        className="mr-2"
                    />
                </div>
                <div>
                    {loading ? (
                        <p className="text-gray-500">Signing up...</p>
                    ) : error ? (
                    <p className="text-red-500 mb-4">{error}</p>
                    ) : validationError ? (
                        <p className="text-red-500 mb-4">{validationError}</p>
                    ) : (
                        <p className="text-green-600 mb-4">{success}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-myBlue-400 text-white py-2 rounded-md hover:bg-myBlue-700 transition duration-300 ease-in-out"
                >
                    Sign Up
                </button>
            </form>
            <p className="mt-4 text-gray-600">
                Already have an account?{' '}
                    <Link to="/" className="text-myBlue hover:underline">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
