const path = require('path');
const fs = require('fs');

exports.getFilesInDir = (folderArray) => {

    const year = folderArray[0]
    const month = folderArray[1]
    const day = folderArray[2]

    const files = fs.readdirSync(`//172.23.123.138/e/DermaView/NEW-MEDICAL PHOTO/${year}/${month}/${day}/`)

    const directories = files.map((file, idx) => `\\\\172.23.123.138\\e\\NEW-MEDICAL PHOTO\\${year}\\${month}\\${day}\\${file}`)

    // console.log(directories)

    return [Array(directories.length).fill(day), directories, "ID", "name"]

}