import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Settings = () => {
    const [notify, setNotify] = useState(false);
    const [email, setEmail] = useState('');
    //const [password, setPassword] = useState('');
    //const [newPassword, setNewPassword] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleNotificationChange = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/notification`,
                { notify },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(response.data.message);
        } catch (err) {
            console.error(err);
            setError('Error updating notification preferences.');
        }
    };

    const handleEmailChange = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/user/email`,
                { newEmail: email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(response.data.message);
        } catch (err) {
            console.error(err);
            setError('Error updating email.');
        }
    };

    /*
    const handlePasswordChange = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:3000/user/password',
                { currentPassword: password, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(response.data.message);
        } catch (err) {
            console.error(err);
            setError('Error updating password.');
        }
    };
    */

    const handleReturn = () => {
        navigate('/main');
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6">Settings</h2>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-bold mb-2">Change Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mb-6 border rounded-md shadow-sm focus:outline-none focus:border-myBlue"
                            placeholder="Enter new email"
                        />
                        <button
                            onClick={handleEmailChange}
                            className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-900 transition duration-300 ease-in-out"
                        >
                            Update Email
                        </button>
                    </div>
                
                    <div className="mb-4">
                        <label htmlFor="notification" className="text-sm font-bold mb-2 px-4">Notify of unlocked chapters?</label>
                        <input
                            type="checkbox"
                            id="notify"
                            checked={notify}
                            onChange={(e) => setNotify(e.target.checked)}
                            className="mr-2 mb-6"
                        />
                        <button
                            onClick={handleNotificationChange}
                            className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-900 transition duration-300 ease-in-out" 
                        >
                            Update Notification Settings
                        </button>
                    </div>

                    <div>
                        {success ? (
                            <p className="text-green-500">{success}</p>
                        ) : (
                            <p className="text-red-500">{error}</p>
                        )}
                    </div>
                    
                <button
                onClick={handleReturn}
                className="w-full mt-6 bg-myPurple-400 text-white py-2 rounded-md hover:bg-myPurple-700 transition duration-300 ease-in-out" 
            >
                Return to Main Page
                </button>
            </div>
        </div>
    );

    /*
    
    <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-bold mb-2">Change Password</label>
                    <input
                        type="password"
                        id="oldpassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 mb-4 border rounded-md shadow-sm focus:outline-none focus:border-myBlue"
                        placeholder='Current Password'
                    />
                    <input
                        type="password"
                        id="newpassword"
                        value={password}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 mb-6 border rounded-md shadow-sm focus:outline-none focus:border-myBlue"
                        placeholder='New Password'
                    />
                    <button 
                        onClick={handlePasswordChange}
                        className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-900 transition duration-300 ease-in-out"
                    >
                        Update Password
                    </button>
                </div>

    return (
        <div className="settings-container">
            <h2>Settings</h2>
            <div>
                <h3>Change Email</h3>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter new email"
                />
                <button onClick={handleEmailChange}>Update Email</button>
            </div>

            <div>
                <h3>Change Password</h3>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Current password"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                />
                <button onClick={handlePasswordChange}>Update Password</button>
            </div>

            <div>
                <h3>Notification Preferences</h3>
                <label>
                    <input
                        type="checkbox"
                        checked={notify}
                        onChange={(e) => setNotify(e.target.checked)}
                    />
                    Notify me of unlocked chapters
                </label>
                <button onClick={handleNotificationChange}>Update Notification Settings</button>
            </div>
        </div>
    );
    
    return(
        <div className="flex justify-center items-center min-h-screen church-pattern">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="notif" className="block text-sm font-bold mb-2">Turn notifications on?</label>
                    <input
                        type="password"
                        id="password"
                        value={notif}
                        onChange={(e) => setNotif(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-myBlue"
                    />
                </div>
                {validationError && <p className="text-red-500 mb-4">{validationError}</p>}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}
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
    */
}

export default Settings;