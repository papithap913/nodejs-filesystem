const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const folderPath = path.join(__dirname, 'files');

// Ensure the folder exists
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}

// Endpoint to create a text file with the current timestamp
app.post('/create-file', (req, res) => {
    const timestamp = new Date().toISOString();
    const fileName = `${timestamp.replace(/[:.]/g, '-')}.txt`;
    const filePath = path.join(folderPath, fileName);

    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating file', error: err.message });
        }
        res.status(200).json({ message: 'File created successfully', fileName });
    });
});

// Endpoint to retrieve all text files in the folder
app.get('/list-files', (req, res) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading directory', error: err.message });
        }
        const textFiles = files.filter(file => file.endsWith('.txt'));
        res.status(200).json({ files: textFiles });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
