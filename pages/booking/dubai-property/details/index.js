import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
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
import {useApi} from "../../../../hooks/useApi";
import {
    getMerchantDetails,
    getMerchantServices,
    sendPropertyBookingRequest
} from "../../../../redux-toolkit/actions/axiosCalls";
import {LoadData} from "../../../../components";
import {useRouter} from "next/router";
import Calendar from "react-calendar";
import {InputSelect} from "../../../../components/Inputs/InputSelect";
import {ErrorModalForm} from "../../../../components/ModalForms/ErrorModalForm";
import Toastify from "toastify-js";
import {t} from "i18next";

export default function PropertyDetails() {

    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch()
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);
    const router                                        = useRouter();
    const {id,voucherId,serviceId}                      = router.query
    const [showCalendar,setShowCalendar]                = useState(false)
    const [dateStart,setDateStart]                      = useState(new Date())
    const [selectedTime,setSelectedTime]                = useState('')
    const [selectedNotes,setSelectedNotes]              = useState('')
    const [errorMessage,setErrorMessage]                = useState('')
    const [isSubmitting,setIsSubmitting]                = useState(false)
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

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
    const galleryOptions = [
        {id:1,src:'/img/become.png'},
        {id:2,src:'/img/become.png'},
        {id:3,src:'/img/become.png'},
        {id:4,src:'/img/become.png'},
        {id:5,src:'/img/become.png'},
        {id:6,src:'/img/banner.png'},
    ];

    //#region separate shift to timings
    const getTimeIntervals = (shiftStart,shiftEnd,interval=15) => {
        let startTime = parseInt(shiftStart.split(':')[0])*60;
        let endTime = parseInt(shiftEnd.split(':')[0])*60;
        if (endTime < startTime || endTime === startTime) {
            endTime = endTime + (60*24)
        }
        let ap = ['AM', 'PM'];
        let times = []
        for (let i=0; startTime<endTime; i++) {
            let hh = Math.floor(startTime/60); // getting hours of day in 0-24 format
            let mm = (startTime%60); // getting minutes of the hour in 0-55 format
            //#region old pm and am time format code block
            // times[i] =(hh!==12 ? ("0" + (hh % 12)).slice(-2) : 12 )+ ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
            //#endregion
            times[i] =(hh < 10 ? ("0" + hh) : (hh===24 ? '00' : hh) )+ ':' + ("0" + mm).slice(-2); // pushing data in array in [00:00 - 24:00 AM/PM format]
            startTime = startTime + interval;
        }
        return times
    }
    //#endregion

    //#region booking request
    const errorPopUp = (title,message,button=t('millionaire.lotto.pop_ups.error_popup.no_bundles.button')) => {
        dispatch(showModalAction(<ErrorModalForm
            title={title}
            message={message}
            buttonMessage={button}
        />))
    }

    const submitBookingRequest = () => {
        if (!selectedTime) {
            errorPopUp(
                'No Time Selected',
                'Select Arrival time before submitting'
            )
            return
        }
        setIsSubmitting(true)
        setErrorMessage('')
        const bookingObject = {
            merchant_id:id,
            date:dateStart,
            time:selectedTime,
            notes:selectedNotes,
            services: JSON.stringify([{id:serviceId,price_id:0}])
        };
        (async () => await sendPropertyBookingRequest(user.token,langVal,currency,bookingObject))()
            .then(r=> {
                    Toastify({
                        text: "Request sent successfully",
                        duration: 3000,
                        gravity: "top",
                        position: langVal === 'en' ? "left" : "right",
                        style: {
                            background: "#007427",
                        }
                    }).showToast()
                    setIsSubmitting(false)
                }
            )
            .catch(e=> {
                console.log(e)
                setErrorMessage(e.response.data.msg)
                setIsSubmitting(false)
            })
    }
    //#endregion

    const cancellationPolicy = () => {
        dispatch(showModalAction(
        <ModalForm title={t('app.titlePolicy')}>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam exercitationem nemo cupiditate cumque nihil facilis, aspernatur velit iure nobis eos modi aliquam ipsam id sed consectetur mollitia assumenda?</p>
        </ModalForm>))
    }
    if (isMerchantDetailsLoading||isMerchantServicesLoading) return <LoadData />

    if(user === null) return null;
  return (
    <div className='become-partner py-5'>
        
        <div className='container'>

            {/*<h4 className='mt-0 mb-4 fw-light'>FULLY FURNISHED | 1 BHK</h4>*/}

            <div className='row'>

                <div className='col-md-8 col-xs-12'>
                    {merchantServices.services.find(obj=>obj.id=== Number(serviceId))?.length > 0
                        ? <div className='slide-de border'>
                            <GalleryModalForm gallery={merchantServices.find(obj=>obj.id===serviceId).gallaries}/>
                        </div>
                        : <Image unoptimized={true} style={{width:"100%",height:"100%"}} priority width={318} height={318} src={galleryOptions[0].src} alt="gallery item"/>
                    }

                </div>

                <div className='col-md-4 col-xs-12'>
                    <div className='old-shadow p-3 border text-center'>
                        <Image unoptimized={true} className='my-4' style={{ objectFit : "contain" }} width={200} height={35} src={'/img/logo.png'} alt="logo" />
                        <h5 className='my-4 fw-light'>{merchantDetails.merchants.business_name}</h5>
                        <div className='my-4'>
                            {merchantDetails.merchants.full_phone && <div className='d-flex align-items-center my-3'>
                                <i className='icon-call fs-3 mainColor'/>
                                <span className='mx-2'>+{merchantDetails.merchants.full_phone}</span>
                            </div>}
                            {merchantDetails.merchants.email && <div className='d-flex align-items-center my-3'>
                                <i className='icon-mail fs-3 mainColor'/>
                                <span className='mx-2'>{merchantDetails.merchants.email}</span>
                            </div>}
                            {merchantDetails.merchants.website && <div className='d-flex align-items-center my-3'>
                                <i className='icon-internet fs-3 mainColor'/>
                                <span className='mx-2'>{merchantDetails.merchants.website}</span>
                            </div>}
                        </div>
                        <iframe width={'100%'} height={'200'} src={`https://maps.google.com/maps?q=${merchantDetails.merchants.lat},${merchantDetails.merchants.lng}&z=15&output=embed`} frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>
                    </div>
                </div>

            </div>

            <div className='row'>
                <div className='col-md-6 col-xs-12'>
                    <div className='info-de-sale py-4'>
                        <div className='d-flex align-items-center justify-content-between'>
                            <h4 className=''>
                                {currency + ' ' + merchantServices.services.find(obj=>obj.id=== Number(serviceId))?.price} <span className='mainColor'>/ YEARLY</span>
                            </h4>
                            {/*<span className="bgMainColor p-1 rounded-pill small-font-12 text-white px-2 d-inline-block my-2">40% Off</span>*/}
                        </div>
                        <div className='d-flex align-items-center'>
                            {/*<i className='icon-location mainColor fs-5'/>*/}
                            <h6 className="fw-light mx-2">{merchantServices.services.find(obj=>obj.id=== Number(serviceId))?.description}</h6>
                        </div>
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
                        {/*<p className='mt-5'>*/}
                        {/*Peace Homes Real Estate is ecstatic to be able to provide you with stunning and beautifully built apartments in Plazzo Heights. */}
                        {/*<br /><br />*/}
                        {/*- A single bedroom*/}
                        {/*<br />*/}
                        {/*- 2 Baths */}
                        {/*<br />*/}
                        {/*- It is brand new. */}
                        {/*<br />*/}
                        {/*- Move in ready */}
                        {/*<br />  <br /><br />*/}
                        {/*AMENITIES: */}
                        {/*<br /><br />*/}
                        {/*Sauna */}
                        {/*<br />*/}
                        {/*Pool */}
                        {/*<br />*/}
                        {/*Covered Parking */}
                        {/*<br />*/}
                        {/*Security is available at all times. */}
                        {/*<br />*/}
                        {/*Area for Barbecue */}
                        {/*<br />*/}
                        {/*    {"Children\'s Playground"}*/}
                        {/*<br /> */}
                        {/*Gym */}
                        {/*<br />  <br /><br />*/}
                        {/*    {"Enjoy the abundance of natural light, modern design, graceful layout, and natural materials palette. Each facility features at least one private terrace, which is ideal for relaxing and taking in the scenery. On the terrace, there is a children\'s playground as well as a barbecue. The condo has a modern appearance with gray marble in the foyer and first-class amenities."}*/}
                        {/*</p>*/}
                    </div>
                    {/*<div className=''>*/}
                    {/*    <h5 className='border-dotted py-3'>Building Information</h5>*/}
                    {/*    <div className='border my-4'>*/}
                    {/*        <div className='d-flex align-items-center'>*/}
                    {/*            <h6 className='m-0 p-3 w-50 border-bottom fw-light'>Building Name</h6>*/}
                    {/*            <h6 className='m-0 p-3 w-50 border-bottom border-start'>Emaar Heights</h6>*/}
                    {/*        </div>*/}
                    {/*        <div className='d-flex align-items-center'>*/}
                    {/*            <h6 className='m-0 p-3 w-50 border-bottom fw-light'>Year of Completion</h6>*/}
                    {/*            <h6 className='m-0 p-3 w-50 border-bottom border-start'>2021</h6>*/}
                    {/*        </div>*/}
                    {/*        <div className='d-flex align-items-center'>*/}
                    {/*            <h6 className='m-0 p-3 w-50 border-bottom fw-light'>Total Floors</h6>*/}
                    {/*            <h6 className='m-0 p-3 w-50 border-bottom border-start'>43</h6>*/}
                    {/*        </div>*/}
                    {/*        <div className='d-flex align-items-center'>*/}
                    {/*            <h6 className='m-0 p-3 w-50 border-bottom fw-light'>Total Parking Spaces</h6>*/}
                    {/*            <h6 className='m-0 p-3 w-50 border-bottom border-start'>3</h6>*/}
                    {/*        </div>*/}
                    {/*        <div className='d-flex align-items-center'>*/}
                    {/*            <h6 className='m-0 p-3 w-50 border-bottom fw-light'>Elevators</h6>*/}
                    {/*            <h6 className='m-0 p-3 w-50 border-bottom border-start'>4</h6>*/}
                    {/*        </div>*/}
                    {/*        <div className='d-flex align-items-center'>*/}
                    {/*            <h6 className='m-0 p-3 w-50 border-bottom fw-light'>Swimming Pools</h6>*/}
                    {/*            <h6 className='m-0 p-3 w-50 border-bottom border-start'>2</h6>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                <div className='col-md-6 col-xs-12'>
                    <div className='p-4 rounded-3 old-shadow box-result my-4'>
                        <h5>BOOKING CARD REQUEST</h5>
                        {/*<h5>FULLY FURNISHED | 1 BHK</h5>*/}
                        <h3 className='my-4'>{currency + ' ' + merchantServices.services.find(obj=>obj.id=== Number(serviceId))?.price} <span className='mainColor'>/ YEARLY</span></h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam exercitationem nemo cupiditate cumque nihil facilis, aspernatur velit iure nobis eos modi aliquam ipsam id sed consectetur mollitia assumenda?</p>
                        <div className='row'>

                            <div className="col-md-6 col-xs-12 mb-4">
                                <label className='fw-light mb-2 small-font-13'>{'Arrival Date'}</label>
                                <div className="td_booking_comp_availability_wrapper position-relative">
                                    <div className={'td_input_date d-flex align-items-center justify-content-between px-3'}>
                                        <div className="td_date">
                                            {dateStart.toLocaleDateString(undefined,options)}
                                        </div>
                                        <div className="td_date_open"><button onClick={()=>setShowCalendar(!showCalendar)} className='bg-transparent icon-date fs-4' /></div>
                                    </div>
                                    {
                                        showCalendar && <div className="td_calendar calendar-booking">
                                            <Calendar
                                                next2Label={null}
                                                prev2Label={null}
                                                minDetail={'month'}
                                                onChange={(e)=>{
                                                    setDateStart(e)
                                                    setShowCalendar(false)
                                                }}
                                                value={dateStart}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-12 mb-4">
                                <label className='fw-light mb-2 small-font-13'>{'Arrival Time'}</label>
                                <div className="select-add select-full">
                                    <InputSelect
                                        onChange={e => setSelectedTime(e.value)}
                                        options={getTimeIntervals('8:00','18:00',30).map(time => ({label: time, value: time}))}
                                    />
                                </div>
                            </div>
                            {/*<div className="col-md-6 col-xs-12 mb-4">*/}
                            {/*    <label className='fw-light mb-2 small-font-13'>{t('booking.Reserve.email')}</label>*/}
                            {/*    <InputText className='small-font-13' placeholder={'Sh3wZa@gmail.com'} disabled/>*/}
                            {/*</div>*/}
                            {/*<div className="col-md-6 col-xs-12 mb-4">*/}
                            {/*    <label className='fw-light mb-2 small-font-13'>{t('booking.Reserve.phone')}</label>*/}
                            {/*    <InputText className='small-font-13' placeholder={'+204324324234'} disabled/>*/}
                            {/*</div>*/}
                            <div className="col-md-12 col-xs-12">
                                <label className='fw-light mb-2 small-font-13'>Additional Directions (Optional)</label>
                                <textarea onChange={e=> setSelectedNotes(e.target.value)} />
                            </div>
                        </div>
                        <div className="bgGrayColor p-3 my-4">
                            <div className="d-flex">
                                <span className="mainColor fw-light">{t('booking.Reserve.note')}</span>
                                <p className="fw-light m-0 mx-2">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
                                </p>
                            </div>
                            <div className="d-flex align-items-center justify-content-end mt-3">
                                <h6 className="fw-light m-0 mx-2">{t('booking.Reserve.cancellation')}</h6>
                                <button className="icon-info mainColor" onClick={cancellationPolicy} />
                            </div>
                        </div>
                        <button className={'bgMainColor btn-button text-white w-auto my-4 d-table m-auto px-4'} onClick={submitBookingRequest}>
                            {isSubmitting
                                ? <span className={'spinner-border spinner-border-sm text-white'}/>
                                : <>{t("booking.Reserve.sendBooKing")}</>
                            }
                        </button>
                        {errorMessage && <div className={'text-center text-danger'}>{errorMessage}</div>}
                    </div>
                </div>
            </div>

        </div>

    </div>
  )
}

