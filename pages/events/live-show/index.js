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
    const imgSlider = [
        {
            "img" : "/img/m-1.png"
        },
        {
            "img" : "/img/m-1.png"
        },
        {
            "img" : "/img/m-1.png"
        }
    ];

    const itemsArr = [
        {
            'id'        : 1,
            'img'       : '/img/im-1.png',
            'title'     : 'Private Events',
            'prif'      : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
        },
        {
            'id'        : 2,
            'img'       : '/img/im-1.png',
            'title'     : 'Private Events',
            'prif'      : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book.'
        }
    ]

    //#region Countries and Cities
    const {
        data:countriesData,
        isLoading:isCountriesLoading,
    } = useApi(()=> getAllCountries(user.token,langVal,currency))

    return (
      <div className='page-events'>
          
          <div data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
                <div className='events'>
                    <div className='events-block'>
                        <Slider data={{
                            arr     : imgSlider,
                            name    : 'slideHome',
                            items   : 3
                        }} />
                        <div className='info px-5 mx-5'>
                            <div className='ps-5 ms-5'>
                                <h4 className='m-0 bg-white d-inline-block p-3 fw-bold'>Live Shows</h4>
                                <p className='my-4 text-white'>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam exercitationem nemo cupiditate cumque nihil facilis, aspernatur velit iure nobis eos modi aliquam ipsam
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className=''>


                <div className='container'>

                    <div className='mt-5 mb-4 head-tit-info d-flex justify-content-between align-items-center'>
                        <h4 className='m-0'>Live Shows</h4>
                    </div>

                    <div className='row pb-5'>
                        {
                            itemsArr.map((item) => (
                                <div key={item.id} className='col-md-4 col-xs-12'>
                                    <Link href={`/events/live-show/${item.title}`} className='d-block item-event my-3 position-relative'>
                                        <div className='img-event overflow-hidden rounded-3 old-shadow'>
                                            <Image className='w-100' width={188} height={300} alt='phone' src={item.img}/>
                                        </div>
                                        <div className='info-event p-3 bg-white rounded-3 old-shadow'>
                                            <h4>{item.title}</h4>
                                            <p className='m-0 small-font-13'>{item.prif}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        }
                    </div>

                    <div className='text-center mb-5'>
                        <p className='grayColor mb-3'>You viewed 9 of 50 items</p>
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
  