import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const UploadBook = () => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [minT, setMinT] = useState(1);
    const [maxT, setMaxT] = useState(4);


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (!file || !title) {
            setError('Please provide both a title and a file.');
            return;
        }

        if (minT > maxT) {
            setError('Maximum unlock time must be higher than minimum unlock time.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('bookFile', file);
        formData.append('minT', minT);
        formData.append('maxT', maxT);


        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/uploadBook`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 201) {
                setLoading(false);
                setSuccess('Book uploaded successfully!');
            }
        } catch (err) {
            setLoading(false);
            setError('Failed to upload book. Please try again.');
            console.error('Upload error:', err);
        }
    };

    const handleGoBack = () => {
        navigate('/main');
    };

    return (
        <div className="min-h-screen star-pattern p-8">
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Upload a New Book</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block font-medium">Book Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border border-myPurple-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-myPurple-300"
                    />
                </div>
                <div>
                    <label htmlFor="file" className="block font-medium">Book File (EPUB, PDF, HTML, AZW, TXT)</label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        accept=".epub,.pdf,.html,.azw,.txt"
                        required
                        className="w-full p-2 border border-myPurple-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-myPurple-300"
                    />
                </div>
                <div>
                    <label htmlFor="minT" className="block font-medium">Minimum Unlock Time (Days)</label>
                    <input
                        type="range"
                        min="1"
                        max="14"
                        value={minT}
                        class="slider"
                        id="minT"
                        onChange={(e) => setMinT(e.target.value)}
                        className="w-full"
                    />
                    <span>{minT} day(s)</span>
                    <label htmlFor="maxT" className="block font-medium">Maximum Unlock Time (Days)</label>
                    <input
                        type="range"
                        min="1"
                        max="14"
                        value={maxT}
                        class="slider"
                        id="maxT"
                        onChange={(e) => setMaxT(e.target.value)}
                        className="w-full"
                        
                    />
                    <span>{maxT} day(s)</span>
                </div>
                <div>
                    {loading ? (
                        <p className="text-gray-500">Uploading book...</p>
                    ) : success ? (
                        <p className="text-green-500">{success}</p>
                    ) : (
                        <p className="text-red-500">{error}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-myPurple-600 text-white py-2 px-4 rounded-lg hover:bg-myPurple-700 transition duration-300"
                >
                    Upload
                </button>
            </form>
            <br />
            <button
                onClick={handleGoBack}
                className="mt-4 bg-myPurple-600 text-white py-2 px-4 rounded-lg hover:bg-myPurple-700 transition duration-300"
            >
                Return to Book List
            </button>
        </div>
    </div>
    );
};

export default UploadBook;