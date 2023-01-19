import React, { useState, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux';
const { previewDir } = require("../../utils/preview-dir")
import FsLightbox from 'fslightbox-react';
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

    const sources = useMemo(() => directories.map(dir => `file:${dir}`), [directories])
    const thumbs = useMemo(() => directories.map(dir => `file:${previewDir(dir)}`), [directories])
    const captions = useMemo(() => directories.map(dir => path.basename(dir, ".JPG")), [directories])
    console.log(sources[0])
    console.log(thumbs[0])

    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1
    });

    function openLightboxOnSlide(number) {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: number
        });
    }

    const Title = () => (
        <>
            {directories.length !== 0 && <p style={{ color: '#bbc0c7', marginTop: 0, fontSize: 20, fontWeight: 'bold' }}>
                {(searchType === "byID") ? `검색 결과 (${directories.length}) : ${searchedID} ${searchedName}` : `날짜별 (${directories.length}) : ${dates[0]}`}
            </p>}
        </>
    )

    // width: 1228.5px; height: 816.822px; transform: rotate(-90deg); 같은 텍스트로부터 회전값을 얻어내는 함수
    const rotateParser = (text) => {
        if (text.includes("transform")) {
            return parseInt(text.split('rotate(')[1].split('deg')[0])
        } else {
            return 0
        }
    }

    return (
        <>
            <FsLightbox
                toggler={lightboxController.toggler}
                slide={lightboxController.slide}
                sources={sources}
                thumbs={thumbs}
                captions={captions}
                key={searchedID}
                exitFullscreenOnClose={true}
                showThumbsOnMount={true}
                customToolbarButtons={[
                    {
                        //https://github.com/vaadin/vaadin-icons/blob/master/iconset.html
                        viewBox: "0 0 16 16",
                        d: "M16 7v-4l-1.1 1.1c-1.3-2.5-3.9-4.1-6.9-4.1-4.4 0-8 3.6-8 8s3.6 8 8 8c2.4 0 4.6-1.1 6-2.8l-1.5-1.3c-1.1 1.3-2.7 2.1-4.5 2.1-3.3 0-6-2.7-6-6s2.7-6 6-6c2.4 0 4.5 1.5 5.5 3.5l-1.5 1.5h4z",
                        width: "16px",
                        height: "16px",
                        title: "Rotate Right",
                        onClick: function (instance) {
                            // console.log(instance.elements.sources[instance.stageIndexes.current].current.style.cssText)
                            const rotateDegree = rotateParser(instance.elements.sources[instance.stageIndexes.current].current.style.cssText) + 90
                            instance.elements.sources[instance.stageIndexes.current].current.style.transform = `rotate(${rotateDegree}deg)`
                        }
                    },
                    {
                        viewBox: "0 0 16 16",
                        d: "M8 0c-3 0-5.6 1.6-6.9 4.1l-1.1-1.1v4h4l-1.5-1.5c1-2 3.1-3.5 5.5-3.5 3.3 0 6 2.7 6 6s-2.7 6-6 6c-1.8 0-3.4-0.8-4.5-2.1l-1.5 1.3c1.4 1.7 3.6 2.8 6 2.8 4.4 0 8-3.6 8-8s-3.6-8-8-8z",
                        width: "16px",
                        height: "16px",
                        title: "Rotate Left",
                        onClick: function (instance) {
                            // console.log(instance.elements.sources[instance.stageIndexes.current].current.style.cssText)
                            const rotateDegree = rotateParser(instance.elements.sources[instance.stageIndexes.current].current.style.cssText) - 90
                            instance.elements.sources[instance.stageIndexes.current].current.style.transform = `rotate(${rotateDegree}deg)`
                        }
                    }

                ]}
            />

            <Title />
            {(searchType === 'byID') && <Albums1 directories={directories} dates={dates} openLightboxOnSlide={openLightboxOnSlide} />}
            {(searchType === 'byDate') && <Albums2 ftpDirectories={thumbs} captions={captions} openLightboxOnSlide={openLightboxOnSlide} />}

        </>
    )
}

export default React.memo(Contents)