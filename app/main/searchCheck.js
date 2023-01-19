const fs = require('fs');
const path = require('path');

exports.searchCheck = (patientId) => {

    console.log("searchCheck backend called")

    let status = "default"

    const trimmedId = patientId.trim()

    if ((!isNaN(trimmedId) && !isNaN(parseFloat(trimmedId))) === false) {
        status = "notNumber"
    } else if (trimmedId.toString().length !== 8) {
        status = "not8"
    } else if (!fs.existsSync(`//172.23.123.138/e/DermaView/ID/${trimmedId}/dirs.csv`)) {
        status = "notExist"
    } else {
        status = "ok"
    }

    return status
}