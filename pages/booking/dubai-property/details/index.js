import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
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
import {GalleryModalForm} from "../../../../components/ModalForms/GalleryModalForm";
import { InputText } from "../../../../components/Inputs/InputText";

import { showModalAction } from "../../../../redux-toolkit/actions";
import {ModalForm} from "../../../../components/ModalForms/ModalForm";

export default function PropertyDetails() {

    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch()

    const galleryOptions = [
        {id:1,src:'/img/become.png'},
        {id:2,src:'/img/become.png'},
        {id:3,src:'/img/become.png'},
        {id:4,src:'/img/become.png'},
        {id:5,src:'/img/become.png'},
        {id:6,src:'/img/banner.png'},
    ];

    const cancellationPolicy = () => {
        dispatch(showModalAction(
        <ModalForm title={'cancellation policy'}>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam exercitationem nemo cupiditate cumque nihil facilis, aspernatur velit iure nobis eos modi aliquam ipsam id sed consectetur mollitia assumenda?</p>
        </ModalForm>))
    }

  return (
    <div className='become-partner py-5'>
        
        <div className='container'>

            <h4 className='mt-0 mb-4 fw-light'>FULLY FURNISHED | 1 BHK</h4>

            <div className='row'>

                <div className='col-md-8 col-xs-12'>
                    <div className='slide-de border'>
                        <GalleryModalForm gallery={galleryOptions}/>
                    </div>
                </div>

                <div className='col-md-4 col-xs-12'>
                    <div className='old-shadow p-3 border text-center'>
                        <Image unoptimized={true} className='my-4' style={{ objectFit : "contain" }} width={200} height={35} src={'/img/logo.png'} alt="logo" />
                        <h5 className='my-4 fw-light'>Emaar Properties Abu Dhabi (UAE) - Rentals</h5>
                        <div className='my-4'>
                            <div className='d-flex align-items-center my-3'>
                                <i className='icon-call fs-3 mainColor'></i>
                                <span className='mx-2'>+971 123456789</span>
                            </div>
                            <div className='d-flex align-items-center my-3'>
                                <i className='icon-mail fs-3 mainColor'></i>
                                <span className='mx-2'>info@example.com</span>
                            </div>
                            <div className='d-flex align-items-center my-3'>
                                <i className='icon-internet fs-3 mainColor'></i>
                                <span className='mx-2'>www.example.com</span>
                            </div>
                        </div>
                        <iframe width={'100%'} height={'200'} src={`https://maps.google.com/maps?q=26.8206,30.8025&z=15&output=embed`} frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>
                    </div>
                </div>

            </div>

            <div className='row'>
                <div className='col-md-6 col-xs-12'>
                    <div className='info-de-sale py-4'>
                        <div className='d-flex align-items-center justify-content-between'>
                            <h4 className=''>
                                AED 1,133,888 <span className='mainColor'>/ YEARLY</span>
                            </h4>
                            <span className="bgMainColor p-1 rounded-pill small-font-12 text-white px-2 d-inline-block my-2">40% Off</span>
                        </div>
                        <div className='d-flex align-items-center'>
                            <i className='icon-location mainColor fs-5'></i>
                            <h6 className="fw-light mx-2">Emaar Heights, JVC District 10, Jumeirah Village Circle (JVC), Dubai</h6>
                        </div>
                        <div className="d-flex my-3">
                            <div className="d-flex align-items-center me-3 border px-2 py-1">
                                <span className='mx-1'>3</span>
                                <i className='icon-bed mainColor mx-2'></i>
                            </div>
                            <div className="d-flex align-items-center me-3 border px-2 py-1">
                                <span className='mx-1'>1</span>
                                <i className='icon-twin-beds mainColor mx-2'></i>
                            </div>
                            <div className="d-flex align-items-center me-3 border px-2 py-1">
                                <span className='mx-1'>3</span>
                                <i className='icon-cleaning mainColor mx-2'></i>
                            </div>
                        </div>
                        <p className='mt-5'>
                        Peace Homes Real Estate is ecstatic to be able to provide you with stunning and beautifully built apartments in Plazzo Heights. 
                        <br /><br />
                        - A single bedroom
                        <br />
                        - 2 Baths 
                        <br />
                        - It is brand new. 
                        <br />
                        - Move in ready 
                        <br />  <br /><br />
                        AMENITIES: 
                        <br /><br />
                        Sauna 
                        <br />
                        Pool 
                        <br />
                        Covered Parking 
                        <br />
                        Security is available at all times. 
                        <br />
                        Area for Barbecue 
                        <br />
                        Children's Playground
                        <br /> 
                        Gym 
                        <br />  <br /><br />
                        Enjoy the abundance of natural light, modern design, graceful layout, and natural materials palette. Each facility features at least one private terrace, which is ideal for relaxing and taking in the scenery. On the terrace, there is a children's playground as well as a barbecue. The condo has a modern appearance with gray marble in the foyer and first-class amenities.
                        </p>
                    </div>
                    <div className=''>
                        <h5 className='border-dotted py-3'>Building Information</h5>
                        <div className='border my-4'>
                            <div className='d-flex align-items-center'>
                                <h6 className='m-0 p-3 w-50 border-bottom fw-light'>Building Name</h6>
                                <h6 className='m-0 p-3 w-50 border-bottom border-start'>Emaar Heights</h6>
                            </div>
                            <div className='d-flex align-items-center'>
                                <h6 className='m-0 p-3 w-50 border-bottom fw-light'>Year of Completion</h6>
                                <h6 className='m-0 p-3 w-50 border-bottom border-start'>2021</h6>
                            </div>
                            <div className='d-flex align-items-center'>
                                <h6 className='m-0 p-3 w-50 border-bottom fw-light'>Total Floors</h6>
                                <h6 className='m-0 p-3 w-50 border-bottom border-start'>43</h6>
                            </div>
                            <div className='d-flex align-items-center'>
                                <h6 className='m-0 p-3 w-50 border-bottom fw-light'>Total Parking Spaces</h6>
                                <h6 className='m-0 p-3 w-50 border-bottom border-start'>3</h6>
                            </div>
                            <div className='d-flex align-items-center'>
                                <h6 className='m-0 p-3 w-50 border-bottom fw-light'>Elevators</h6>
                                <h6 className='m-0 p-3 w-50 border-bottom border-start'>4</h6>
                            </div>
                            <div className='d-flex align-items-center'>
                                <h6 className='m-0 p-3 w-50 border-bottom fw-light'>Swimming Pools</h6>
                                <h6 className='m-0 p-3 w-50 border-bottom border-start'>2</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-6 col-xs-12'>
                    <div className='p-4 rounded-3 old-shadow box-result my-4'>
                        <h5>BOOKING CARD REQUEST</h5>
                        <h5>FULLY FURNISHED | 1 BHK</h5>
                        <h3 className='my-4'>AED 1,133,888 <span className='mainColor'>/ YEARLY</span></h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam exercitationem nemo cupiditate cumque nihil facilis, aspernatur velit iure nobis eos modi aliquam ipsam id sed consectetur mollitia assumenda?</p>
                        <div className='row'>
                            <div className="col-md-12 col-xs-12 mb-4">
                                <label className='fw-light mb-2 small-font-13'>{t('favouritesProfile.name')}</label>
                                <InputText className='small-font-13' placeholder={'Sh3wZa'} disabled/>
                            </div>
                            <div className="col-md-6 col-xs-12 mb-4">
                                <label className='fw-light mb-2 small-font-13'>{t('booking.Reserve.email')}</label>
                                <InputText className='small-font-13' placeholder={'Sh3wZa@gmail.com'} disabled/>
                            </div>
                            <div className="col-md-6 col-xs-12 mb-4">
                                <label className='fw-light mb-2 small-font-13'>{t('booking.Reserve.phone')}</label>
                                <InputText className='small-font-13' placeholder={'+204324324234'} disabled/>
                            </div>
                            <div className="col-md-12 col-xs-12">
                                <label className='fw-light mb-2 small-font-13'>Additional Directions (Optional)</label>
                                <textarea />
                            </div>
                        </div>
                        <div className="bgGrayColor p-3 my-4">
                            <div className="d-flex">
                                <span className="mainColor fw-light">{t('booking.Reserve.note')}</span>
                                <p className="fw-light m-0 mx-2">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
                                </p>
                            </div>
                            <div className="d-flex align-items-center justify-content-end mt-3">
                                <h6 className="fw-light m-0 mx-2">{t('booking.Reserve.cancellation')}</h6>
                                <button className="icon-info mainColor" onClick={cancellationPolicy} />
                            </div>
                        </div>
                        <button className={'bgMainColor btn-button text-white w-auto my-4 d-table m-auto px-4'}>
                            {t("booking.Reserve.sendBooKing")}
                        </button>
                    </div>
                </div>
            </div>

        </div>

    </div>
  )
}

