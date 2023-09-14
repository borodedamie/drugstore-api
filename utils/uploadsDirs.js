const fs = require('fs').promises;
const path = require('path');

const baseDir = path.join(__dirname, '../', 'uploads');

exports.checkAndCreateFolder = async function (subDir) {
    try {
        // check if base folder exists
        await fs.stat(baseDir);
    } catch (error) {
        await fs.mkdir(baseDir);
    }

    // Define subdirectory path
    const subDirPath = path.join(baseDir, subDir);
    try {
        // check if subfolder exists
        await fs.stat(subDirPath);
    } catch (error) {
        await fs.mkdir(subDirPath);
    }

    console.log('Folders created!');
}
