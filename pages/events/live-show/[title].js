import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Slider } from '../../../components';
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useApi } from "../../../hooks/useApi";
import { getAllCountries } from "../../../redux-toolkit/actions/axiosCalls";
import Link from "next/link";
import Image from 'next/image';


export default function TitleName() {
  
    const { t }                                         = useTranslation();
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);

    const itemsArr = [
        {
            'id'        : 1,
            'img'       : '/img/im-1.png',
            'name'     : 'Majid Al Mohandis live',
            'price'     : 'AED 195 - AED 1250',
            'time'      : '08.00 PM',
            'date'      : '03-03-2023'
        },
        {
            'id'        : 2,
            'img'       : '/img/im-1.png',
            'name'     : 'Majid Al Mohandis live',
            'price'     : 'AED 195 - AED 1250',
            'time'      : '08.00 PM',
            'date'      : '03-03-2023'
        }
    ]

    //#region Countries and Cities
    const {
        data:countriesData,
        isLoading:isCountriesLoading,
    } = useApi(()=> getAllCountries(user.token,langVal,currency))

    return (
      <div className='page-events'>
          

            <div className=''>


                <div className='container'>

                    <div className='row py-5'>

                        <div className='col-md-6 col-xs-12'>
                            <Image className='w-100 rounded-1' width={188} height={400} alt='phone' src='/img/im-1.png'/>
                        </div>

                        <div className='col-md-6 col-xs-12'>
                            <p>
                            Welcome to City Walk Dubai, a creative lifestyle space where you can live, work and play. Built around movement, sharing and community, City Walk is where contemporary creativity thrives and everyone who visits is inspired to actively seek the unexpected.
                            Welcome to City Walk Dubai, a creative lifestyle space where you can live, work and play. Built around movement, sharing and community, City Walk is where contemporary creativity thrives and everyone who visits is inspired to actively seek the unexpected.
                            Welcome to City Walk Dubai, a creative lifestyle space where you can live, work and play. Built around movement, sharing and community, City Walk is where contemporary creativity thrives and everyone who visits is inspired to actively seek the unexpected.
                            Welcome to City Walk Dubai, a creative lifestyle space where you can live, work and play. Built around movement, sharing and community, City Walk is where contemporary creativity thrives and everyone who visits is inspired to actively seek the unexpected.
                            </p>
                        </div>

                    </div>

                    <div className='mt-5 mb-4 head-tit-info d-flex justify-content-between align-items-center'>
                        <h4 className='m-0'>Live Shows</h4>
                    </div>

                    <div className='row pb-5'>
                            {
                                itemsArr.map((item) => (
                                    <div key={item.id} className='col-md-3 col-xs-12'>
                                        <Link href={`/events/live-show/details`} className='d-block item-event item-cate my-3 position-relative'>
                                            <div className='img-event overflow-hidden rounded-3 old-shadow'>
                                                <Image className='w-100' width={188} height={200} alt='phone' src={item.img}/>
                                            </div>
                                            <div className='info-event p-3 bg-white rounded-3 old-shadow'>
                                                <h6 className='mt-0'>{item.name}</h6>
                                                <div className='d-flex align-items-center my-3'>
                                                    <i className='icon-paperclip small-font-13'></i>
                                                    <span className='mx-2 small-font-13'>{item.price}</span>
                                                </div>
                                                <div className='bgGrayColor p-2 rounded-1 d-flex justify-content-between align-items-center'>
                                                    <div className='d-flex align-items-center'>
                                                        <i className='icon-date small-font-13'></i>
                                                        <span className='mx-2 small-font-13'>{item.date}</span>
                                                    </div>
                                                    <div className='d-flex align-items-center'>
                                                        <i className='icon-clock small-font-13'></i>
                                                        <span className='mx-2 small-font-13'>{item.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            }
                    </div>

                    <div className='text-center mb-5'>
                        <p className='grayColor mb-3'>You've viewed 9 of 50 items</p>
                        <button className='btn-button w-auto px-5 border-main bg-white'>Load more</button>
                    </div>

                </div>

                <div className='d-flex up-download'>
                    <div className='container-fluid p-0'>
                        <div className='row p-0 m-0'>
                            <div className='col-md-6 col-xs-12 bgSecondColor p-2 none-mobile'>
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