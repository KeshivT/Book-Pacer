import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user's books on component mount
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/books`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const sortBooks = response.data.sort((a, b) => {
                    const now = Date.now();
                    const timeUntilUnlockA = Math.max(now - parseInt(a.unlockedDate) + parseInt(a.unlockWaitTime), 0);
                    const timeUntilUnlockB = Math.max(now - parseInt(b.unlockedDate) + parseInt(b.unlockWaitTimme), 0);
            
                    return timeUntilUnlockA - timeUntilUnlockB;
                });

                setBooks(sortBooks);
                setLoading(false);
            } catch (err) {
                setError('Failed to load books');
                setLoading(false);
                console.error('Error fetching books:', err);
            }
        };

        fetchBooks();
    }, []);

    const handleUpload = () => {
        // Redirect to the book upload page
        navigate('/upload');
    };

    const handleSettings = () => {
        navigate('/settings');
    };

    return(
        <div className="min-h-screen star-pattern p-8">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">My Books</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handleUpload}
                    className="bg-myPurple-100 text-myPurple-700 font-bold py-2 px-4 rounded-md mb-6 hover:bg-myPurple-300 transition duration-300 ease-in-out"
                >
                    Upload New Book
                </button>
                <button
                    onClick={handleSettings}
                    className="bg-myPurple-100 text-myPurple-700 font-bold py-2 px-4 rounded-md mb-6 hover:bg-myPurple-300 transition duration-300 ease-in-out"
                >
                    Settings
                </button>
            </div>
        <div>
            {loading ? (
                <p className="text-center text-white bg-gray-400 p-4 rounded">Loading books...</p>
            ) : books.length > 0 ? (
                <ul className = "space-y-4">
                    {books.map((book) => (
                        <li key={book._id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                            <span className="text-lg font-semibold text-purple-600">{book.title}</span>
                            <button
                                onClick={() => window.location.href = `/book/${book._id}`}
                                className="bg-myPurple-400 text-myBlue-800 font-semibold py-2 px-4 rounded-md hover:bg-myPurple-600 transition duration-300 ease-in-out"
                            >
                                View Book
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-myPurple-600 font-bold text-center bg-gray-300 p-4 rounded">No books uploaded.</p>
            )}
        </div>
        </div>
        </div>
    );
};

export default MainPage;
