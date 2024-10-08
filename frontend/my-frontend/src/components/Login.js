import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

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

    return (
        <div className="flex justify-center items-center min-h-screen star-pattern">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-bold mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-purple-500"
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
                            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <div>
                        {loading ? (
                            <p className="text-gray-500">Logging in...</p>
                        ) : error ? (
                        <p className="text-red-500 mb-4">{error}</p>
                        ) : (
                            <p></p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-myPurple-600 text-white py-2 rounded-md hover:bg-myPurple-800 focus:outline-none focus:ring focus:ring-purple-light transition duration-300 ease-in-out"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-myPurple-700 hover:underline">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
