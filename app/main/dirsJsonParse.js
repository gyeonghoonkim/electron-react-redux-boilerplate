const fs = require('fs');

exports.dirsJsonParse = () => {
    const dirsJson = fs.readFileSync('//172.23.123.138/e/DermaView/dirs.json')
    const parsedDirs = JSON.parse(dirsJson)
    return parsedDirs
}