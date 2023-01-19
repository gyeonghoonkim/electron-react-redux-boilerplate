// index-array의 결과를 받아서 array를 같은 값을 가진 것들로 묶는다.
exports.divideArray = (indexes, arr) => {

    const arrays = []
    arrays.push(arr.slice(0, indexes[0]))
    for (var i = 0; i < indexes.length; i++) {
        if (i > 0) {
            arrays.push(arr.slice(indexes[i - 1], indexes[i]))
        }
    }
    arrays.push(arr.slice(indexes[indexes.length - 1]))

    const results = (indexes.length === 0) ? [arr] : arrays

    return results
}