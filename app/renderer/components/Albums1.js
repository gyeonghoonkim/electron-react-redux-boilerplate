// ID로 검색했을 때 날짜별로 보여주는 Album

import React, { useMemo } from 'react'
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

const ImageContainer = styled.div`
    padding: 2px;
    background-color: ${props => (props.className == "selected" && '#adb0c7')};
`

const Albums1 = React.memo(function Albums({ directories, dates, openLightboxOnSlide, scrollPosition }) {
    console.log("Albums1 rendered")

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

    return (
        <>
            {groupedDirectories.map((dirlist, idx) => (<div key={`albumdiv${idx}`}>
                <p key={`albumname${idx}`} style={{ color: '#bbc0c7', marginTop: '15px', fontSize: 15 }}>{groupedDates[idx]}</p>

                <ImageList sx={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px,1fr))!important' }} >
                    {dirlist.map((data) => (
                        <ImageContainer key={data.directory} onClick={() => selectHandler(data.directory)} onDoubleClick={() => openLightboxOnSlide(data.slide)} className={(selected.includes(data.directory)) ? "selected" : null}>
                            <ImageListItem key={`file:${previewDir(data.directory)}`}>
                                <AspectRatio ratio="16/11">
                                    <LazyLoadImage
                                        src={`file:${previewDir(data.directory)}`}
                                        //srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        alt={path.basename(data.directory, ".JPG")}
                                        scrollPosition={scrollPosition}
                                    />
                                </AspectRatio>
                                <ImageListItemBar
                                    subtitle={path.basename(data.directory, ".JPG")}
                                    sx={{ textOverflow: 'visible' }}
                                />
                            </ImageListItem>
                        </ImageContainer>
                    ))}
                </ ImageList>

                {dirlist.length !== 0 && <Divider key={`divider${idx}`} sx={{ bgcolor: '#222330' }} />}
            </div>))}
        </>
    )
})

export default trackWindowScroll(Albums1)