import React from 'react'
import FsLightbox from 'fslightbox-react';



const MyLightBox = React.memo(function MyLightBox({ toggler, slide, sources, thumbs, captions, showThumbsOnMount = true, disableThumbs = false }) {

    // width: 1228.5px; height: 816.822px; transform: rotate(-90deg); 같은 텍스트로부터 회전값을 얻어내는 함수
    const rotateParser = (text) => {
        if (text.includes("transform")) {
            return parseInt(text.split('rotate(')[1].split('deg')[0])
        } else {
            return 0
        }
    }

    console.log("Lightbox rendered")

    return (

        <FsLightbox
            toggler={toggler}
            slide={slide}
            sources={sources}
            thumbs={thumbs}
            captions={captions}
            // key={key}
            exitFullscreenOnClose={true}
            showThumbsOnMount={showThumbsOnMount}
            disableThumbs={disableThumbs}
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
    )
})

export default MyLightBox