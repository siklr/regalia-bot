const fs = require('fs').promises;
const path = require('path');

module.exports = async function getFiles(dirPath, fileType) {    
    try {
        const files = await fs.readdir(dirPath);
        const filteredFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ext === `.${fileType.toLowerCase()}`;
        });

        return filteredFiles;
    } catch (error) {
        console.error(error);
    }
}
