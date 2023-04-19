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
                        <Image style={{ width: '100%', height: '100%' }} width={700} height={700} src={item.img} alt="slider" />
                    </SwiperSlide>
                ))
            }
        </Swiper>

    )
}