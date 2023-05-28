import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {LoadData, Slider} from '../../../components';
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useApi } from "../../../hooks/useApi";
import {getAllCountries, getMerchantDetails} from "../../../redux-toolkit/actions/axiosCalls";
import Link from "next/link";
import Image from 'next/image';


export default function TitleName() {
  
    const { t }                                         = useTranslation();
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);
    const router                                        = useRouter()
    const {id}                                          = router.query


    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    const {
        data:eventDetails,
        isLoading:isEventDetailsLoading,
        reFetch:refetchEventDetails
    } = useApi(()=> getMerchantDetails(user.token,langVal,currency,id),false)
    useEffect(()=>{
        if (id) refetchEventDetails()
    },[id])

    if (isEventDetailsLoading) return <LoadData/>

    if(user === null) return null;
    
    return (
      <div className='page-events'>
          

            <div className=''>


                <div className='container'>

                    <div className='row py-5'>

                        <div className='col-md-6 col-xs-12'>
                            <Image className='w-100 rounded-1' width={188} height={400} alt='phone' src={eventDetails.merchants.cover}/>
                        </div>

                        <div className='col-md-6 col-xs-12'>
                            <p>{eventDetails.merchants.description}</p>
                        </div>

                    </div>

                    <div className='mt-5 mb-4 head-tit-info d-flex justify-content-between align-items-center'>
                        <h4 className='m-0'>{t('events.availableEvents')}</h4>
                    </div>

                    <div className='row pb-5'>
                        {eventDetails.merchants.events.length > 0
                            ? eventDetails.merchants.events.map(event =>
                                <div key={event.id} className='col-md-3 col-xs-12'>
                                    <Link href={`/events/details/event-details?id=${id}&event=${event.id}`} className='d-block item-event item-cate my-3 position-relative'>
                                        <div className='img-event overflow-hidden rounded-3 old-shadow'>
                                            <Image className='w-100' width={188} height={200} alt='phone' src={event.image}/>
                                        </div>
                                        <div className='info-event p-3 bg-white rounded-3 old-shadow'>
                                            <h6 className='mt-0'>{event.title}</h6>
                                            <div className='d-flex align-items-center my-3'>
                                                <i className='icon-paperclip small-font-13'/>
                                                <span className='mx-2 small-font-13'>
                                                    {event.tickets.length > 1
                                                        ? (currency + ' ' + event.tickets[0].price + ' -- ' + currency + ' ' + event.tickets[event.tickets.length -1].price)
                                                        : (currency + ' ' + event.tickets[0].price)
                                                    }
                                                    {/*{currency + ' ' + event.tickets[0].price + ' -- ' + currency + ' ' + event.tickets[event.tickets.length -1].price}*/}
                                                </span>
                                            </div>
                                            <div className='bgGrayColor p-2 rounded-1 d-flex justify-content-between align-items-center'>
                                                <div className='d-flex align-items-center'>
                                                    <i className='icon-date small-font-13'/>
                                                    <span className='mx-2 small-font-13'>{event.date}</span>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <i className='icon-clock small-font-13'/>
                                                    <span className='mx-2 small-font-13'>{event.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )
                            : <div className='modal-height-view d-flex justify-content-center align-items-center'>
                                <h4 className='m-0 text-danger'>{t('events.noEvAvailable')}</h4>
                            </div>
                        }
                    </div>

                    {/*<div className='text-center mb-5'>*/}
                    {/*    <p className='grayColor mb-3'>You viewed 9 of 50 items</p>*/}
                    {/*    <button className='btn-button w-auto px-5 border-main bg-white'>Load more</button>*/}
                    {/*</div>*/}

                </div>

                <div className='d-flex up-download'>
                    <div className='container-fluid p-0'>
                        <div className='row p-0 m-0'>
                            <div className='col-md-6 col-xs-12 bgSecondColor p-2 none-mobile-section'>
                                <div className='phone-down' data-aos="fade-left" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
                                    <Image style={{ objectFit : "contain" }} width={633} height={836} alt='phone' src='/img/phone.png'/>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-12 BG-2 bg-img bgMainColor p-2 d-flex flex-column justify-content-center align-items-center overflow-hidden'>
                                <div className='overflow-hidden' data-aos="fade-up" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
                                    <h2 className='fw-normal mt-0 text-white'>{t("app.downloadDeal")}</h2>
                                    <h2 className='fw-normal text-white'>{t("app.treasureDeal")}</h2>
                                    <h6 className='fw-light text-white my-3'>{t("app.downloadApp")}</h6>
                                    <div className='in-down'>
                                        <Image style={{ objectFit : "contain" }} width={188} height={56} alt='phone' src='/img/google-play.png'/>
                                        <Image style={{ objectFit : "contain" }} width={188} height={56} className='mx-3' alt='phone' src='/img/app-store.png'/>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    
                </div>


            </div>

      </div>
    )
}