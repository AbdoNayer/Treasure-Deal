import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/effect-fade";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/navigation"
import "swiper/components/effect-fade"

// import required modules
import { Navigation, EffectFade } from "swiper";
import Image from 'next/image';
import ReactPlayer from "react-player";

export default function Slider({ data }) {
    return (

        <Swiper
            effect          = {"fade"}
            className       = "mySwiper"
            navigation      = {true}
            slidesPerView   = {1}
            modules         = {data.name === 'slideHome' ? [EffectFade, Navigation] : ''}
        >
            {
                data.arr.map((item, i) => (
                    <SwiperSlide key={i}>
                        {
                            item.slide_type === "image" ?
                            <Image style={{ width: '100%', height: '100%' }} width={700} height={700} src={item.image||item.img} alt="slider" />
                            :
                            <ReactPlayer
                                id="video"
                                url={item.image||item.img}
                                controls={false}
                                playing={true}
                                loop={true}
                                muted={true}
                                width={'100%'}
                                height={'auto'}
                            />
                        }
                        {item.title && <div className='info px-5 mx-5'>
                            <div className='ps-5 ms-5'>
                                <h4 className='m-0 bg-white d-inline-block py-2 px-3'>{item.title}</h4>
                                <p className='my-4 text-white'>{item.description}</p>
                                {/*<Link href={'/events'} className='btn-button bg-white p-2 px-3 d-inline-block'>Know More</Link>*/}
                            </div>
                        </div>}
                    </SwiperSlide>
                ))
            }
        </Swiper>

    )
}