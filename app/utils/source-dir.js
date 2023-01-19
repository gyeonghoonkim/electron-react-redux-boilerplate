exports.sourceDir = (dir) => {
    const dirArray = dir.split('\\')

    return dirArray.filter(x => x !== "DermaView").join('\\')
}