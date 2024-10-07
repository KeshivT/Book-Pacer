/*
const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const bucketName = 'bookpacer'; // Replace with your bucket name


// Upload a file
const uploadFile = (filePath) => {
  const fileName = filePath.split('/').pop();
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: 'test/' + fileName, // File name you want to save as in S3
    Body: fileContent
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file:', err);
      return;
    }
    console.log('File uploaded successfully:', data.Location);
  });
};

// Retrieve a file
const getFile = (key) => {
  const params = {
    Bucket: bucketName,
    Key: key
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.error('Error retrieving file:', err);
      return;
    }
    console.log('File retrieved successfully:', data.Body.toString());
  });
};

*/

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Specify the full path to `ebook-convert`
//const calibrePath = 'C:\\Program Files\\Calibre2\\ebook-convert.exe'; // Update this path based on where Calibre is installed

function convertEpubToTxt(epubFilePath, txtFilePath) {
    return new Promise((resolve, reject) => {
        const command = `ebook-convert ${epubFilePath} ${txtFilePath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error during conversion: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`Conversion stderr: ${stderr}`);
                return reject(new Error(stderr));
            }
            console.log(`Conversion stdout: ${stdout}`);
            resolve(txtFilePath);
        });
    });
}


// Function to read and log the content of the TXT file
function readTxtFile(txtFilePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(txtFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading TXT file: ${err.message}`);
                return reject(err);
            }
            console.log(`TXT file content:\n${data}`);
            resolve(data);
        });
    });
}

// Test the conversion and reading process
async function testConversion() {
    try {
        const epubFilePath = '"C:/Users/keshi/Downloads/The_Art_Of_War.pdf"'; // Replace with your EPUB file path
        const txtFilePath = 'C:/Users/keshi/Downloads/war.txt';

        console.log('Starting EPUB to TXT conversion...');
        await convertEpubToTxt(epubFilePath, txtFilePath);
        console.log('EPUB converted to TXT successfully.');

        console.log('Reading the converted TXT file...');
        await readTxtFile(txtFilePath);
        console.log('TXT file read successfully.');
    } catch (error) {
        console.error(`Test failed: ${error.message}`);
    }
}

// Run the test function
testConversion();
