// const path = require('path');
const fs = require('fs');

exports.download = (source_dirs, target_dir) => {
    
    const source_dir = '//172.23.123.138/e/DermaView/test.JPG'

    console.log(fs.existsSync(source_dir))
    const destination_dir = "C:/Users/gyeonghoon/Desktop/new.JPG"

    fs.copyFile(source_dir, destination_dir, (err) => {
        if (err) throw err;
        console.log('Copied successfully');
    });

}