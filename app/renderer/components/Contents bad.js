import React, { useState, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux';
const { previewDir } = require("../../utils/preview-dir")
const path = require('path');
import Albums1 from './Albums1';
import Albums2 from './Albums2';

function Contents() {

    const directories = useSelector(state => state.dirs)
    const dates = useSelector(state => state.dates)
    const searchedID = useSelector(state => state.searchedID)
    console.log(searchedID)
    const searchedName = useSelector(state => state.searchedName)
    const searchType = useSelector(state => state.searchType)

    const thumbs = useMemo(() => directories.map(dir => `file:${previewDir(dir)}`), [directories])
    const captions = useMemo(() => directories.map(dir => path.basename(dir, ".JPG")), [directories])

    const Title = () => (
        <>
            {directories.length !== 0 && <p style={{ color: '#bbc0c7', marginTop: 0, fontSize: 20, fontWeight: 'bold' }}>
                {(searchType === "byID") ? `검색 결과 (${directories.length}) : ${searchedID} ${searchedName}` : `날짜별 (${directories.length}) : ${dates[0]}`}
            </p>}
        </>
    )

    return (
        <>
            <Title />
            {(searchType === 'byID') && <Albums1 directories={directories} dates={dates} />}
            {(searchType === 'byDate') && <Albums2 ftpDirectories={thumbs} captions={captions} />}
        </>
    )
}

export default React.memo(Contents)