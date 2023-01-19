// ID로 검색했을 때 날짜별로 보여주는 Album

import React, { useState, useMemo, useRef, useEffect } from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
const { previewDir } = require("../../utils/preview-dir")
const path = require('path');
const { divideArray } = require("../../utils/divide-array")
const { indexArray } = require("../../utils/index-array")
import Divider from '@mui/material/Divider';
import AspectRatio from '@mui/joy/AspectRatio';
import { LazyLoadImage, trackWindowScroll } from "react-lazy-load-image-component";
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectImage } from '../redux/reducer';
import MyLightBox from './Lightbox';

const ImageContainer = styled.div`
    padding: 2px;
    background-color: ${props => (props.className == "selected" && '#adb0c7')};
`

const Albums1 = React.memo(function Albums({ directories, dates, scrollPosition }) {
    console.log("Albums1 rendered")

    const searchedID = useSelector(state => state.searchedID)
    const sources = useMemo(() => directories.map(dir => `file:${dir}`), [directories])
    const thumbs = useMemo(() => directories.map(dir => `file:${previewDir(dir)}`), [directories])
    const captions = useMemo(() => directories.map(dir => path.basename(dir, ".JPG")), [directories])


    const selected = useSelector(state => state.selected)
    const dispatch = useDispatch()
    // const [selected, setSelected] = useState([])

    const selectHandler = (dir) => {
        console.log(dir)
        if (selected.includes(dir)) {
            dispatch(selectImage(selected.filter(x => x !== dir)))
        } else {
            dispatch(selectImage([...selected, dir]))
        }
    }

    const datesIndexArray = useMemo(() => indexArray(dates), [dates])
    const groupedDates = datesIndexArray[1]
    const groupedDirectories = useMemo(() => divideArray(datesIndexArray[0], directories.map((item, idx) => ({ directory: item, slide: idx + 1 }))), [directories])
    const groupedNums = useMemo(() => divideArray(datesIndexArray[0], directories.map((item, idx) => idx)), [directories])

    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1
    });
    console.log(lightboxController)

    function openLightboxOnSlide(number) {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: number
        });
    }

    return (
        <>
            {groupedNums.map((nums, idx) => (<div key={`albumdiv${idx}`}>
                <p key={`albumname${idx}`} style={{ color: '#bbc0c7', marginTop: '15px', fontSize: 15 }}>{groupedDates[idx]}</p>
                <ImageList sx={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px,1fr))!important' }} >
                    {nums.map((num) => (
                        <ImageContainer key={directories[num]} onClick={() => selectHandler(directories[num])} onDoubleClick={() => openLightboxOnSlide(num - nums[0] + 1)} className={(selected.includes(directories[num])) ? "selected" : null}>
                            <ImageListItem key={thumbs[num]}>
                                <AspectRatio ratio="16/11">
                                    <LazyLoadImage
                                        src={thumbs[num]}
                                        //srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        alt={path.basename(thumbs[num], ".JPG")}
                                        scrollPosition={scrollPosition}
                                    />
                                </AspectRatio>
                                <ImageListItemBar
                                    subtitle={path.basename(thumbs[num], ".JPG")}
                                    sx={{ textOverflow: 'visible' }}
                                />
                            </ImageListItem>
                        </ImageContainer>
                    ))}
                </ImageList>

                {nums.length !== 0 && <Divider key={`divider${idx}`} sx={{ bgcolor: '#222330' }} />}
            </div>))}

            <MyLightBox
                toggler={lightboxController.toggler}
                slide={lightboxController.slide}
                sources={sources}
                thumbs={thumbs}
                captions={captions}
                key={searchedID}
                showThumbsOnMount={true}
            />
        </>
    )
})

export default trackWindowScroll(Albums1)