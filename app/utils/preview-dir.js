exports.previewDir = (dir) => {
    const dirArray = dir.split('\\')
    dirArray[3] = "e\\DermaView"

    return dirArray.join("\\")
}