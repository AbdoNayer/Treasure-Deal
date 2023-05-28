import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {
    Pagination,Navigation,Thumbs
} from 'swiper';
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/pagination"
import "swiper/components/navigation"
import "swiper/components/thumbs"
// import {FreeMode, Navigation, Thumbs} from "swiper";
import {useState, useRef, useEffect} from "react";
import Image from 'next/image';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";

SwiperCore.use([Pagination,Navigation,Thumbs]);


export const GalleryModalForm = ({gallery,isMenu=false,...props}) => {
    const [mainSwiperSlide, setMainSwiperSlide] = useState<any>(0);
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [open, setOpen] =  useState<any>(false);
    const swiperInstance = useRef<any>();

    const videoUrlToThumb = (videoUrl) => {
        const imageSource = videoUrl.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
        return <Image
            width={318}
            height={318}
            src={`https://img.youtube.com/vi/${imageSource}/0.jpg`}
            alt="gallery item"
            unoptimized={true} priority
        />
    }

    // const urlToFileFormat = (url) => {
    //     const regex = /[^.?]+(?=\?)/
    //     const match = url.match(regex);
    //     return match ? match[0] : '';
    // }
    // export const IMAGE_FORMATS = ['jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png','apng','webp','bmp','ico', 'cur'];
    // export const VIDEO_FORMATS = ['mp4', 'webm', 'ogg'];
    //
    // export const isVideoUrl = (url) => VIDEO_FORMATS.includes(urlToFileFormat(url))
    // export const isImageUrl = (url) => IMAGE_FORMATS.includes(urlToFileFormat(url))


    return (
        <div className={'slider-gallery'}>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                plugins={[Zoom, Slideshow]}
                slides={gallery.map(item=> ({ src: item.image }))}
            />

            <Swiper
                //@ts-ignore
                ref={swiperInstance}
                onSlideChange={s=> setMainSwiperSlide(s.activeIndex)}
                spaceBetween={10}
                navigation={true}
                grabCursor
                thumbs={{swiper:thumbsSwiper}}
                // modules={[FreeMode, Navigation, Thumbs]}
                className={`slider-gallery-up ${isMenu && 'td_is_menu'}`}
            >
                {gallery.map(galleryItem=>
                    <SwiperSlide key={galleryItem.id}>
                        {galleryItem.video_url
                            ? 
                            <iframe className="rounded-3" id="video1" width="100%" height="318" src={galleryItem.video_url} frameBorder="0" allowtransparency="true" allowFullScreen></iframe>
                            : 
                            <Image unoptimized={true} priority onClick={() => isMenu ? setOpen(true) : null} width={318} height={318} src={galleryItem.src||galleryItem.image} alt="gallery item"/>
                        }
                    </SwiperSlide>
                )}
            </Swiper>

            {!isMenu && <Swiper
                onSwiper={(s) => setThumbsSwiper(s)}
                onDestroy={() => setThumbsSwiper(null)}
                spaceBetween={10}
                slidesPerView={4}
                // modules={[FreeMode, Navigation, Thumbs]}
                watchSlidesProgress
                freeMode
                grabCursor
                className="slider-gallery-down"
            >
                {gallery.map((galleryItem, idx) =>
                    <SwiperSlide key={galleryItem.id} onClick={(e) => swiperInstance.current.swiper.slideTo(idx)} className={'img-gallery'}>
                        {galleryItem.video_url
                            ? 
                            videoUrlToThumb(galleryItem.video_url)
                            : 
                            <Image unoptimized={true} priority width={318} height={318} src={galleryItem.src||galleryItem.image} alt="gallery item"/>
                        }
                        {(mainSwiperSlide !== idx) && <div className="td_slide_overlay rounded-3"/>}
                    </SwiperSlide>
                )}
            </Swiper>}
        </div>
    )
}