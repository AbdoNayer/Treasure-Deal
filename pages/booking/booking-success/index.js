import React from 'react';
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import "swiper/components/pagination";
import Link from "next/link";
import { useApi } from "../../../hooks/useApi";
import {getAllCategories, getMerchantDetails} from "../../../redux-toolkit/actions/axiosCalls";
import { useSelector } from "react-redux";
import Image from 'next/image';
import {useRouter} from "next/router";
import {useEffect} from "react";
import {LoadData} from "../../../components";

export default function BookingSuccess() {
    
    const { t }                                             = useTranslation();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const router                                            = useRouter();
    const currency                                          = useSelector((state) => state.currency.currency);
    const {merchant_id} = router.query

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    const { data:categoriesData }     = useApi(()=> getAllCategories(user.token,langVal), user !== null);

    //#region Merchant Details
    const {
        data:merchantDetails,
        isLoading:isMerchantLoading,
        reFetch:refetchMerchantDetails
    } = useApi(()=>  getMerchantDetails(user.token,langVal,currency,merchant_id),user !== null, router.isReady)

    useEffect(()=>{
        if (merchant_id) {
            refetchMerchantDetails()
        }
    },[merchant_id])
    //#endregion

    if (isMerchantLoading) return <LoadData/>

    if(user === null) return null;

    return (
      <div className="container booking booking-success">
        

            <div className='text-center py-5 my-5'>
                <Image src={'/img/message.png'} style={{ objectFit : "contain" }} alt='done' width='180' height='180' />
                <p className='mt-5 w-50 m-auto d-table'>{t('app.congratulation')}</p>
                <div className='d-flex justify-content-center align-items-center my-5'>
                    <div className='mx-3 d-flex align-items-center position-relative info-call'>
                        <span className='d-flex justify-content-center align-items-center rounded-circle bgMainColor'>
                            <i className='icon-phone-call text-white fs-4'></i>
                        </span>
                        <button className='bg-transparent border-main rounded-pill' onClick={()=>window.open(`tel:[+${merchantDetails.merchants.full_phone}]`)}>+{merchantDetails.merchants.full_phone}</button>
                    </div>
                    <div className='mx-3 d-flex align-items-center position-relative info-call'>
                        <span className='d-flex justify-content-center align-items-center rounded-circle bgMainColor'>
                            <i className='icon-whatsapp text-white fs-4'></i>
                        </span>
                        <button className='bg-transparent border-main rounded-pill' onClick={()=>window.open(`https://wa.me/+${merchantDetails.merchants.full_phone}`)}>{t('app.chatWhatsapp')}</button>
                    </div>
                </div>
                <Link href='/' className='btn-button bgMainColor text-white d-flex justify-content-center align-items-center m-auto'>
                    { t('app.gohome') }
                </Link>
            </div>

            <div className="my-5 temp-title text-center">
                <h4 className="fw-light bg-white position-relative m-auto d-table px-3 py-3">{t('booking.details.contBooking')}</h4>
            </div>

            <div className="filter-action my-4">
                <div className="d-flex justify-content-center align-items-center my-3">
                    <Swiper grabCursor breakpoints={{ 580:{ slidesPerView:3 }, 768:{ slidesPerView:4 }, 1000:{ slidesPerView:9 }, }} spaceBetween={10} className={'cate-list-swiper p-3'}> 
                        {
                            categoriesData && categoriesData.categories.map(cat => (
                                <SwiperSlide key={cat.id}>
                                    <Link href={{ pathname: "/booking", query: {id : cat.id} }} className={"cate-button bg-transparent text-center"}>
                                        <div className={`icon-cate`}>
                                            <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                            <Image style={{ objectFit : "contain" }} width={70} height={70} alt='logo' className='inAc' src={cat.icon} />
                                        </div>
                                        <h6 className="fw-light">{cat.name}</h6>
                                    </Link>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            </div>

      </div>
    )
}
  