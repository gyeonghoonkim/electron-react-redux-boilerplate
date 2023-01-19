// csv-parse
exports.parse = (csv) => {
    const rows = csv.toString().split("\r\n");
    rows.shift()

    const results = []

    for (const i in rows) {
        const row = rows[i]
        const data = row.split(",")
        results.push(data)
    }

    const filtered_results = results.filter(arr => arr.length > 1);

    return filtered_results
}