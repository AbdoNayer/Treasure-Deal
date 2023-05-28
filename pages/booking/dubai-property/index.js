import React, {useEffect, useRef, useState} from 'react';
import { useTranslation } from "react-i18next";
import Image from 'next/image';

import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/navigation"
import "swiper/components/effect-fade"

// import required modules
import SwiperCore, { Pagination,Navigation,Thumbs, EffectFade } from 'swiper';
SwiperCore.use([Pagination,Navigation,Thumbs,EffectFade]);
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {getMerchantDetails, getMerchantServices} from "../../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../../hooks/useApi";
import {LoadData} from "../../../components";

export default function DubaiProperty() {

    const { t }                                         = useTranslation();
    const router                                        = useRouter();
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);
    const {id,voucherId}                                = router.query

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    const {
        data:merchantDetails,
        isLoading:isMerchantDetailsLoading,
        reFetch:refetchMerchantDetails
    } = useApi(()=> getMerchantDetails(user.token,langVal,currency,id),false)

    const {
        data:merchantServices,
        isLoading:isMerchantServicesLoading,
        reFetch:refetchMerchantServices
    } = useApi(()=> getMerchantServices(user.token,langVal,currency,id,'property'),false)

    useEffect(()=>{
        if (id) {
            refetchMerchantDetails()
            refetchMerchantServices()
        }
    },[id])

    useEffect(()=>{
    },[merchantDetails])

    // const [ active, setActive ]                         = useState('rent')

    const imgSlider = [
        {
            "img" : "/img/become.png"
        }
    ];

    // const onActive = (type) => {
    //     setActive(type);
    // }
    if (isMerchantDetailsLoading||isMerchantServicesLoading) return <LoadData />

    if(user === null) return null;

  return (
    <div className='become-partner become-property'>
        
        <Swiper
            effect          = {"fade"}
            className       = "mySwiper mySwiperBecome"
            navigation      = {merchantDetails.merchants.gallaries.length > 0}
            slidesPerView   = {1}
            modules         = {[EffectFade, Navigation]}
        >
            {merchantDetails.merchants.gallaries.length > 0
                ? merchantDetails.merchants.gallaries.map((galleryItem,idx) =>
                    <SwiperSlide key={galleryItem.id}>
                        <Image unoptimized={true} style={{ width: '100%', height: '100%' }} width={700} height={700} src={galleryItem.image} alt="slider" />
                        <div className='in-body-info w-100 h-100'>
                            <div className='container'>
                                <div className='over-info px-5'>
                                    <h4 className='bg-white p-3 rounded-1 d-inline-block'>
                                        Dubai Property
                                    </h4>
                                    <p className='text-white'>Numbers talk. So, we’ve created this platform to give you additional insights and help grow your business in all directions.</p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                )
                : <SwiperSlide>
                    <Image unoptimized={true} style={{ width: '100%', height: '100%' }} width={700} height={700} src={imgSlider[0].img} alt="slider" />
                    <div className='in-body-info w-100 h-100'>
                        <div className='container'>
                            <div className='over-info px-5'>
                                <h4 className='bg-white p-3 rounded-1 d-inline-block'>
                                    Dubai Property
                                </h4>
                                <p className='text-white'>Numbers talk. So, we’ve created this platform to give you additional insights and help grow your business in all directions.</p>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            }
            {/*{*/}
            {/*    imgSlider.map((item, i) => (*/}
            {/*        <SwiperSlide key={i}>*/}
            {/*            <Image unoptimized={true} style={{ width: '100%', height: '100%' }} width={700} height={700} src={item.img} alt="slider" />*/}
            {/*            <div className='in-body-info w-100 h-100'>*/}
            {/*                <div className='container'>*/}
            {/*                    <div className='over-info px-5'>*/}
            {/*                        <h4 className='bg-white p-3 rounded-1 d-inline-block'>*/}
            {/*                            Dubai Property*/}
            {/*                        </h4>*/}
            {/*                        <p className='text-white'>Numbers talk. So, we’ve created this platform to give you additional insights and help grow your business in all directions.</p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </SwiperSlide>*/}
            {/*    ))*/}
            {/*}*/}
        </Swiper>

        {/*<div className='bgGrayColor p-4 text-center'>*/}
        {/*    <h4 className='fw-light my-3'>{t('booking.premiumProperty')}</h4>*/}
        {/*    <div className=' d-flex align-items-center justify-content-center my-3'>*/}
        {/*        <button onClick={() => onActive('rent')} className={`${active === 'rent' && 'bgMainColor text-white'} bg-white border-main text-black m-2 px-5 py-2 fw-light rounded-2`}>*/}
        {/*            {t('booking.rent')}*/}
        {/*        </button>*/}
        {/*        <button onClick={() => onActive('buy')} className={`${active === 'buy' && 'bgMainColor text-white'} bg-white border-main text-black m-2 px-5 py-2 fw-light rounded-2`}>*/}
        {/*            {t('booking.buy')}*/}
        {/*        </button>*/}
        {/*    </div>*/}
        {/*</div>*/}

        <div className='result-items py-4'>

            <div className='container'>

                <h5 className='fw-light'>Properties For Rent UAE</h5>
                <hr className='border-main' />

                {merchantServices.services.length>0
                    ? merchantServices.services.map(service =>
                        <div className='' key={service.id}>

                            <Link href={`/booking/dubai-property/details?id=${id}&voucherId=${voucherId}&serviceId=${service.id}`} className='border my-4 p-3 rounded-3'>
                                <div className="row">
                                    <div className="col-md-4 col-xs-12">
                                        <div className="old-shadow rounded-3">
                                            <Swiper
                                                effect          = {"fade"}
                                                className       = "mySwiper mySwiperBox rounded-3"
                                                navigation      = {service.gallaries.length > 0}
                                                slidesPerView   = {1}
                                                modules         = {[EffectFade, Navigation]}
                                            >
                                                {service.gallaries.length > 0
                                                    ? service.gallaries.map((galleryItem,idx) =>
                                                        <SwiperSlide key={galleryItem.id}>
                                                            <Image unoptimized={true} style={{ width: '100%' }} width={700} height={250} src={galleryItem.image} alt="slider" />
                                                            <div className='rounded-1 bg-white p-2 position-absolute bottom-0 end-0 m-2'>
                                                                <Image unoptimized={true} style={{ objectFit : "contain" }} width={70} height={35} src={'/img/logo.png'} alt="logo" />
                                                            </div>
                                                        </SwiperSlide>
                                                    )
                                                    : <SwiperSlide>
                                                        <Image unoptimized={true} style={{ width: '100%' }} width={700} height={250} src={imgSlider[0].img} alt="slider" />
                                                        <div className='rounded-1 bg-white p-2 position-absolute bottom-0 end-0 m-2'>
                                                            <Image unoptimized={true} style={{ objectFit : "contain" }} width={70} height={35} src={'/img/logo.png'} alt="logo" />
                                                        </div>
                                                    </SwiperSlide>
                                                }
                                            </Swiper>
                                        </div>
                                    </div>
                                    <div className="col-md-8 col-xs-12">
                                        <div className="info-cate">
                                            <h4>{service.name}</h4>
                                            <div className='d-flex align-items-center'>
                                                {/*<i className='icon-location mainColor fs-5'></i>*/}
                                                <h6 className="fw-light mx-2">{service.description}</h6>
                                            </div>
                                            {/*<p className="fw-light">{currency + " " + service.price}</p>*/}
                                            {/*<span className="bgMainColor p-1 rounded-pill small-font-12 text-white px-2 d-inline-block my-2">40% Off</span>*/}
                                            {/*<div className="d-flex my-3">*/}
                                            {/*    <div className="d-flex align-items-center me-3 border px-2 py-1">*/}
                                            {/*        <span className='mx-1'>3</span>*/}
                                            {/*        <i className='icon-bed mainColor mx-2'></i>*/}
                                            {/*    </div>*/}
                                            {/*    <div className="d-flex align-items-center me-3 border px-2 py-1">*/}
                                            {/*        <span className='mx-1'>1</span>*/}
                                            {/*        <i className='icon-twin-beds mainColor mx-2'></i>*/}
                                            {/*    </div>*/}
                                            {/*    <div className="d-flex align-items-center me-3 border px-2 py-1">*/}
                                            {/*        <span className='mx-1'>3</span>*/}
                                            {/*        <i className='icon-cleaning mainColor mx-2'></i>*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </div>
                            </Link>

                        </div>
                    )
                    : <></>
                }



            </div>

            <button className={`bgMainColor text-white my-5 m-auto d-table px-5 py-2 fw-light rounded-2`}>
                {t('app.loadMore')}
            </button>

        </div>


    </div>
  )
}
  