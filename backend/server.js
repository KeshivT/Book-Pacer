// backend/server.js

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const epub2 = require('epub2')
const pdfParse = require('pdf-parse');
const fs = require('fs');
const fileType = require('file-type');
const { PDFDocument } = require('pdf-lib');
const Book = require('./models/Book');
const User = require('./models/User');
const Chapter = require('./models/Chapter');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 3000;
const secretKey = process.env.JWT_SECRET || 'keshivsecretkey';  // Replace with a secure key

app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

const users = [];
const saltRounds = 10;

const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || "mongodb+srv://keshivt:1029384756abc@bookpacer.epmgo.mongodb.net/BookPacer?retryWrites=true&w=majority";

// Set up default mongoose connection with increased timeout and logging
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,  // Increase the timeout to 30 seconds
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});

app.post('/signup',
    body('username').trim().isLength({ min: 3 }).escape(),
    body('password').isLength({ min: 6 }).escape(),
    body('email').isLength({ min: 4 }).escape(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation Error:', errors.array());  // Log validation errors
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, email, notification } = req.body;

        try {
            // Check if the username is already taken
            console.log('Checking if user exists:', username);
            const userExists = await User.findOne({ username });
            if (userExists) {
                console.error('User already exists:', username);
                return res.status(400).json({ message: 'Username already taken' });
            }

            console.log('Checking if user exists:', email);
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                console.error('User already exists:', email);
                return res.status(400).json({ message: 'Email already used' });
            }

            // Create a new user instance
            console.log('Hashing password for user:', username);
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = new User({ username, password: hashedPassword, email, notification });

            // Save the user to the database
            console.log('Saving new user to database:', username);
            await newUser.save();

            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Signup Error:', error);  // Log the exact error
            res.status(500).json({ message: 'Error creating user' });
        }
    }
);


// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        //const user = users.find(user => user.username === username);
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        //const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
        const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch(error) {
        res.status(500).json({message: 'Error during login', error});
    }
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        //req.user = user;
        req.user = { id: user.id, username: user.username };
        next();
    });
}

// Example of a protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


//const upload = multer({ dest: 'uploads/' }); // Specify the folder for file storage

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

/*
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'bookpacer',
        acl: 'public-read', //DOUBLE CHECK
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, `books/${Date.now().toString()}-${file.originalname}`);
        }
    })
})
*/

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { exec } = require('child_process');
const path = require('path');

// Conversion function using Calibre's ebook-convert tool
async function convertToText(inputFilePath, outputFilePath) {
    return new Promise((resolve, reject) => {
        const command = `ebook-convert ${inputFilePath} ${outputFilePath} --chapter-mark="both"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Conversion error: ${stderr}`);
                reject(error);
            } else {
                console.log(`Conversion successful: ${stdout}`);
                resolve();
            }
        });
    });
}

// Modify the uploadBook route to integrate conversion
app.post('/uploadBook', authenticateToken, upload.single('bookFile'), async (req, res) => {
    try {
        const { title, minT, maxT } = req.body;
        const userId = req.user.id || req.user._id;
        const fileContent = req.file.buffer;
        const originalFileName = req.file.originalname;
        const tempFilePath = path.join(__dirname, 'tmp', `${Date.now().toString()}-${originalFileName}`);
        const tempDir = path.dirname(tempFilePath);

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Save the uploaded file to the temp directory
        fs.writeFileSync(tempFilePath, fileContent);

        let chaptersContent = [];
        let convertedFileName = `${Date.now().toString()}-converted.txt`;
        const convertedFilePath = path.join(__dirname, 'tmp', convertedFileName);

        const type = await fileType.fromBuffer(fileContent);
        if (!type) {
            return res.status(400).jsonn({ message: 'Could not determine file type' });
        }

        const detectedFileType = type.ext;
        console.log('Detected File Type:', detectedFileType);

        try {
            console.log(`Converting ${detectedFileType} to TXT...`);
            await convertToText(tempFilePath, convertedFilePath);
            console.log('Conversion successful.');

            const rawText = fs.readFileSync(convertedFilePath, 'utf-8');

            let chapterIndex = 1;
            chaptersContent = rawText.split(/\* \* \*/).map((chapterText) => {
                const trimmedContent = chapterText.trim();

                if (!trimmedContent || isNonChapterContent(trimmedContent)) {
                    return null;
                }

                return {
                    title: `Chapter ${chapterIndex++}`,
                    content: trimmedContent
                };
            }).filter(chapter => chapter !== null);

            function isNonChapterContent(content) {
                const lowerContent = content.toLowerCase();
                const commonNonChapterWords = ['table of contents', 'foreword', 'copyright', 'about the author', 'dedication', 'title page', 'published', 'fandoms'];

                return commonNonChapterWords.some(word => lowerContent.includes(word));
            }

            if (chaptersContent.length === 0 || chaptersContent.length === 1) {
                console.log("Only one chapter found. Applying manual split.");

                const manualChapters = rawText.split(/\n\s*\n/).map((chunk, index) => ({
                    title: `Chapter ${index + 1}`,
                    content: chunk.trim(),
                    index: index + 1
                })).filter(chapter => chapter.content.length > 0);

                if (manualChapters.length > 1) {
                    chaptersContent = manualChapters;
                }
            }

            /*
            chaptersContent = rawText.split(/\* \* \*!/).map((chapterText, index) => ({
                title: `Chapter ${index + 1}`,
                content: chapterText.trim(),
                index: index + 1
            })).filter(chapter => chapter.content.length > 0);
            */
            
        } catch (err) {
            console.error(`${detectedFileType.toUpperCase()} processing error:`, err);
            return res.status(500).json({ message: `Failed to process ${detectedFileType} file`, error: err.message });
        } finally {
            fs.unlinkSync(tempFilePath);
            fs.unlinkSync(convertedFilePath);
        }

        if (chaptersContent.length === 0) {
            return res.status(400).json({ message: 'No valid chapters found in the file' });
        }
        

        const txtBuffer = Buffer.from(chaptersContent.map(c => c.content).join('\n\n'), 'utf-8');
        const params = {
            Bucket: 'bookpacer',
            Key: `books/${convertedFileName}`,
            Body: txtBuffer,
        };

        const s3Response = await s3.upload(params).promise();
        console.log('Uploaded to S3:', s3Response.Location);

        const getRandomUnlockTime = () => {
            const minTime = minT * 24 * 60 * 60 * 1000;
            const maxTime = maxT * 24 * 60 * 60 * 1000;
            return (Math.floor(Math.random() * (maxTime - minTime + 1) + minTime));
        }

        //const unlockWaitTime = getRandomUnlockTime();

        const totalChapters = chaptersContent.length;
        const unlockLimit = Math.ceil(totalChapters * 0.1);

        const newBook = new Book({
            title,
            userId,
            chapters: [],
            filePath: s3Response.Location,
            format: 'txt',
            lastUnlockedChapter: unlockLimit,
            unlockedDate: Date.now(),
            minT,
            maxT,
            /*unlockWaitTime*/
        });

        await newBook.save();
        console.log('Book updated');

        let lastUnlockTime = new Date();


        const chapterIds = await Promise.all(chaptersContent.map(async (chapterContent, index) => {
            const isLocked = index >= unlockLimit;

            console.log(lastUnlockTime);

            if (isLocked) {
                const randomTime = getRandomUnlockTime();
                //lastUnlockTime = lastUnlockTime + randomTime;
                lastUnlockTime.setTime(lastUnlockTime.getTime() + randomTime);
            }

            const unlockTime = new Date(lastUnlockTime);

            console.log(`For chapter ${index + 1}, the unlock time is ${unlockTime}.`);

            const newChapter = new Chapter({
                title: chapterContent.title,
                content: chapterContent.content,
                index: index + 1,
                book: newBook._id,
                locked: isLocked,
                unlockTime: unlockTime
            });
            await newChapter.save();
            return newChapter._id;
        }));

        console.log('Chapter updated');

        newBook.chapters = chapterIds;

        await newBook.save();
        console.log('Book successfully saved to database.');

        await User.findByIdAndUpdate(userId, { $push: { books: newBook._id } });
        console.log('User book list updated.');

        res.status(201).json({ message: 'Book uploaded successfully', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload book', error });
    }
});




app.get('/books', authenticateToken, async (req, res) => {
    try {
        const books = await Book.find({ userId: req.user.id }).populate('chapters');
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch books', error });
    }
});

app.get('/books/:id', authenticateToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book || book.userId.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch book details', error });
    }
});

app.get('/books/:bookId/chapters/:chapterIndex', authenticateToken, async (req, res) => {
    try {
        const { bookId, chapterIndex } = req.params;

        const chapter = await Chapter.findOne({ book: bookId, index: chapterIndex });

        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        res.json(chapter);
    } catch (error) {
        console.error('Failed to fetch chapter content:', error);
        res.status(500).json({ message: 'Failed to fetch chapter content', error: error.message });
    }

});

app.post('/unlockChapter', authenticateToken, async (req, res) => {
    try {
        const bookId = req.body.bookId;
        console.log("Unlocking chapter for bookId:", bookId);
        const book = await Book.findById(bookId);

        if (!book) {
            console.log('Book not found');
            return res.status(404).json({ message: 'Book not found' });
        }

        console.log("Found book:", book);

        const timeNow = new Date();

        const nextChapterIndex = book.lastUnlockedChapter + 1;
        console.log("Next chapter index:", nextChapterIndex);
        const nextChapter = await Chapter.findOne({
            book: bookId,
            index: nextChapterIndex,
            locked: true
        });

        if (!nextChapter) {
            console.log("No more chapters to unlock or chapter not found");
            return res.status(404).json({ message: 'No more chapters to unlock.' });
        }

        nextChapter.locked = false;
        await nextChapter.save();

        console.log("Unlocking chapter:", nextChapterIndex);


        /*
        const getRandomUnlockTime = () => {
            const minTime = 24 * 60 * 60 * 1000;
            const maxTime = 4 * 24 * 60 * 60 * 1000;
            return Math.floor(Math.random() * (maxTime - minTime + 1) + minTime);
        }

        const unlockWaitTime = getRandomUnlockTime();
        */

        book.lastUnlockedChapter = nextChapterIndex;
        book.unlockedDate = timeNow;
        //book.unlockWaitTime = unlockWaitTime;
        await book.save();

        res.status(200).json({
            message: 'Chapter unlocked',
            chapter: nextChapter
        });

        console.log("Successfully unlocked chapter:", nextChapter);
    } catch (error) {
        res.status(500).json({ message: 'Error unlocking chapter', error });
    }
});

app.post('/readChapter', authenticateToken, async (req, res) => {
    try {
        const bookId = req.body.bookId;
        const book = await Book.findById(bookId);
        const chapterIndex = req.body.index;

        const chapter = await Chapter.findOne({
            book: bookId,
            index: chapterIndex,
        });

        chapter.read = true;
        chapter.save();

        if (book.lastReadChapter < chapterIndex)
        {
            book.lastReadChapter = chapterIndex;
        }
        await book.save();

        res.status(200).json({ message: 'Chapter read' });
    } catch (error) {
        res.status(500).json({ message: 'Error unlocking chapter', error });
    }   
});

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
        user: 'paceyourself@bookpacer.com',
        pass: '1029384756Abc!',
    },
});

cron.schedule('* * * * *', async () => {
    const users = await User.find({ notification: true });
    for (const user of users) {
        const books = await Book.find({ userId: user._id });
        for (const book of books) {
            const nextChapter = await Chapter.findOne({ book: book._id, locked: true, notified: false });
            if (nextChapter && nextChapter.unlockTime <= new Date()) {
                console.log('Unlockable chapter found!')
                const mailOptions = {
                    from: 'paceyourself@bookpacer.com',
                    to: user.email,
                    subject: `A new chapter of ${book.title} is ready to unlock!`,
                    text: `The next chapter of ${book.title} is available to be unlocked. Check it out at bookpacer.com!`,
                };
                if (!nextChapter) {
                    console.log(`No chapter found for book ${book.title}`);
                } else {
                    console.log(`Found chapter ${nextChapter.index} for book ${book.title}`);
                }
                transporter.sendMail(mailOptions).then(() => {
                    console.log(`Email sent to ${user.email} for ${book.title}`);
                }).catch((error) => {
                    console.error(`Failed to send email: ${error}`);
                });
                nextChapter.notified = true;
                await nextChapter.save();
                console.log('Mail sent.')
            }
        }
    }
});

app.put('/user/notification', authenticateToken, async (req, res) => {
    try {
        const { notify } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.notification = notify;
        await user.save();

        res.status(200).json({ message: 'Notification preferences updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification preferences', error });
    }
});

app.put('/user/email', authenticateToken, async (req, res) => {
    try {
        const { newEmail } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.email = newEmail;
        await user.save();

        res.status(200).json({ message: 'Email address updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating email address', error });
    }
});

/*
app.put('/user/password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error });
    }
});
*/