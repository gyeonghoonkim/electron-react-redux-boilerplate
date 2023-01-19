// 폴더 클릭했을 때 보여주는 앨범

import React, { useState, useMemo, useRef } from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
const { previewDir } = require("../../utils/preview-dir")
const { sourceDir } = require("../../utils/source-dir")
const path = require('path');
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

// 이건 file : // 를 같이 props 로 받도록 함. 그게 contents.js에서 연산이 빨라서
const Albums2 = React.memo(function Albums2({ ftpDirectories, captions, openLightboxOnSlide, scrollPosition }) {
    console.log("Albums2 rendered")

    const directories = useSelector(state => state.dirs)
    const sources = useMemo(() => directories.map(dir => `file:${dir}`), [directories])
    const searchedID = useSelector(state => state.searchedID)


    const selected = useSelector(state => state.selected)
    const dispatch = useDispatch()

    const selectHandler = (dir) => {
        console.log(sourceDir(dir).slice(5))
        const dir2 = sourceDir(dir).slice(5)
        if (selected.includes(dir2)) {
            dispatch(selectImage(selected.filter(x => x !== dir2)))
        } else {
            dispatch(selectImage([...selected, dir2]))
        }
    }

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

    return (
        <>
            <ImageList sx={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px,1fr))!important' }} >
                {ftpDirectories.map((dir, idx) => (
                    <ImageContainer key={dir} onClick={() => selectHandler(dir)} onDoubleClick={() => openLightboxOnSlide(idx + 1)} className={(selected.includes(sourceDir(dir).slice(5))) ? "selected" : null}>
                        <ImageListItem key={dir}>
                            <AspectRatio ratio="16/11">
                                <LazyLoadImage
                                    src={dir}
                                    //srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    alt={captions[idx]}
                                    scrollPosition={scrollPosition}
                                />
                            </AspectRatio>
                            <ImageListItemBar
                                subtitle={captions[idx]}
                                sx={{ textOverflow: 'visible' }}
                            />
                        </ImageListItem>
                    </ImageContainer>
                ))}
            </ ImageList>
            <MyLightBox
                toggler={lightboxController.toggler}
                slide={lightboxController.slide}
                sources={sources}
                thumbs={ftpDirectories}
                captions={captions}
                key={searchedID}
                showThumbsOnMount={true}
                disableThumbs={true}
            />
        </>
    )
})

export default trackWindowScroll(Albums2)