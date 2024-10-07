//import logo from './logo.svg';
//import './App.css';
import './index.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import BookView from './components/BookView';
import UploadBook from './components/UploadBook';
import ChapterView from './components/ChapterView';
import MainPage from './components/MainPage';
import Settings from './components/Settings';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/book/:bookId" element={<BookView />} />
        <Route path="/upload" element={<UploadBook />} />
        <Route path="/books/:bookId/chapters/:chapterIndex" element={<ChapterView />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
