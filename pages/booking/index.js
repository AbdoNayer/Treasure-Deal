import React, {useEffect, useRef, useState} from 'react';
import { useTranslation } from "react-i18next";
import { VoucherCard } from "../../components/VoucherCard";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/pagination"
import Link from "next/link";
import {useApi} from "../../hooks/useApi";
import {
    getAllCategories,
    getAllCities,
    getAllCountries,
    getAllMalls,
    getAllMerchants
} from "../../redux-toolkit/actions/axiosCalls";
import {useDispatch, useSelector} from "react-redux";
import {LoadData, EmptyData} from "../../components";
import { InputSelect } from "../../components/Inputs/InputSelect";
import Image from 'next/image';
import {getLocationAction, hideModalAction, showModalAction} from "../../redux-toolkit/actions";
import {ModalForm} from "../../components/ModalForms/ModalForm";
import {locationReducer, resetLocationReducer} from "../../redux-toolkit/reducer/locationReducer";
import { useRouter } from "next/router";
import {HotelStars} from "../../components/HotelStars";
import {Pagination} from "../../components/Pagination";

export default function Booking() {
    
    const { t }                                             = useTranslation();
    const user                                              = useSelector((state) => state.user.user);
    const location                                          = useSelector((state) => state.location.location);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const [currentPage, setCurrentPage]                     = useState(1);
    const [subCategories,setSubCategories]                  = useState([]);
    const router                                            = useRouter();
    const CID                                               = router.query;
    const [categoryId, setCategoryId]                       = useState(parseInt(CID.id) || '');
    const [subCategoryId, setSubCategoryId]                 = useState('');
    const [mallId, setMallId]                               = useState('');
    const [selectedCountry,setSelectedCountry]              = useState('')
    const [selectedCity,setSelectedCity]                    = useState('')
    const [searchName,setSearchName]                        = useState('')
    const [userLocation,setUserLocation]                    = useState({ lat: '', long: '' });
    const didMount                                          = useRef(false);
    const dispatch                                          = useDispatch();

    const data = [
        {
            "img"               : "/img/9.png",
            "logo"              : '/img/logo1.png',
            "name"              : "Burger King",
            "cate"              : "Restaurant",
            "offer"             : "60% Off"
        },
        {
            "img"               : "/img/9.png",
            "logo"              : '/img/logo1.png',
            "name"              : "Burger King",
            "cate"              : "Restaurant",
            "offer"             : "60% Off"
        },
        {
            "img"               : "/img/9.png",
            "logo"              : '/img/logo1.png',
            "name"              : "Burger King",
            "cate"              : "Restaurant",
            "offer"             : "60% Off"
        },
        {
            "img"               : "/img/9.png",
            "logo"              : '/img/logo1.png',
            "name"              : "Burger King",
            "cate"              : "Restaurant",
            "offer"             : "60% Off"
        },
        {
            "img"               : "/img/9.png",
            "logo"              : '/img/logo1.png',
            "name"              : "Burger King",
            "cate"              : "Restaurant",
            "offer"             : "60% Off"
        },
        {
            "img"               : "/img/9.png",
            "logo"              : '/img/logo1.png',
            "name"              : "Burger King",
            "cate"              : "Restaurant",
            "offer"             : "60% Off"
        },
        {
            "img"               : "/img/9.png",
            "logo"              : '/img/logo1.png',
            "name"              : "Burger King",
            "cate"              : "Restaurant",
            "offer"             : "60% Off"
        },
        {
            "img"               : "/img/9.png",
            "logo"              : '/img/logo1.png',
            "name"              : "Burger King",
            "cate"              : "Restaurant",
            "offer"             : "60% Off"
        }
    ]

    //#region Merchants
    const {
        data:merchantsData,
        isLoading:isMerchantsLoading,
        reFetch:reFetchMerchants,
    } = useApi(()=> getAllMerchants(user.token,langVal,currency,currentPage
        ,categoryId,subCategoryId,mallId
        ,selectedCountry,selectedCity,searchName
        ,!!userLocation.lat,userLocation.lat,userLocation.long))
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
    },[currentPage])
    //#endregion
    
    //#region Categories and Malls
    const {
        data:categoriesData,
        isLoading:isCategoriesLoading,
    } = useApi(()=> getAllCategories(user.token,langVal,currency))

    useEffect(()=>{
        if (categoriesData && CID.id){
            setSubCategories(
                categoriesData.categories.find(cat=> cat.id === parseInt(CID.id))?.subcategories
            )
        }
    },[categoriesData,CID.id])

    const {
        data:mallsData,
        isLoading:isMallsLoading,
    } = useApi(()=> getAllMalls(user.token,langVal,currency))

    useEffect(()=>{
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        setMallId('')
        setSubCategoryId('')
        if (!categoryId) {
            setSelectedCountry('')
            setSelectedCity('')
            setUserLocation({lat: '', long: ''})
        }
        reFetchMerchants()
    },[categoryId])

    useEffect(()=>{
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        if (subCategoryId !== '') reFetchMerchants()
    },[subCategoryId])

    useEffect(()=>{
        if (mallId !== '') reFetchMerchants()
    },[mallId])
    //#endregion
    
    //#region Countries and Cities
    const {
        data:countriesData,
        isLoading:isCountriesLoading,
    } = useApi(()=> getAllCountries(user.token,langVal,currency))
    const {
        data:citiesData,
        isLoading:isCitiesLoading,
        reFetch:refetchCites
    } = useApi(()=> getAllCities(user.token,langVal,currency,selectedCountry),!!selectedCountry)
    useEffect(()=>{
        if (selectedCountry) {
            setSelectedCity('')
            reFetchMerchants()
            refetchCites(() => getAllCities(user.token, langVal,currency, selectedCountry))
        }
    },[selectedCountry])
    useEffect(()=>{
        if (selectedCity) reFetchMerchants()
    },[selectedCity])
    //#endregion

    //#region Show Nearby
    const getLocation = async () => {
        dispatch(getLocationAction()).then(()=>{
            setUserLocation(location)
        })
        await dispatch(hideModalAction())
    }
    const locationModal = () => {
        dispatch(showModalAction(
            <ModalForm
                title={'Location Permission'}
                applyText={'Accept'}
                applyButton
                applyFunction={getLocation}
            >
                Treasure Deal would like to ask for your location to show you relevant data
            </ModalForm>
        ))
    }
    const checkLocation = () => {
        if (userLocation.lat){
            setUserLocation({lat: '',long: ''})
        }
        else {
            if (location.lat) setUserLocation(location)
            else locationModal()
        }

    }
    useEffect(()=>{
       reFetchMerchants()
    },[userLocation])
    //#endregion

    if (!dataLoadComplete) return <LoadData />

    return (
      <div className="container booking">
        
            <div className="my-5 border-dotted">
                <h4 className="fw-light">{t('app.myBundle')}</h4>
            </div>

            <div className="view-up my-5">
                <div className="row">
                    <div className="col-md-6 col-xs-12">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam exercitationem nemo cupiditate cumque nihil facilis, aspernatur velit iure nobis eos modi aliquam ipsam id sed consectetur mollitia assumenda? Recusandae, nam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam exercitationem nemo cupiditate cumque nihil facilis, aspernatur velit iure nobis eos modi aliquam ipsam id sed consectetur mollitia assumenda? Recusandae, nam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam exercitationem nemo cupiditate cumque nihil facilis, aspernatur velit iure nobis eos modi aliquam ipsam id sed consectetur mollitia assumenda? Recusandae, nam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam exercitationem nemo cupiditate cumque nihil facilis, aspernatur velit iure nobis eos modi aliquam ipsam id sed consectetur mollitia assumenda? Recusandae, nam.</p>
                    </div>
                    <div className="col-md-6 col-xs-12">
                        <div className="BG-2 bg-img p-4 rounded-3 slide-voucher">
                            <div className='position-relative in-card-loop'>
                                <VoucherCard
                                    key                 = { 0 }
                                    image               = { '/img/card.png' }
                                    // price               = { '20 EG' }
                                    // date                = { '12-2-2023' }
                                    terms               = { t('millionaire.voucher.cardTermsMini') }
                                    textModal           = { 'terms' }
                                />
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="block-item">
                                    <span className="fw-light mainColor">TD Vouchers</span>
                                </div>
                                <div className="block-item">
                                    <span className="fw-light mainColor">TD Vouchers</span>
                                </div>
                                <div className="block-item">
                                    <span className="fw-light mainColor">TD Vouchers</span>
                                </div>
                                <div className="block-item">
                                    <span className="fw-light mainColor">TD Vouchers</span>
                                </div>
                                <div className="block-item">
                                    <span className="fw-light mainColor">TD Vouchers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="filter-action my-4">
                <div className="d-flex justify-content-center align-items-center my-3">
                    <Swiper grabCursor breakpoints={{ 580:{ slidesPerView:3 }, 768:{ slidesPerView:4 }, 1000:{ slidesPerView:10 }, }} spaceBetween={10} className={'cate-list-swiper p-3'}>
                        <SwiperSlide>
                            <button onClick={() => setCategoryId('')} className={"cate-button bg-transparent"}>
                                <div className={`icon-cate ${categoryId==='' ? 'td_active' : ''}`}>
                                    <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                    <span className={'icon-meals'} />
                                </div>
                                <h6 className="fw-light">{t('booking.category.mail')}</h6>
                            </button>
                        </SwiperSlide>
                        <SwiperSlide>
                            <button onClick={() => setCategoryId('property')} className={"cate-button bg-transparent"}>
                                <div className={`icon-cate ${categoryId === 'property' ? 'td_active' : ''}`}>
                                    <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                    <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' className='inAc' src={'/icons-become/assets.png'} />
                                </div>
                                <h6 className="fw-light">{t('booking.category.property')}</h6>
                            </button>
                        </SwiperSlide>
                        {categoriesData &&
                            categoriesData.categories.map(cat => (
                                <SwiperSlide key={cat.id}>
                                    <button onClick={() => {
                                        setCategoryId(cat.id)
                                        setSubCategories(cat.subcategories)
                                    }} className={"cate-button bg-transparent"}>
                                        <div className={`icon-cate ${cat.id === categoryId ? 'td_active' : ''}`}>
                                            <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                            <Image style={{ objectFit : "contain" }} width={70} height={70} alt='logo' className='inAc' src={cat.icon} />
                                        </div>
                                        <h6 className="fw-light">{cat.name}</h6>
                                    </button>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
                <div className="links-filter my-3 px-4">
                    {categoryId
                        ? subCategories.map(item => (
                            categoryId===2
                                ? <button key={item.id} onClick={()=>setSubCategoryId(item.id)} className={`${subCategoryId===item.id? 'td_active' : ''}`}>
                                    <HotelStars starsNumber={Number(item.name)}/>
                                </button>
                                : <button key={item.id} onClick={()=>setSubCategoryId(item.id)} className={`${subCategoryId===item.id? 'td_active' : ''}`}>{item.name}</button>
                        ))
                        : mallsData && mallsData.malls.map(item => (
                            <button key={item.id} onClick={()=>setMallId(item.id)} className={`${mallId===item.id? 'td_active' : ''}`}>{item.name}</button>
                        ))

                    }
                </div>
            </div>

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
                            data.map((item, i) => (
                                <SwiperSlide key={i}>
                                    <div className='block-cate old-shadow rounded-3 my-3 overflow-hidden'>
                                        <div className="img-cate">
                                            <Image width={70} height={200} alt='img' src={item.img} className="w-100" />
                                            <div className="marka old-shadow p-3 rounded-2">
                                                <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' src={item.logo} />
                                            </div>
                                        </div>
                                        <div className="info-cate p-3">
                                            <h6 className="mt-0">{item.name}</h6>
                                            <p className="fw-light">{item.cate}</p>
                                            <div className="d-flex justify-content-end">
                                                <span className="bgMainColor p-1 rounded-1 text-white">{item.offer}</span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-5">
                <div className='d-flex align-items-center'>
                    {categoryId && <div className="select-active d-flex align-items-center">
                        <InputSelect
                            onChange={country => setSelectedCountry(country.value)}
                            isLoading={isCountriesLoading}
                            options={countriesData?.countries.map(country => ({
                                label: country.name,
                                value: country.id
                            }))}
                            placeholder={t('booking.Reserve.country')}
                        />
                    </div>}
                    {categoryId && selectedCountry && <div className="select-active d-flex align-items-center mx-3">
                        <InputSelect
                            isLoading={isCitiesLoading}
                            options={citiesData?.cities.map(city => ({label:city.name,value:city.id}))}
                            onChange={city => setSelectedCity(city.value)}
                            placeholder={t('booking.Reserve.city')}
                        />
                    </div>}
                    <div className="filter-action">
                        {categoryId && <div className="links-filter px-4">
                            <button className={`${userLocation.lat && 'td_active'}`} onClick={checkLocation}>Show Nearby</button>
                        </div>}
                    </div>
                </div>
                <div className="block-search">
                    <input type={'text'} onChange={e=> setSearchName(e.target.value)}/>
                    <button onClick={()=>{
                        reFetchMerchants();
                        setSearchName('')
                    }}>
                        <span className="mx-2 fw-light">Search</span>
                        <i className="icon-search" />
                    </button>
                </div>
            </div>

            <div className="result-items">

            {
                categoryId === 'property' ?
                    <div className="block-item-cate d-flex align-items-center p-2">
                        <div className="img-item p-3">
                            <div className="old-shadow w-100 h-100 rounded-3 d-flex align-items-center justify-content-center">
                                <Image style={{ objectFit : "contain" }} width={70} height={70} alt='logo' src={'/img/logo.png'} />
                            </div>
                        </div>
                        <div className="up-info-cate d-flex align-items-center justify-content-between px-2">
                            <div className="info-cate p-3">
                                <h4>Dubai Property</h4>
                                <h6 className="fw-light">Egypt, Cairo</h6>
                                <p className="fw-light">description</p>
                                <div className="d-flex">
                                    <span className="bgMainColor p-1 rounded-1 text-white m-2 px-2">40% Off</span>
                                    <span className="bgMainColor p-1 rounded-1 text-white m-2 px-2">50% Off</span>
                                </div>
                            </div>
                            <Link href={'/booking/dubai-property'} className='bgMainColor m-3 px-3 py-2 fw-light rounded-2 text-white'>{t('booking.header.seeMore')}</Link>
                        </div>
                    </div>
                : 
                    null
            }

            {/*<div className="block-item-cate rounded-1 p-3">*/}
            {/*    <div className='d-flex border-main-def pb-3'>*/}
            {/*        <div className="img-item">*/}
            {/*            <Image style={{ width: '100%', height: '100%' }} width={70} height={70} alt='logo' src={'/img/9.png'} />*/}
            {/*        </div>*/}
            {/*        <div className="up-info-cate px-3">*/}
            {/*            <h5>Club Room</h5>*/}
            {/*            <p className='my-4'>Each room offers a satellite flat screen TV and a work desk. There is also a mini bar,*/}
            {/*                <br />kettle and a highchair. The bathroom offers a bathtub, slippers, bathrobe.</p>*/}
            {/*            <div className='d-flex align-items-center'>*/}
            {/*                <div className='d-flex align-items-center'>*/}
            {/*                    <i className='icon-info mainColor'></i>*/}
            {/*                    <span className='mx-2'>Double bed</span>*/}
            {/*                </div>*/}
            {/*                <div className='d-flex align-items-center mx-3'>*/}
            {/*                    <i className='icon-info mainColor'></i>*/}
            {/*                    <span className='mx-2'>Twin bed</span>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className='d-flex align-items-center justify-content-between pt-3'>*/}
            {/*        <button className='btn-button w-auto px-4 bgGreenColor text-white'>{t('select')}</button>*/}
            {/*        <div className='d-flex align-items-center'>*/}
            {/*            <span className='mx-3 text-decoration-line-through text-black-50'>AED 600</span>*/}
            {/*            <h6 className='m-0'>AED 400</h6>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

                {isMerchantsLoading
                    ? <div className={'modal-height-view position-relative'}><LoadData/></div>
                    : (merchantsData.merchants && merchantsData.merchants.length)
                        ? merchantsData.merchants.map(item => (<div key={item.id} className="block-item-cate d-flex align-items-center p-2">
                                <div className="img-item p-3">
                                    <div className="old-shadow w-100 h-100 rounded-3 d-flex align-items-center justify-content-center">
                                        <Image style={{ objectFit : "contain" }} width={70} height={70} alt='logo' src={item.logo} />
                                    </div>
                                </div>
                                <div className="up-info-cate d-flex align-items-center justify-content-between px-2">
                                    <div className="info-cate p-3">
                                        <h4>{item.business_name}</h4>
                                        <h6 className="fw-light">{item.map_desc}</h6>
                                        <p className="fw-light">{item.description}</p>
                                        <div className="d-flex">
                                            {
                                                item.vouchers.map(offer => (
                                                    <span key={offer.id} className="bgMainColor p-1 rounded-1 text-white m-2 px-2">{parseInt(offer.discount_per)}%Off</span>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <Link href={{pathname: `booking/details`, query:{merchant_id: item.id}}} className='bgMainColor m-3 px-3 py-2 fw-light rounded-2 text-white'>{t('booking.header.seeVouchers')}</Link>
                                </div>
                            </div>))
                        : 
                        <EmptyData data={{text : 'app.notFound'}} />
                }
                <div className={'d-flex align-items-center justify-content-center my-5'}>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={merchantsData.pagination.total_items}
                        pageSize={merchantsData.pagination.per_page}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            </div>
      </div>
    )
}
  