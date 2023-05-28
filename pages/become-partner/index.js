import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useForm,Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from "react-i18next";

import * as yup from 'yup';
import { countries } from '../../redux-toolkit/actions';

import { InputSelect } from "../../components/Inputs/InputSelect";
import { InputText } from "../../components/Inputs/InputText";
import codeCountry from "../../codeCountry.json";

// import { Swiper, SwiperSlide } from "swiper/react";
//
// import 'swiper/swiper-bundle.min.css'
// import 'swiper/swiper.min.css'
// import "swiper/components/navigation"
// import "swiper/components/effect-fade"
//
// // import required modules
// import { Navigation, EffectFade } from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {
     Navigation,Autoplay
} from 'swiper';
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/pagination"
import "swiper/components/autoplay"
SwiperCore.use([Navigation,Autoplay]);

import Image from 'next/image';
import {
    becomePartnerRequest,
    getAllCategories,
    getAllCities,
    getAllCountries
} from "../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../hooks/useApi";


export default function BecomePartner() {

    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch();
    const langVal                                       = useSelector((state) => state.language.language);
    const nationalityOptions                            = useSelector((state) => state.countries.countries);
    const [ isName, setIsName ]                         = useState('');
    const [ isLoading,setIsLoading ]                    = useState(false);
    const [ actCateClass, setActCateClass ]             = useState('');
    const [ actSubClass, setActSubClass ]               = useState('');
    const currency                                      = useSelector((state) => state.currency.currency);
    const user                                              = useSelector((state) => state.user.user);
    const aboutSection = useRef(null);

    const image = [
        "/img/logo1.png",
        "/img/logo2.png",
        "/img/logo3.png",
        "/img/logo4.png",
        "/img/logo1.png",
        "/img/logo1.png",
        "/img/logo2.png",
        "/img/logo3.png",
        "/img/logo4.png",
        "/img/logo1.png"
    ];
    const imgLogos = [
        {
            img         : '/img/logo4.png',
            title       : 'ZARA',
            name        : 'CEO',
            disc        : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio. Fugit iste asperiores repellendu'
        },
        {
            img         : '/img/logo2.png',
            title       : 'LACOSTE',
            name        : 'CEO',
            disc        : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio. Fugit iste asperiores repellendu'
        },
    ];
    const imgSlider = [
        {
            "img" : "/img/become.png"
        },
        {
            "img" : "/img/banner.png"
        },
        {
            "img" : "/img/become.png"
        }
    ]

    const fetchData = () => {

        dispatch(countries(langVal,currency));
    
    }
    
    useEffect(() => { fetchData(); }, []);

    const onShowCategory = (name, i) => { setIsName(name); setActCateClass(i) }

    const onShowSubCategory = (i) => setActSubClass(i);

    let registerSchema = yup.object().shape({
        business_name:yup.string().required(t('register.form_errors.business_name')),
        category_id:yup.string().required('Business Category Required'),
        first_name:yup.string().required(t('register.form_errors.first_name')),
        last_name:yup.string().required(t('register.form_errors.last_name')),
        country_code:yup.string().required(t('register.form_errors.country_code')),
        phone:yup.string()
            .required(t('register.form_errors.phone.required'))
            .matches(/^\d+$/,t('register.form_errors.phone.matches'))
            .min(9,t('register.form_errors.phone.min'))
            .max(10,t('register.form_errors.phone.max')),
        email:yup.string().required(t('register.form_errors.email.required'))
            .email(t('register.form_errors.email.email')),
        country_id:yup.string().required('country required'),
        city_id:yup.string().required('city required'),
        // country_id:yup.string().required(t('register.form_errors.country')),
    });

    const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(registerSchema)
    });

    const watchCountry = watch('country_id');


    const {
        data:categoriesData,
        isLoading:isCategoriesDataLoading,
        reFetch:refetchCategoriesData
    } = useApi(()=> getAllCategories('',langVal,currency))

    const {
        data:countriesData,
        isLoading:isCountriesDataLoading,
        reFetch:refetchCountriesData
    } = useApi(()=> getAllCountries('',langVal,currency))

    const {
        data:citiesData,
        isLoading:isCitiesDataLoading,
        reFetch:refetchCitiesData
    } = useApi(()=> getAllCities('',langVal,currency,watchCountry))

    useEffect(()=>{
        refetchCitiesData()
    },[watchCountry])

    const submitHandler = data => {
        setIsLoading(true)
        const partnerObject = {
            ...data,
        };
        (async () => await becomePartnerRequest(partnerObject,langVal,currency))().then(r=> setIsLoading(false)).catch(e=> setIsLoading(false));
    }

    const goToButton = () => {
        window.scrollTo({
            top         : aboutSection.current.offsetTop + 100,
            behavior    : 'smooth',
        });

    };

  return (
    <div className='become-partner'>
        
        <Swiper
            // effect          = {"fade"}
            className       = "mySwiper mySwiperBecome"
            navigation      = {true}
            slidesPerView   = {1}
            autoplay={{delay:5000, waitForTransition: true, pauseOnMouseEnter: true, disableOnInteraction: false, }}
            modules         = {[Navigation,Autoplay]}
        >
            {
                imgSlider.map((item, i) => (
                    <SwiperSlide key={i}>
                        <Image unoptimized={true} style={{ width: '100%', height: '100%' }} width={700} height={700} src={item.img} alt="slider" />
                        <div className='in-body-info w-100 h-100'>
                            <div className='container'>
                                <div className='over-info px-5'>
                                    <h3 className='text-white'>
                                        Sell more with
                                        <br />
                                        smarter deals!
                                    </h3>
                                    <p className='text-white my-3'>Numbers talk. So, weâ€™ve created this platform to give you additional insights and help grow your business in all directions.</p>
                                    <button onClick={goToButton} className='btn-button bg-white'>{t('becomePartner.joinNow')}</button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))
            }
        </Swiper>

        <div className='py-5'>
            <div className='container'>
                <div className='head-title py-4'>
                    <h3>What We Do</h3>
                    <p>The things weâ€™ve made happen that work a little too well</p>
                </div>
                <div className='row my-4'>
                    <div className='col-md-4 col-xs-12'>
                        <div className='row in-cate-images'>
                            <div className='col-md-4 col-xs-12 text-center'>
                                <button className={"cate-button bg-transparent"}>
                                    <div className={`icon-cate old-shadow`}>
                                        <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                        <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' className='inAc' src={'/icons-become/hotel.png'} />
                                    </div>
                                    <h6 className="small-font-12">Hotel</h6>
                                </button>
                            </div>
                            <div className='col-md-4 col-xs-12 text-center'>
                                <button className={"cate-button bg-transparent"}>
                                    <div className={`icon-cate old-shadow`}>
                                        <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                        <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' className='inAc' src={'/icons-become/calendar.png'} />
                                    </div>
                                    <h6 className="small-font-12">DUBAI EVENTS</h6>
                                </button>
                            </div>
                            <div className='col-md-4 col-xs-12 text-center'>
                                <button className={"cate-button bg-transparent"}>
                                    <div className={`icon-cate old-shadow`}>
                                        <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                        <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' className='inAc' src={'/icons-become/assets.png'} />
                                    </div>
                                    <h6 className="small-font-12">DUBAI PROPERTY</h6>
                                </button>
                            </div>
                            <div className='col-md-4 col-xs-12 text-center'>
                                <button className={"cate-button bg-transparent"}>
                                    <div className={`icon-cate old-shadow`}>
                                        <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                        <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' className='inAc' src={'/icons-become/maping.png'} />
                                    </div>
                                    <h6 className="small-font-12">MALLS</h6>
                                </button>
                            </div>
                            <div className='col-md-4 col-xs-12 text-center'>
                                <button className={"cate-button bg-transparent"}>
                                    <div className={`icon-cate old-shadow`}>
                                        <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                        <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' className='inAc' src={'/icons-become/fast-food.png'} />
                                    </div>
                                    <h6 className="small-font-12">RESTAURANT</h6>
                                </button>
                            </div>
                            <div className='col-md-4 col-xs-12 text-center'>
                                <button className={"cate-button bg-transparent"}>
                                    <div className={`icon-cate old-shadow`}>
                                        <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                        <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' className='inAc' src={'/icons-become/cars.png'} />
                                    </div>
                                    <h6 className="small-font-12">AUTOMOBILES</h6>
                                </button>
                            </div>
                            <div className='col-md-4 col-xs-12 text-center'>
                                <button className={"cate-button bg-transparent"}>
                                    <div className={`icon-cate old-shadow`}>
                                        <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                        <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' className='inAc' src={'/icons-become/mask.png'} />
                                    </div>
                                    <h6 className="small-font-12">LEISURE</h6>
                                </button>
                            </div>
                            <div className='col-md-4 col-xs-12 text-center'>
                                <button className={"cate-button bg-transparent"}>
                                    <div className={`icon-cate old-shadow`}>
                                        <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                        <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' className='inAc' src={'/icons-become/healthcare.png'} />
                                    </div>
                                    <h6 className="small-font-12">HEALTH & CARE</h6>
                                </button>
                            </div>
                            <div className='col-md-4 col-xs-12 text-center'>
                                <button className={"cate-button bg-transparent"}>
                                    <div className={`icon-cate old-shadow`}>
                                        <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                        <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' className='inAc' src={'/icons-become/cleaning.png'} />
                                    </div>
                                    <h6 className="small-font-12">SOFT SERVICES</h6>
                                </button>
                            </div>
                            <div className='col-md-4 col-xs-12 text-center'>
                                <button className={"cate-button bg-transparent"}>
                                    <div className={`icon-cate old-shadow`}>
                                        <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                        <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' className='inAc' src={'/icons-become/flight.png'} />
                                    </div>
                                    <h6 className="small-font-12">FLIGHTS</h6>
                                </button>
                            </div>
                            <div className='col-md-4 col-xs-12 text-center'>
                                <button className={"cate-button bg-transparent"}>
                                    <div className={`icon-cate old-shadow`}>
                                        <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                        <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' className='inAc' src={'/icons-become/tec.png'} />
                                    </div>
                                    <h6 className="small-font-12">HOME APPLIANCES</h6>
                                </button>
                            </div>
                            <div className='col-md-4 col-xs-12 text-center'>
                                <button className={"cate-button bg-transparent"}>
                                    <div className={`icon-cate old-shadow`}>
                                        <Image style={{ objectFit : "contain" }} width={70} height={70} alt='favicon' src="/img/favicon.png" />
                                        <Image style={{ objectFit : "contain" }} width={50} height={50} alt='logo' className='inAc' src={'/icons-become/phone.png'} />
                                    </div>
                                    <h6 className="small-font-12">ELECTRONICS</h6>
                                </button>
                            </div>
                            
                        </div>
                    </div>
                    <div className='col-md-8 col-xs-12'>
                        <Image unoptimized={true} className='d-table m-auto w-100 videoImg' style={{ objectFit : "contain", position  : 'relative', top : '-50px' }} width={570} height={700} alt='shape' src='/img/la2.png' />
                        {/* <iframe id="video1" width="100%" height="570" src="http://www.youtube.com/embed/TJ2X4dFhAC0?enablejsapi" frameBorder="0" allowtransparency="true" allowFullScreen></iframe> */}
                        {/* <div className='text-center rounded-3 position-relative overflow-hidden'>
                            <Image unoptimized={true} style={{ width: '100%' }} width={100} height={570} alt='shape' src='/img/become.png' />
                            <div className='over-play w-100 h-100'>
                                <Image unoptimized={true} width={80} height={80} alt='shape' src='/icons-become/play.png' />
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>

        <div className='pb-5'>
            <h3 className='m-0 text-center fw-bold'>Our Merchant</h3>

            <div className='logos d-flex align-items-center justify-content-center'>
                <div className=''>
                    <Image style={{ objectFit : "contain" }} width={120} height={80} alt='ic1' src='/img/ic1.png' />
                </div>
                <div className=''>
                    <Image style={{ objectFit : "contain" }} width={120} height={88} alt='ic' src='/img/ic.png' />
                </div>
                <div className=''>
                    <Image style={{ objectFit : "contain" }} width={120} height={88} alt='ic1' src='/img/ic1.png' />
                </div>
                <div className=''>
                    <Image style={{ objectFit : "contain" }} width={120} height={88} alt='ic' src='/img/ic.png' />
                </div>
            </div>
        </div>

        <div className='our-partners in-our-partners py-5 mt-0'>
            <div className='container'>
                <div className='row my-4'>
                    <div className='col-md-6 col-xs-12'></div>
                    <div className='col-md-6 col-xs-12'>
                        <div className='head-title'>
                            <h4 className='fw-bold'>How Our Partners Benefit</h4>
                        </div>
                        <div className='row'>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item old-shadow'>
                                    <Image style={{ objectFit : "contain" }} width={70} height={70} alt='111' src='/img/visitor.png' />
                                    <h6 className='fw-bold my-0'>More Visitors</h6>
                                    <p className='fw-light'>Attract more customers to your venue through our offers</p>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item old-shadow'>
                                    <Image style={{ objectFit : "contain" }} width={70} height={70} alt='222' src='/img/video-marketing.png' />
                                    <h6 className='fw-bold my-0'>Brand Recognition</h6>
                                    <p className='fw-light'>Tell the world who you are through digital advertising</p>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item old-shadow'>
                                    <Image style={{ objectFit : "contain" }} width={70} height={70} alt='333' src='/img/consumer-research.png' />
                                    <h6 className='fw-bold my-0'>Consumer Analytics</h6>
                                    <p className='fw-light'>Understand your customers better with data insights & analytics</p>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item old-shadow'>
                                    <Image style={{ objectFit : "contain" }} width={70} height={70} alt='444' src='/img/presentation.png' />
                                    <h6 className='fw-bold my-0'>Increased Exposure</h6>
                                    <p className='fw-light'>Be featured not just on our app, but also on our corporate partnersâ€™ apps</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='our-solutions our-solutions-2 py-5 mt-0'>
            <div className='container'>
                <div className='row my-4'>
                    <div className='col-md-7 col-xs-12'>
                        <div className='row'>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item'>
                                    <Image style={{ objectFit : "contain" }} width={60} height={60} alt='digital' src='/img/digital-marketing.png' />
                                    <h4 className='text-white fw-bold'>Digital & Social Marketing</h4>
                                    <p className='text-white fw-light small-font-13'>Weâ€™ll promote your discounts across multiple channels to generate new leads from every potential avenue.</p>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item'>
                                    <Image style={{ objectFit : "contain" }} width={60} height={60} alt='website' src='/img/website-content.png' />
                                    <h4 className='text-white fw-bold'>Real-Time Analytics</h4>
                                    <p className='text-white fw-light small-font-13'>Weâ€™ll promote your discounts across multiple channels to generate new leads from every potential avenue.</p>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item'>
                                    <Image style={{ objectFit : "contain" }} width={60} height={60} alt='monitor' src='/img/monitor.png' />
                                    <h4 className='text-white fw-bold'>Booking Management</h4>
                                    <p className='text-white fw-light small-font-13'>Weâ€™ll promote your discounts across multiple channels to generate new leads from every potential avenue.</p>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item'>
                                    <Image style={{ objectFit : "contain" }} width={60} height={60} alt='monitor' src='/img/management.png' />
                                    <h4 className='text-white fw-bold'>Increase Brand Exposure</h4>
                                    <p className='text-white fw-light small-font-13'>Weâ€™ll promote your discounts across multiple channels to generate new leads from every potential avenue.</p>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item'>
                                    <Image style={{ objectFit : "contain" }} width={60} height={60} alt='monitor' src='/img/thumbs-up.png' />
                                    <h4 className='text-white fw-bold'>Showcase Your Offers</h4>
                                    <p className='text-white fw-light small-font-13'>Weâ€™ll promote your discounts across multiple channels to generate new leads from every potential avenue.</p>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item'>
                                    <Image style={{ objectFit : "contain" }} width={60} height={60} alt='monitor' src='/img/offer.png' />
                                    <h4 className='text-white fw-bold'>Delivery Management <span className='small-font-11'>( Coming Soon )</span></h4>
                                    <p className='text-white fw-light small-font-13'>Weâ€™ll promote your discounts across multiple channels to generate new leads from every potential avenue.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-5 col-xs-12'></div>
                </div>
            </div>
        </div>

        <div className='user-friendly pt-5'>
            <div className='container pt-5 mw-100 p-0'>
                <div className='row align-items-center p-0'>
                    <div className='col-md-6 col-xs-12 p-0'>
                        <Image style={{ objectFit : "contain" }} className='img-friendly' width={700} height={600} alt='ic1' src='/img/mob.png' />
                    </div>
                    <div className='col-md-6 col-xs-12'>
                        <div className='px-5 w-75 my-4'>
                            <h3 className='fw-bold'>User-Friendly</h3>
                            <p>We have designed A user-friendly app with a range of customizable offers and loyalty options suited to your business needs. We enhance the customer experience, with an easy-to-redeem system via early booking reservations and lifetime redeems</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='join-us py-5' ref={aboutSection}>
            <div className='container'>

                <div className='head-title text-center py-4'>
                    <h2>{t('becomePartner.joinUs')}</h2>
                    <p>{t('becomePartner.letUsBefore')}</p>
                </div>

                <div className='row auth py-5'>
                    <div className='col-md-12 col-xs-12'>
                        <form onSubmit={handleSubmit(submitHandler)} className=''>
                            <div className='row'>
                                <div className='col-md-6 col-xs-12 mb-4'>
                                    <InputText 
                                        label={t('becomePartner.businessName')} 
                                        {...register('business_name')} 
                                        errorMessage={errors.business_name && errors.business_name.message}
                                    />
                                </div>
                                <div className="col-md-6 col-xs-12 mb-4">
                                        <label className='mb-2 fw-light'>{t('app.busCategory')}</label>
                                    <div className="select-add select-full p-0">
                                            <Controller
                                                control={control}
                                                defaultValue={''}
                                                name='category_id'
                                                render={({ field, id, ref })=>
                                                    <InputSelect
                                                        inputRef={ref}
                                                        // value={nationalityOptions.find(c => c.id === id)}
                                                        onChange={val => field.onChange(val.value)}
                                                        isLoading={isCategoriesDataLoading}
                                                        options={categoriesData?.categories.map(item=>({label:item.name,value:item.id}))}
                                                        // errorMessage={errors.category_id && errors.category_id.message}
                                                        placeholder={t('register.placeholders.select')}
                                                    />
                                                }
                                            />
                                    </div>
                                    {errors.category_id && errors.category_id.message && <small className='text-danger'>{errors.category_id.message}</small>}
                                </div>
                                <div className="col-md-6 col-xs-12 mb-4">
                                    <InputText 
                                        label={t('register.labels.first_name')} 
                                        {...register('first_name')} 
                                        errorMessage={errors.first_name && errors.first_name.message}
                                    />
                                </div>
                                <div className="col-md-6 col-xs-12 mb-4">
                                    <InputText 
                                        label={t('register.labels.last_name')} 
                                        {...register('last_name')} 
                                        errorMessage={errors.last_name && errors.last_name.message}
                                    />
                                </div>
                                <div className='col-md-6 col-xs-12 mb-4'>
                                    <label className='mb-2 fw-light'>{t('register.labels.phone')}</label>
                                    <div className={'d-flex justify-content-center align-items-center'}>
                                        <div className="select-add phone-select p-0">
                                            <Controller
                                                control={control}
                                                defaultValue={''}
                                                name='country_code'
                                                render={({ field, value, ref })=>
                                                    <InputSelect
                                                        error={(errors.phone && errors.phone.message) || (errors.country_code && errors.country_code.message)}
                                                        inputRef={ref}
                                                        value={codeCountry.find(c => c.value === value)}
                                                        onChange={val => field.onChange(val.value)}
                                                        placeholder={t('register.placeholders.select')}
                                                        withInput
                                                        options={codeCountry.map(item=>({label:item.value,value:item.value}))}
                                                    />
                                                }
                                            />
                                        </div>
                                        <div className="flex-fill">
                                            <InputText
                                                withSelect {...register('phone')} 
                                                hasError={(errors.phone && errors.phone.message) || (errors.country_code && errors.country_code.message)}
                                            />
                                        </div>
                                    </div>
                                    {errors.country_code && <small className='text-danger'>{errors.country_code.message}</small>}
                                    {errors.phone && <small className='text-danger'>{errors.phone.message}</small>}
                                </div>
                                <div className="col-md-6 col-xs-12 mb-4">
                                    <InputText 
                                        label={t('register.labels.email')} 
                                        {...register('email')} 
                                        errorMessage={errors.email && errors.email.message}
                                    />
                                </div>
                                <div className="col-md-6 col-xs-12 mb-4">
                                        <label className='mb-2 fw-light'>{t('booking.Reserve.country')}</label>
                                    <div className="select-add select-full p-0">
                                        <Controller
                                            control={control}
                                            defaultValue={''}
                                            name='country_id'
                                            render={({ field, id, ref })=>
                                                <InputSelect
                                                    inputRef={ref}
                                                    // value={nationalityOptions.find(c => c.id === id)}
                                                    onChange={val => field.onChange(val.value)}
                                                    options={countriesData?.countries.map(item=>({label:item.name,value:item.id}))}
                                                    isLoading={isCountriesDataLoading}
                                                    // errorMessage={errors.country_id && errors.country_id.message}
                                                    placeholder={t('register.placeholders.select')}
                                                />
                                            }
                                        />
                                    </div>
                                    {errors.country_id && errors.country_id.message && <small className='text-danger'>{errors.country_id.message}</small>}
                                </div>
                                {watchCountry && <div className="col-md-6 col-xs-12 mb-4">
                                    <div className="select-add">
                                        <label className='mb-2 fw-light'>City</label>
                                        <Controller
                                            control={control}
                                            defaultValue={''}
                                            name='city_id'
                                            render={({ field, id, ref })=>
                                                <InputSelect
                                                    inputRef={ref}
                                                    // value={nationalityOptions.find(c => c.id === id)}
                                                    onChange={val => field.onChange(val.value)}
                                                    isLoading={isCitiesDataLoading}
                                                    options={citiesData?.cities.map(item=>({label:item.name,value:item.id}))}
                                                    errorMessage={errors.city_id && errors.city_id.message}
                                                    placeholder={t('register.placeholders.select')}
                                                />
                                            }
                                        />
                                    </div>
                                </div>}
                            </div>
                            { 
                                isLoading ?
                                <button className='btn-button bgMainColor text-white d-table m-auto my-4'>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                                </button>
                                : 
                                <button className='btn-button bgMainColor text-white d-table m-auto my-4' type={'submit'}>
                                    <span>{t('becomePartner.joinNow')}</span>
                                </button>
                            }
                        </form>
                    </div>
                </div>

            </div>
        </div>

    </div>
  )
}