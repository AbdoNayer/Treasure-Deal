import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {useForm,Controller} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from "react-i18next";
import app from "../../app.json";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/effect-fade"
import "swiper/components/navigation"
// import required modules
import SwiperCore, {
    EffectFade, Navigation
} from 'swiper';
import * as yup from 'yup';
import { countries } from '../../redux-toolkit/actions';

import { InputSelect } from "../../components/Inputs/InputSelect";
import { InputText } from "../../components/Inputs/InputText";
import codeCountry from "../../codeCountry.json";
import Image from 'next/image';
SwiperCore.use([EffectFade,Navigation]);


export default function BecomePartner2() {

    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch();
    const langVal                                       = useSelector((state) => state.language.language);
    const nationalityOptions                            = useSelector((state) => state.countries.countries);
    const [ isName, setIsName ]                         = useState('');
    const [ isLoading,setIsLoading ]                    = useState(false);
    const [ actCateClass, setActCateClass ]             = useState('');
    const [ actSubClass, setActSubClass ]               = useState('');
    const currency                               = useSelector((state) => state.currency.currency);

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

    const fetchData = () => {

        dispatch(countries(langVal,currency));
    
    }
    
    useEffect(() => { fetchData(); }, []);
    

    const onShowCategory = (name, i) => { setIsName(name); setActCateClass(i) }

    const onShowSubCategory = (i) => setActSubClass(i);

    let registerSchema = yup.object().shape({
        business_name:yup.string().required(t('register.form_errors.business_name')),
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
        dob:yup.string().required(t('register.form_errors.dob')),
        gender:yup.string().required(t('register.form_errors.gender')),
        password:yup.string().required(t('register.form_errors.password.required'))
            .min(6,t('register.form_errors.password.min')),
        confirm_password:yup.string().required(t('register.form_errors.confirm_password.required'))
            .oneOf([yup.ref('password'), null],t('register.form_errors.confirm_password.matches')),
        nationality_id:yup.string().required(t('register.form_errors.nationality')),
        country_id:yup.string().required(t('register.form_errors.country')),
    });

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(registerSchema)
    });

    const submitHandler = data => {
        console.log(data);
    }

  return (
    <div className='become-partner pt-5'>
        
        <div className='container'>
            <div className='mb-5'>
                <div className='bg-content d-flex flex-column justify-content-center position-relative'>
                    <div className='content'>
                        <h4 className='text-white'>
                            Sell more with
                            <br />
                            smarter data!
                        </h4>
                        <p className='text-white my-3'>Numbers talk. So, we’ve created this platform to give you additional insights and help grow your business in all directions.</p>
                        <button className='btn-button bg-white'>{t('becomePartner.joinNow')}</button>
                    </div>
                    <Image style={{ objectFit : "contain" }} quality='100' width={407} height={411} alt='pin' src='/img/pin.png' className='pan old-shadow' />
                </div>

                <div className='logos d-flex align-items-center'>
                    <div className=''>
                        <Image style={{ objectFit : "contain" }} width={100} height={88} alt='ic1' src='/img/ic1.png' />
                    </div>
                    <div className=''>
                        <Image style={{ objectFit : "contain" }} width={100} height={88} alt='ic' src='/img/ic.png' />
                    </div>
                    <div className=''>
                        <Image style={{ objectFit : "contain" }} width={100} height={88} alt='ic1' src='/img/ic1.png' />
                    </div>
                </div>
            </div>
        </div>

        <div className='our-partners py-5'>
            <div className='container'>
                <div className='head-title py-4'>
                    <h2>How we can help our partners</h2>
                    <p>The things we’ve made happen that work a little too well</p>
                    <hr className='w-50' />
                </div>
                <div className='row my-4'>
                    <div className='col-md-6 col-xs-12'>
                        <div className='row'>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item old-shadow'>
                                    <Image style={{ objectFit : "contain" }} width={70} height={70} alt='111' src='/img/003.png' />
                                    <h5 className='fw-light'>Higher footfall</h5>
                                    <p className='fw-light'>Attract more customers to your venue through our offers</p>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item old-shadow'>
                                    <Image style={{ objectFit : "contain" }} width={70} height={70} alt='222' src='/img/004.png' />
                                    <h5 className='fw-light'>Brand awareness</h5>
                                    <p className='fw-light'>Tell the world who you are through digital advertising</p>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item old-shadow'>
                                    <Image style={{ objectFit : "contain" }} width={70} height={70} alt='333' src='/img/001.png' />
                                    <h5 className='fw-light'>Customer knowledge</h5>
                                    <p className='fw-light'>Understand your customers better with data insights & analytics</p>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-12'>
                                <div className='block-item old-shadow'>
                                    <Image style={{ objectFit : "contain" }} width={70} height={70} alt='444' src='/img/002.png' />
                                    <h5 className='fw-light'>Cross-promotion</h5>
                                    <p className='fw-light'>Be featured not just on our app, but also on our corporate partners’ apps</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 col-xs-12'>
                        <div className='text-center pt-5'>
                            <Image style={{ objectFit : "contain" }} quality='100' width={470} height={470} alt='shape' src='/img/shape.png' />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='my-4 our-category'>
            <div className='container'>
                
                    <div className='head-title py-4'>
                        <h2>What’s on offer?</h2>
                        <p>The things we’ve made happen that work a little too well</p>
                        <hr className='w-50' />
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
                            className={'td-categories-swiper'}
                        >
                            {app.itemCategory.map((item, i) => (
                                <SwiperSlide className={''} key={i}>
                                <div className=''>
                                        <div>
                                            <button onClick={()=>onShowCategory(item.name, i)} className={`${i === actCateClass ? 'active' : ''} img-item position-relative`}>
                                                <Image style={{ width: "100%", height : "100%" }} width={318} height={318} alt='img' src={item.img} />
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
                    {/*{*/}
                    {/*    app.itemCategory.map((item, i) => (*/}
                    {/*        <div className='col-md-2 col-xs-12 px-2 my-2' key={i}>*/}
                    {/*            <div>*/}
                    {/*              <button onClick={()=>onShowCategory(item.name, i)} className={`${i === actCateClass ? 'active' : ''} img-item position-relative`}>*/}
                    {/*                  <Image style={{ width: "100%", height : "100%" }} width={318} height={318} alt='img' src={item.img} />*/}
                    {/*                  <div className='over-item p-2'>*/}
                    {/*                      <h5 className='text-white fw-light'>{item.name}</h5>*/}
                    {/*                  </div>*/}
                    {/*              </button>*/}
                    {/*            </div>*/}
                    {/*        </div>          */}
                    {/*    ))*/}
                    {/*}*/}
                    </div>

                    {
                        actCateClass || actCateClass === 0 ?
                        <div className='section-fading bgGrayColor rounded-3 p-3 my-4'>
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
                                    {
                                        image.map((item, i) => (
                                            <SwiperSlide key={i}>
                                                <button onClick={()=> onShowSubCategory(i)} className={`${i === actSubClass ? 'active' : ''} block-img flex-fill position-relative rounded-3 bgWhiteColor d-flex justify-content-center align-items-center`}>
                                                    <Image style={{ objectFit : "contain" }} width={100} height={100} alt='img' src={item} />
                                                </button>
                                            </SwiperSlide>
                                        ))
                                    }
                                </Swiper>

                            {/*</div>*/}
                            {
                            actSubClass || actSubClass === 0 ?
                            <div className='info-brand mx-3 rounded-3 bgWhiteColor p-3 my-3'>
                                <p className='text-center fw-light'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,</p>
                            </div>
                            :
                            null
                            }
                        </div>
                        :
                        null
                    }

            </div>
        </div>

        <div className='our-solutions my-5 py-5'>
            <div className='container'>
                
                <div className='head-title py-4'>
                    <h2>Our solutions</h2>
                    <p>The things we’ve made happen that work a little too well</p>
                    <hr className='w-50' />
                </div>
                
                <div className='row py-5'>
                    <div className='col-md-4 col-xs-12'>
                        <div className='block-item'>
                            <Image style={{ objectFit : "contain" }} width={60} height={60} alt='digital' src='/img/digital-marketing.png' />
                            <h4 className='text-white fw-light'>Digital advertising</h4>
                            <p className='text-white fw-light'>Generate new leads through multiple channels</p>
                        </div>
                        <div className='block-item'>
                            <Image style={{ objectFit : "contain" }} width={60} height={60} alt='website' src='/img/website-content.png' />
                            <h4 className='text-white fw-light'>Enjoy more brand visibility</h4>
                            <p className='text-white fw-light'>Be a part of white label apps to boost your brand further</p>
                        </div>
                        <div className='block-item'>
                            <Image style={{ objectFit : "contain" }} width={60} height={60} alt='monitor' src='/img/monitor.png' />
                            <h4 className='text-white fw-light'>Data Reporting</h4>
                            <p className='text-white fw-light'>Know your customers’ profiles, wants & needs</p>
                        </div>
                    </div>
                    <div className='col-md-4 col-xs-12'>
                        <div className=''>
                            <Image style={{ objectFit : "contain", width: '100%' }} width={128} height={840} alt='company' src='/img/company.png' />
                        </div>
                    </div>
                    <div className='col-md-4 col-xs-12'>
                        <div className='block-item'>
                            <Image style={{ objectFit : "contain" }} width={60} height={60} alt='management' src='/img/management.png' />
                            <h4 className='text-white fw-light'>Manage Table Reservations</h4>
                            <p className='text-white fw-light'>Stay prepared & improve traffic to your venue</p>
                        </div>
                        <div className='block-item'>
                            <Image style={{ objectFit : "contain" }} width={60} height={60} alt='thumbs' src='/img/thumbs-up.png' />
                            <h4 className='text-white fw-light'>Hassle-free delivery service</h4>
                            <p className='text-white fw-light'>With our platform, you can oversee orders from start to finish</p>
                        </div>
                        <div className='block-item'>
                            <Image style={{ objectFit : "contain" }} width={60} height={60} alt='offer' src='/img/offer.png' />
                            <h4 className='text-white fw-light'>Enlist your offers</h4>
                            <p className='text-white fw-light'>Join thousands of brand that are already enjoying the benefits</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div className='about-treasuredeal py-5'>
            <div className='container'>

                <div className='head-title py-4 text-center'>
                    <h2>What our partners say about <br/> Treasuredeal</h2>
                    <hr className='w-50 my-3 m-auto' />
                </div>

                <Swiper
                    effect          = {"fade"}
                    className       = "my-swiper-about"
                    navigation      = {true}
                    slidesPerView   = {3}
                    modules         = {[EffectFade, Navigation]}
                >
                    {
                        imgLogos.map((item, i) => (
                            <SwiperSlide key={i}>
                                <div className='item-vip'>
                                    <div className='img'>
                                        <Image style={{ objectFit : "contain" }} width={100} height={100} alt='management' src={item.img} />
                                    </div>
                                    <h4 className='fw-light'>{item.title}</h4>
                                    <h6 className='fw-light'>{item.name}</h6>
                                    <p className='fw-light'>{item.disc}</p>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>

            </div>
        </div>

        <div className='join-us mt-5 py-5'>
            <div className='container'>

                <div className='head-title py-4'>
                    <h2>Start growing with Treasuredeal</h2>
                    <p>Feeling inspired ? We’d love to hear from you!</p>
                    <hr className='w-50 my-3' />
                </div>

                <div className='row auth py-5'>
                    <div className='col-md-6 col-xs-12'>
                        <form onSubmit={handleSubmit(submitHandler)} className=''>
                            <div className='row'>
                                <div className='col-md-12 mb-4'>
                                    <InputText 
                                        label={t('becomePartner.businessName')} 
                                        {...register('business_name')} 
                                        errorMessage={errors.business_name && errors.business_name.message}
                                    />
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
                                        <div className="select-add phone-select">
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
                                    <div className="select-add">
                                        <label className='mb-2 fw-light'>{t('register.labels.nationality')}</label>
                                        {
                                            nationalityOptions ?
                                            <Controller
                                                control={control}
                                                defaultValue={''}
                                                name='nationality_id'
                                                render={({ field, id, ref })=>
                                                    <InputSelect
                                                        inputRef={ref}
                                                        value={nationalityOptions.find(c => c.id === id)}
                                                        onChange={val => field.onChange(val.value)}
                                                        options={nationalityOptions.map(item=>({label:item.name,value:item.id}))}
                                                        errorMessage={errors.nationality_id && errors.nationality_id.message}
                                                        placeholder={t('register.placeholders.select')}
                                                    />
                                                }
                                            />
                                            :
                                            ''
                                        }
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12 mb-4">
                                    <div className="select-add">
                                        <label className='mb-2 fw-light'>{t('register.labels.country')}</label>
                                        {
                                            nationalityOptions ?
                                            <Controller
                                                control={control}
                                                defaultValue={''}
                                                name='country_id'
                                                render={({ field, id, ref })=>
                                                    <InputSelect
                                                        inputRef={ref}
                                                        value={nationalityOptions.find(c => c.id === id)}
                                                        onChange={val => field.onChange(val.value)}
                                                        options={nationalityOptions.map(item=>({label:item.name,value:item.id}))}
                                                        errorMessage={errors.country_id && errors.country_id.message}
                                                        placeholder={t('register.placeholders.select')}
                                                    />
                                                }
                                            />
                                            :
                                            ''
                                        }
                                    </div>
                                </div>
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
                    <div className='col-md-6 col-xs-12'>
                        <div className=''>
                            <Image style={{ objectFit : "contain", width : '100%' }} quality='100' width={100} height={540} alt='join' src='/img/join.png' className='rounded-3' />
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
  )
}
  