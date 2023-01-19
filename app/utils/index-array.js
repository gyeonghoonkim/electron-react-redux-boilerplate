// Array를 받아서 달라지는 index를 array로 반환한다.
exports.indexArray = (arr) => {
    const arr2 = arr.map((item, idx) => ((idx === 0) ? false : item !== arr[idx - 1]))

    const indexes = [];
    const groupedArray = [arr[0]];
    let index = arr2.indexOf(true);
    while (index !== -1) {
        indexes.push(index);
        groupedArray.push(arr[index])
        index = arr2.indexOf(true, index + 1);
    }
    return [indexes, groupedArray]
}