import app from "../../../app.json";
import Image from "next/image";
import {useTranslation} from "react-i18next";
import {useEffect, useRef, useState} from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/navigation"
import "swiper/components/effect-fade"

import SwiperCore, { Pagination,Navigation,Thumbs, EffectFade } from 'swiper';
import {useApi} from "../../../hooks/useApi";
import {getAllCategories, getAllMerchants} from "../../../redux-toolkit/actions/axiosCalls";
import {useSelector} from "react-redux";
import Link from "next/link";
import Toastify from "toastify-js";
import {useRouter} from "next/router";
SwiperCore.use([Pagination,Navigation,Thumbs,EffectFade]);

export const Categories = ({...props}) => {
    const { t }                                             = useTranslation();
    const router                                            = useRouter();
    const [ actCateClass, setActCateClass ]                 = useState('');
    const [ actSubClass, setActSubClass ]                   = useState('');
    const [ isName, setIsName ]                             = useState('');
    const [currentPage,setCurrentPage]                      = useState(1)
    const [selectedCategoryId,setSelectedCategoryId]        = useState('')
    const [selectedMerchant,setSelectedMerchant]            = useState('')
    const didMount                                          = useRef(false)
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const {
        data:categoriesData,
        isLoading:isCategoriesLoading,
    } = useApi(()=> getAllCategories('',langVal,currency))

    const {
        data:merchantsData,
        isLoading:isMerchantsLoading,
        reFetch:reFetchMerchants,
    } = useApi(()=> getAllMerchants('',langVal,currency,currentPage
        ,selectedCategoryId,'',''
        ,'','',''
        ,false,'',''),false)
    const [dataLoadComplete,setDataLoadComplete] = useState(!!merchantsData)
    useEffect(()=>{
        if (merchantsData) {
            setDataLoadComplete(true)
        }
    },[merchantsData])
    useEffect(()=>{
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        reFetchMerchants()
        // if (categoryId === 2) refetchIllusionHotels()
        // else reFetchMerchants()
    },[selectedCategoryId])


    const onShowCategory = (name, i, id) => {
        setSelectedCategoryId(id)
        setIsName(name);
        setActCateClass(i);
        setActSubClass('')
        setSelectedMerchant('')
    }

    const onShowSubCategory = (merchant,i) => {
        setSelectedMerchant(merchant)
        setActSubClass(i);
    }

    const checkLink = (merchantId,shopType) => {
        if (user) {
            if (shopType==='event') router.push(`/events/details/event?id=${merchantId}`)
            else router.push(`booking/details?merchant_id=${merchantId}`)
        }else {
            Toastify({
                text: t('auth.loginFirst'),
                duration: 3000,
                gravity: "top",
                position: langVal === 'en' ? "left" : "right",
                style: {
                    background: "#F00",
                }
            }).showToast();
        }
    }

    return (
        <div className='container'>

            <div className='text-center my-5'>
                <h2 className='fw-bolder'>{t("app.ourCategory")}</h2>
                <p className='fw-light'>{t('app.infoDis')}</p>
            </div>

            <div className='row'>
                <Swiper
                    grabCursor
                    slidesPerView={3.5}
                    spaceBetween={10}
                    breakpoints={{
                        360:{
                            slidesPerView:2.3,
                            spaceBetween:10
                        },
                        420:{
                            slidesPerView:3.3,
                            spaceBetween:10
                        },
                        580:{
                            slidesPerView:4.2,
                            spaceBetween:10
                        },
                        768:{
                            slidesPerView:5.5,
                            spaceBetween:10
                        },
                        1000:{
                            slidesPerView:6.2,
                            spaceBetween:10
                        },
                    }}
                    className={'td-categories-swiper justify-content-center'}
                >
                    {categoriesData?.categories?.filter(item => item.id !== 2).map((item, i) => (
                        <SwiperSlide className={''} key={item.id}>
                            <div className=''>
                                <div>
                                    <button onClick={()=>onShowCategory(item.name, i, item.id)} className={`${i === actCateClass ? 'active' : ''} img-item position-relative`}>
                                        <Image className="w-100 h-100" width={318} height={318} alt='img' src={item.image} />
                                        <div className='over-item p-2'>
                                            <h5 className='text-white fw-light'>{item.name}</h5>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                    }
                </Swiper>
            </div>

            {
                actCateClass || actCateClass === 0 ?
                    <div className='section-fading rounded-3 p-3 my-4'>
                        <h4 className='text-center fw-light mb-4'>{isName}</h4>
                        {/*<div className='d-flex justify-content-between align-items-center my-4'>*/}
                        <Swiper
                            grabCursor
                            slidesPerView={8}
                            spaceBetween={10}
                            breakpoints={{
                                360:{
                                    slidesPerView:2.3,
                                    spaceBetween:10
                                },
                                420:{
                                    slidesPerView:3.3,
                                    spaceBetween:10
                                },
                                580:{
                                    slidesPerView:4.2,
                                    spaceBetween:10
                                },
                                768:{
                                    slidesPerView:5.5,
                                    spaceBetween:10
                                },
                                1000:{
                                    slidesPerView:6.2,
                                    spaceBetween:10
                                },
                            }}
                            className={'td-categories-swiper'}
                        >
                            {isMerchantsLoading
                                ? 
                                <div className='main-body-mini d-flex justify-content-center align-items-center'>
                                    <h3 className='text-center m-0'>{t('app.loading')}</h3>
                                </div>
                                : merchantsData?.merchants?.length > 0
                                    ? merchantsData?.merchants?.map((item, i) => (
                                        <SwiperSlide key={i}>
                                            <h6 className={'text-center'}>{item.business_name}</h6>
                                            <button onClick={()=> onShowSubCategory(item,i)} className={`${i === actSubClass ? 'active' : ''} block-img flex-fill position-relative rounded-3 bgWhiteColor d-flex justify-content-center align-items-center`}>
                                                <Image style={{ objectFit : "contain" }} width={100} height={100} alt='img' src={item.logo} />
                                            </button>
                                        </SwiperSlide>
                                    ))
                                    : 
                                    <div className='main-body-mini d-flex justify-content-center align-items-center'>
                                        <h3 className='text-danger text-center m-0'>{t('app.noMerchantsYet')}</h3>
                                    </div>
                            }
                        </Swiper>

                        {/*</div>*/}
                        {
                            actSubClass || actSubClass === 0 ?
                                <div className='info-brand rounded-3 bgWhiteColor p-3 my-3 text-center'>
                                    <p className='fw-light'>{selectedMerchant.brief}</p>
                                    <button
                                        onClick={()=>checkLink(selectedMerchant.id,selectedMerchant.shop_type)}
                                        className='bgMainColor m-auto my-4 d-table px-3 py-2 fw-light rounded-2 text-white'>
                                            {t('booking.header.seeVouchers')}
                                    </button>
                                </div>
                                :
                                null
                        }
                    </div>
                    :
                    null
            }

        </div>

    )
}