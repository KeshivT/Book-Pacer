import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChapterView = () => {
    const { bookId, chapterIndex } = useParams(); // Extract bookId and chapterIndex from URL
    const [chapter, setChapter] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [totalChapters, setTotalChapters] = useState(0);
    const [nextChapterLocked, setNextChapterLocked] = useState(false);

    useEffect(() => {
        const fetchChapter = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/books/${bookId}/chapters/${chapterIndex}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setChapter(response.data);

                const bookResponse = await axios.get(`${process.env.REACT_APP_API_URL}/books/${bookId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const fetchedBook = bookResponse.data;

                if (fetchedBook && fetchedBook.chapters) {
                    setTotalChapters(fetchedBook.chapters.length);
                }

                const nextChapter = parseInt(chapterIndex) + 1;
                if (nextChapter <= (fetchedBook.lastUnlockedChapter + 1)) {
                    setNextChapterLocked(false);
                } else {
                    setNextChapterLocked(true);
                }
            } catch (err) {
                setError('Failed to load chapter');
                console.error('Error fetching chapter:', err);
            }
        };

        fetchChapter();
    }, [bookId, chapterIndex]);

    const handlePrevious = () => {
        if (parseInt(chapterIndex) > 1) {
            navigate(`/books/${bookId}/chapters/${parseInt(chapterIndex) - 1}`);
        }
    };

    const handleNext = async () => {
        const nextChapter = parseInt(chapterIndex) + 1;
        const index = nextChapter;
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.REACT_APP_API_URL}/readChapter`,
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

        if ((nextChapter <= totalChapters) && !nextChapterLocked) {
            navigate(`/books/${bookId}/chapters/${nextChapter}`);
            window.scrollTo(0, 0);
        } else {
            console.log('Next chapter is locked.');
        }
    };

    const handleList = () => {
        navigate(`/book/${bookId}`);
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-myPurple-700">
        <div className="container mx-auto p-4">
            {chapter ? (
                <>
                    {/* Chapter Title */}
                    <h2 className="text-3xl font-bold text-white mb-6">
                        {chapter.title}
                    </h2>
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mb-4">
                        <button 
                            onClick={handlePrevious}
                            disabled={parseInt(chapterIndex) <= 1}
                            className={`py-2 px-4 rounded ${parseInt(chapterIndex) <= 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-myBlue-300 hover:bg-myBlue-500 text-white'}`}
                        >
                            Previous Chapter
                        </button>
                        <button 
                            onClick={handleList}
                            className="bg-myBlue-300 hover:bg-myBlue-500 text-white py-2 px-4 rounded"
                        >
                            Chapter List
                        </button>
                        <button 
                            onClick={handleNext} 
                            disabled={parseInt(chapterIndex) >= totalChapters || nextChapterLocked}
                            className={`py-2 px-4 rounded ${nextChapterLocked ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-myBlue-300 hover:bg-myBlue-500 text-white'}`}
                        >
                            {nextChapterLocked ? 'Next Chapter (Locked)' : 'Next Chapter'}
                        </button>
                    </div>
    
                    {/* Chapter Content */}
                    <div className="bg-[#faecd4] p-6 rounded-lg shadow-lg leading-relaxed">
                        {/* Render chapter content with paragraph breaks */}
                        {chapter.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4 text-md text-myBlue-700 whitespace-pre-line">
                                {paragraph.trim()}
                            </p>
                        ))}
                    </div>
    
                    {/* Bottom Navigation Buttons */}
                    <div className="flex justify-between items-center mt-6">
                        <button 
                            onClick={handlePrevious}
                            disabled={parseInt(chapterIndex) <= 1}
                            className={`py-2 px-4 rounded ${parseInt(chapterIndex) <= 1 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-myBlue-300 hover:bg-myBlue-500 text-white'}`}
                        >
                            Previous Chapter
                        </button>
    
                        <button 
                            onClick={handleNext} 
                            disabled={parseInt(chapterIndex) >= totalChapters || nextChapterLocked}
                            className={`py-2 px-4 rounded ${nextChapterLocked ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-myBlue-300 hover:bg-myBlue-500 text-white'}`}
                        >
                            {nextChapterLocked ? 'Next Chapter (Locked)' : 'Next Chapter'}
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-myBrown-700">Loading chapter...</p>
            )}
        </div>
        </div>
    );
    
};

export default ChapterView;
