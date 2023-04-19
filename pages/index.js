import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Slider } from '../components';
import app from "../app.json";
import {useRouter} from "next/router";
import Link from "next/link";
import Image from 'next/image';
import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/navigation"
import "swiper/components/effect-fade"

// import required modules
import SwiperCore, { Pagination,Navigation,Thumbs, EffectFade } from 'swiper';
SwiperCore.use([Pagination,Navigation,Thumbs,EffectFade]);

export default function Home() {
  
  const { t }                                       = useTranslation();
  const router                                            = useRouter();
  const [ isName, setIsName ]                       = useState('');
  const [ actCateClass, setActCateClass ]           = useState('');
  const [ isFade, setIsFade ]                       = useState(false);
  const [ actSubClass, setActSubClass ]             = useState('');

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

  const onShowCategory = (name, i) => {

      setIsName(name);
      setActCateClass(i);

  }

  const onShowSubCategory = (i) => {

    setActSubClass(i);

  }

  return (
    <div className=''>

      <div className='mb-4' data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
        <Slider data={{
          arr     : app.imgSlider,
          name    : 'slideHome',
          items   : 3
        }} />
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
                              <div className={'px-2'}>
                              <p className='my-3 m-auto fw-light'> 
                                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio.
                              </p>
                              <button className='btn-button fw-light' variant={'white'}> {t("app.redeem")} </button>
                              </div>
                              <div> <Image style={{ objectFit : "contain" }} width={318} height={318} alt='img' src='/img/fortune.png' /> </div>
                          </div>
                      </div>
                  </div>
                  <div className='item-cate col-md-6 col-xs-12 overflow-hidden'>
                      <h2 className='fw-normal my-3'>{t("app.earnMore")}</h2>
                      <div data-aos="fade-left" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" className={'bgBageColor bx-shadow sub-cate d-flex flex-column justify-content-center align-items-center px-3 rounded-3'}>
                          <div className='d-flex justify-content-between align-items-center'>
                              <div className={'px-2'}>
                                  <p className='my-3 m-auto fw-light'> 
                                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio.
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
          <div className='container'>
              
              <div className='text-center my-5'>
                  <h2 className='fw-bolder'>{t("app.ourCategory")}</h2>
                  <p className='fw-light'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae perferendis dolores rem cupiditate</p>
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
                      className={'td-categories-swiper justify-content-center'}
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

      <div className='events my-5'>
          <div className='container'>
              <div className='events-block position-relative'>
                    <Image className='w-100 rounded-3' unoptimized={true} priority width={318} height={400} alt='img' src='/img/events.png' />
                    <div className='info px-5 mx-5'>
                        <h4 className='m-0 text-white'>Dubai Events</h4>
                        <p className='my-4 text-white'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae perferendis dolores rem cupiditate</p>
                        <Link href={'/events'} className='btn-button bg-white p-2 px-3 d-inline-block'>Know More</Link>
                    </div>
              </div>
          </div>
      </div>

      <div className='my-4 our-category'>
          <div className='container'>
              
              <div className='text-center my-5'>
                  <h2 className='fw-bolder'>{t("app.drawResults")}</h2>
                  <p className='fw-light'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae perferendis dolores rem cupiditate</p>
              </div>

              <div className='table-view my-5 overflow-hidden'>
                  <h3 className='fw-light mb-3'>{t("category.millionaire")}</h3>
                  <table className="table table-bordered text-center rounded-3 overflow-hidden" data-aos="fade-up" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
                    <thead className='bgMainColor'>
                      <tr>
                        <th className='fw-light text-white fs-5'>{t("app.resultDate")}</th>
                        <th className='fw-light text-white fs-5'>{t("app.drawSeries")}</th>
                        <th className='fw-light text-white fs-5'>{t("app.ticketNumbers")}</th>
                        <th className='fw-light text-white fs-5'>{t("app.details")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                          app.itemTable.map((item, i) => (
                            <tr key={i}>
                                <td className='fw-light fs-5'>{item.date}</td>
                                <td className='fw-light fs-5'>{item.series}</td>
                                <td>
                                  <div className='d-flex justify-content-center align-items-center'>
                                    {
                                      item.arrNum.map((item, i) => (
                                        <span key={i} className="num-cou">{item}</span>
                                      ))
                                    }
                                  </div>
                                </td>
                                <td>
                                  <button className='btn-button bgSecondColor w-75 fw-light'>{t("app.drawDetails")}</button>
                                </td>
                            </tr>
                          ))
                      }
                    </tbody>
                  </table>
              </div>

              <div className='table-view my-5 overflow-hidden'>
                  <h3 className='fw-light mb-3'>{t("category.raffleillionaire")}</h3>
                  <table className="table table-bordered text-center rounded-3 overflow-hidden" data-aos="fade-up" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
                    <thead className='bgMainColor'>
                      <tr>
                        <th className='fw-light text-white fs-5'>{t("app.resultDate")}</th>
                        <th className='fw-light text-white fs-5'>{t("app.drawSeries")}</th>
                        <th className='fw-light text-white fs-5'>{t("app.ticketNumbers")}</th>
                        <th className='fw-light text-white fs-5'>{t("app.details")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                          app.itemTable.map((item, i) => (
                            <tr key={i}>
                                <td className='fw-light fs-5'>{item.date}</td>
                                <td className='fw-light fs-5'>{item.series}</td>
                                <td>
                                  <div className='d-flex justify-content-center align-items-center'>
                                    {
                                      item.arrNum.map((item, i) => (
                                        <span key={i} className="num-cou">{item}</span>
                                      ))
                                    }
                                  </div>
                                </td>
                                <td>
                                  <button className='btn-button bgSecondColor w-75 fw-light'>{t("app.drawDetails")}</button>
                                </td>
                            </tr>
                          ))
                      }
                    </tbody>
                  </table>
              </div>

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
              <i className='icon-chevrons-up'></i>
            </button>
            :
            null
      }

    </div>
  )
}