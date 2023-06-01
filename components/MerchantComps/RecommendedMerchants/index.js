import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/pagination"
import {Pagination} from "../../Pagination";
import Image from "next/image";
import {useTranslation} from "react-i18next";
import {useApi} from "../../../hooks/useApi";
import {getAllMerchants} from "../../../redux-toolkit/actions/axiosCalls";
import {useSelector} from "react-redux";
import {useEffect,useRef} from "react";
import Link from "next/link";
import {useRouter} from "next/router";

export const RecommendedMerchants = ({catId,subCatId,isLocation,mallId,selectedCity,selectedCountry,lat,lng,...props}) => {
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const didMount                                          = useRef(false);
    const { t }                                             = useTranslation();
    const router                                            = useRouter();

    const {
        data:merchantsData,
        isLoading:isMerchantsLoading,
        reFetch:reFetchMerchants,
    } = useApi(()=> getAllMerchants(user.token,langVal,currency,1
        ,catId,subCatId,mallId
        ,selectedCountry,selectedCity
        ,'',isLocation,lat,lng,true), user !== null)

    useEffect(()=>{
        if (catId){
            reFetchMerchants()
        }
    },[catId])
    useEffect(()=>{
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        if (subCatId !== '') reFetchMerchants()
    },[subCatId])
    useEffect(()=>{
        if (mallId !== '') reFetchMerchants()
    },[mallId])
    useEffect(()=>{
        if(user!==null) reFetchMerchants()
    },[lat])


    useEffect(()=>{
        console.log(merchantsData);
    },[merchantsData])



    if (isMerchantsLoading) return null
    if (merchantsData?.merchants?.length === 0) return null

    return (
        <div className="">
            <div className="my-5 border-dotted">
                <h4 className="fw-light">{t('booking.header.recommended')}</h4>
            </div>
            <div className="">
                <Swiper
                    grabCursor
                    breakpoints={{
                        580:{
                            slidesPerView:1
                        },
                        768:{
                            slidesPerView:2
                        },
                        1000:{
                            slidesPerView:4
                        },
                    }}
                    spaceBetween={25} pagination={true} modules={[Pagination]} className={'cate-swiper px-3'}>
                    {
                        merchantsData.merchants.map((item, i) => (
                            <SwiperSlide key={i}>
                                <div className='block-cate old-shadow rounded-3 my-3 overflow-hidden' onClick={()=> {
                                    if (item.shop_type==='event') router.push(`/events/details/event?id=${item.id}`)
                                    else router.push(`/booking/details/?merchant_id=${item.id}`)
                                }}>
                                    <div className="img-cate">
                                        <Image width={70} height={200} alt='img' src={item.cover} className="w-100" />
                                        <div className="marka old-shadow p-3 rounded-2">
                                            <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' src={item.logo} />
                                        </div>
                                    </div>
                                    <div className="info-cate p-3">
                                        <h6 className="mt-0">{item.business_name}</h6>
                                        <p className="fw-light">{item.category}</p>
                                        {/*<div className="d-flex justify-content-end">*/}
                                        {/*    <span className="bgMainColor p-1 rounded-1 text-white">{item.offer}</span>*/}
                                        {/*</div>*/}
                                        <div className="d-flex flex-wrap">
                                            {
                                                item.vouchers.map(offer => (
                                                    <span key={offer.id} className="bgMainColor p-1 rounded-1 text-white m-2 px-2">{parseInt(offer.discount_per)}%Off</span>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </div>
    )
}