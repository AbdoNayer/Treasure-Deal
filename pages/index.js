import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import {LoadData, Slider} from '../components';
import app from "../app.json";
import {useRouter} from "next/router";
import Link from "next/link";
import Image from 'next/image';
import { Swiper, SwiperSlide } from "swiper/react";
import { showModalAction } from '../redux-toolkit/actions';
import { ModalForm } from "../components/ModalForms/ModalForm";

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/navigation"
import "swiper/components/effect-fade"

// import required modules
import SwiperCore, { Pagination,Navigation,Thumbs, EffectFade } from 'swiper';
import {MerchantQuizzes} from "../components/HomeComps/MerchantQuizzes";
import {getSlides} from "../redux-toolkit/actions/axiosCalls";
import {useApi} from "../hooks/useApi";
import {Categories} from "../components/HomeComps/Categories";
import {HomeDrawResultMillionaire} from "../components/HomeComps/HomeDrawResultMillionaire";
import {HomeDrawResultsRaffillionarie} from "../components/HomeComps/HomeDrawResultsRaffillionarie";
SwiperCore.use([Pagination,Navigation,Thumbs,EffectFade]);

export default function Home() {
  
  const { t }                                       = useTranslation();
  const user                                        = useSelector((state) => state.user.user);
  const router                                            = useRouter();
  const dispatch                                      = useDispatch();
  const [ isFade, setIsFade ]                       = useState(false);

  useEffect(() => {

    window.addEventListener('scroll', () => {
      if(window.scrollY > 500){
        setIsFade(true);
      }else{
        setIsFade(false);
      }
    });

  }, []);

  const goToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
  };

  const openModal = () => {
    dispatch(showModalAction(
        <ModalForm title={t('booking.details.terms')}>
            <div className={'text-center mb-4'}>
                {t('millionaire.voucher.brief')}
            </div>
        </ModalForm>
    ));
  }

  const {
      data:homeSlides,
      isLoading:isHomeSlidesLoading,
      reFetch:refetchHomeSlides
  } = useApi(()=> getSlides('userHome'))

  if (isHomeSlidesLoading) return <LoadData/>

  return (
    <div className=''>

      <div className='mb-4' data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
          <div className='events'>
              <div className='events-block'>
                <Slider data={{
                  arr     : homeSlides,
                  name    : 'slideHome',
                //   items   : homeSlides.length
                }} />
              </div>
          </div>
      </div>

      <div className='my-3'>
          <div className='container'>
              <h2 className='text-center fw-normal my-5'>{t("header.buyNow")}</h2>
              <div className='up-category d-flex overflow-hidden'>
                    {
                        app.categoryListHeader.map((item, i) => (
                            <div className='item-cate p-2' key={i}>
                              <div data-aos="fade-up" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" className={`bx-shadow sub-cate d-flex flex-column justify-content-center align-items-center p-3 rounded-3`}>
                                  <div className='d-flex justify-content-between align-items-center'>
                                      <div className={'text-center px-3'}>
                                          <h3 className='m-0 text-white'>{t(item.name)}</h3>
                                          <p className='my-3 m-auto fw-light text-white'>{item.dis}</p>
                                          <button className='btn-button fw-light' onClick={()=> router.push(item.link)}>
                                              {t("header.buyNow")}
                                          </button>
                                      </div>
                                      { item.name === "category.millionaire" ? <div className='mx-3'><Image style={{ objectFit : "contain" }} width={155} height={273} src="/img/img3.png" alt="" /></div> : "" }
                                  </div>
                              </div>
                            </div>
                        ))
                    }
              </div>
          </div>
      </div>

      <div className='my-4 up-bundle'>
          <div className='container'>
              
              <div className='row'>
                  <div className='item-cate col-md-6 col-xs-12 overflow-hidden'>
                      <h2 className='fw-normal my-3'>{t("app.myBundle")}</h2>
                      <div data-aos="fade-right" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" className={'bgBageColor bx-shadow sub-cate d-flex flex-column justify-content-center align-items-center px-3 rounded-3'}>
                          <div className='d-flex justify-content-between align-items-center'>
                              <div className={'px-2 in-dis'}>
                                <p className='my-3 m-auto fw-light'> 
                                    {t('app.infoDis')}
                                </p>
                                <button className='btn-button fw-light' variant={'white'} onClick={()=>router.push('/booking')}> {t("app.redeem")} </button>
                              </div>
                              <div> <Image style={{ objectFit : "contain" }} width={318} height={318} alt='img' src='/img/fortune.png' /> </div>
                          </div>
                      </div>
                  </div>
                  <div className='item-cate col-md-6 col-xs-12 overflow-hidden'>
                      <h2 className='fw-normal my-3'>{t("app.earnMore")}</h2>
                      <div data-aos="fade-left" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" className={'bgBageColor bx-shadow sub-cate d-flex flex-column justify-content-center align-items-center px-3 rounded-3'}>
                          <div className='d-flex justify-content-between align-items-center'>
                              <div className={'px-2 in-dis'}>
                                  <p className='my-3 m-auto fw-light'> 
                                      {t('app.infoDis')}
                                  </p>
                                  <button className='btn-button fw-light' variant={'white'}> {t("app.clickHere")} </button>
                              </div>
                              <div> <Image style={{ objectFit : "contain" }} width={318} height={318} alt='img' src='/img/fortune.png' /> </div>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </div>

      <div className='my-4 our-category'>
          <Categories />
      </div>

      <div className='events my-5'>
          <div className='container'>
              <div className='events-block position-relative'>
                    <Image className='w-100 rounded-3' unoptimized={true} priority width={318} height={400} alt='img' src='/img/events.png' />
                    <div className='info px-5 mx-5'>
                        <h4 className='m-0 text-white'>{t('app.dubaiEvents')}</h4>
                        <p className='my-4 text-white'>{t('app.infoDis')}</p>
                        <Link href={'/events'} className='btn-button bg-white p-2 px-3 d-inline-block'>{t('app.knowMore')}</Link>
                    </div>
              </div>
          </div>
      </div>

      <div className='my-4 our-category quizz'>
          <div className='container'>
                <div className='text-center my-5'>
                    <h2 className='fw-bolder'>{t("app.quiz")}</h2>
                    <p className='fw-light'>{t('app.infoDis')}</p>
                </div>
              {
                user ?
                <MerchantQuizzes />
                :
                <div className='main-body-mini d-flex justify-content-center align-items-center'>
                    <h3 className='text-danger text-center m-0'>{t('app.showQuiz')}</h3>
                </div>
              }
          </div>
      </div>

      <div className='my-4 our-category'>
          <div className='container'>
              
              <div className='text-center my-5'>
                  <h2 className='fw-bolder'>{t("app.drawResults")}</h2>
                  <p className='fw-light'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae perferendis dolores rem cupiditate</p>
              </div>

              {user
                  ? <>
                      <HomeDrawResultMillionaire />

                      <HomeDrawResultsRaffillionarie />
                  </>
                  : <div className='main-body-mini d-flex justify-content-center align-items-center'>
                      <h3 className='text-danger text-center m-0'>{t('app.showDrawResults')}</h3>
                  </div>
              }

          </div>
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
                      <div className='overflow-hidden in-mo' data-aos="fade-up" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
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

      <div className='newsletter overflow-hidden px-3'>
          <div className='sub-news d-flex flex-column justify-content-center align-items-center' data-aos="fade-up" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
              <h1 className='fw-normal mb-4'>{t("app.newsletter")}</h1>
              <h6 className='fw-light'>Lorem Ipsum is simply dummy text of the printing.</h6>
              <div className='my-4 w-100'>
                  <input className='fw-light' type='email' placeholder={t('forget_password.enterEmail')} />
              </div>
              <button className='btn-button bgMainColor text-white rounded-pill'>{t("app.subscribe")}</button>
          </div>
      </div>

      {
          isFade ?
            <button className='up-to-page old-shadow' onClick={goToTop}>
              <i className='icon-chevron-up'></i>
            </button>
            :
            null
      }

    </div>
  )
}