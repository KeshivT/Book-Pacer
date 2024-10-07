import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BookView = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [canUnlock, setCanUnlock] = useState(false);
    //const [unlockWaitTime, setUnlockWaitTime] = useState(null);
    const [chapter, setChapter] = useState(null);

    useEffect(() => {
        // Fetch book details and its chapters
        const fetchBook = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('User not authenticated');
                    return;
                }
                const response = await axios.get(`http://localhost:3000/books/${bookId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setBook(response.data);

                if (response.data.lastUnlockedChapter !== undefined) {
                    const chapterResponse = await axios.get(`http://localhost:3000/books/${bookId}/chapters/${(response.data.lastUnlockedChapter + 1)}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                
                    setChapter(chapterResponse.data);

                    //const lastUnlockDate = new Date(response.data.unlockedDate);
                    const unlockTime = new Date(chapterResponse.data.unlockTime);
                    //const waitTime = response.data.unlockWaitTime || (24 * 60 * 60 * 1000);
                    //setUnlockWaitTime(waitTime);
                    checkUnlockTime(unlockTime);
                } else {
                    setError('No last unlocked chpter data available');
                }
            } catch (err) {
                setError('Failed to load book details');
                console.error('Error fetching book:', err);
            }
        };

        const checkUnlockTime = (unlockTime) => {
            const timeNow = new Date();
            //const timeElapsed = timeNow - lastUnlockDate;

            if (timeNow >= unlockTime) {
                setCanUnlock(true);
            } else {
                setCanUnlock(false);
            }
        };

        fetchBook();

        const intervalId = setInterval(() => {
            if (book) {
                checkUnlockTime(new Date(chapter.unlockTime));
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [bookId, book]);

    const handleUnlock = async () => {
        if (book.lastUnlockedChapter >= book.chapters.length - 1) {
            alert('No more chapters to unlock.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:3000/unlockChapter',
                { bookId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Response from unlock endpoint:", response.data);
            alert('Chapter unlocked!');

            //setUnlockWaitTime(response.data.unlockWaitTime);
            //setCanUnlock(false);
            setBook({ ...book, lastUnlockedChapter: book.lastUnlockedChapter + 1});

            const chapterResponse = await axios.get(`http://localhost:3000/books/${bookId}/chapters/${book.lastUnlockedChapter + 1}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setChapter(chapterResponse.data);
            //const updatedChapter = response.data.chapter;
        } catch (err) {
            console.error('Error unlocking chapter:', err);
            alert('Failed to unlock chapter.');
        }
    };

    const handleChapterClick = async (index) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:3000/readChapter',
                { bookId, index },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
        } catch (err) {
            console.error('Error marking read chapter:', err);
        }
        navigate(`/books/${bookId}/chapters/${index}`);
    };

    const handleReturn = () => {
        navigate('/main');
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen church-pattern">
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">
                {book ? book.title : 'Loading...'}
            </h2>
    
            <button 
                onClick={handleReturn} 
                className="bg-myBlue-200 hover:bg-myBlue-300 text-black font-semibold py-2 px-4 rounded mb-4"
            >
                Return to Book List
            </button>
                {book && book.chapters.length > 0 ? (
                    <ul className="space-y-2">
                        {book.chapters.map((chapter, index) => (
                            <li key={index} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                                <span className={`text-lg font-semibold ${index > book.lastUnlockedChapter ? 'text-gray-400' : index < book.lastReadChapter ? 'text-myPurple-400' : 'text-myBlue-400'}`}>{index > book.lastUnlockedChapter ? `Chapter ${index + 1} (Locked)` : `Chapter ${index + 1}`}</span>
                                <button 
                                    onClick={() => handleChapterClick(index + 1)}
                                    disabled={index > book.lastUnlockedChapter}
                                    className={`font-semibold py-2 px-4 rounded-md ${index > book.lastUnlockedChapter ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : index < book.lastReadChapter ? 'bg-myPurple-300 hover:bg-myPurple-500' : 'bg-myBlue-200 hover:bg-myBlue-300 text-black'}`}
                                >
                                    View Chapter
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-myPurple-700">No chapters available.</p>
                )}    
            <button 
                onClick={handleUnlock}
                disabled={!canUnlock || book.lastUnlockedChapter >= book.chapters.length - 1}
                className={`mt-4 w-full py-2 px-4 rounded text-white font-semibold ${!canUnlock || book.lastUnlockedChapter >= book.chapters.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-myBlue-300 hover:bg-myBlue-400'}`}
            >
                {canUnlock ? 'Unlock Next Chapter' : 'Next Chapter Locked'}
            </button>
        </div>
        </div>
    );
    
};

export default BookView;
