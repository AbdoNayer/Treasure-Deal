import { useTranslation } from 'react-i18next';
import Link from "next/link";
import Image from 'next/image';
import {getWinningShows} from "../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../hooks/useApi";
import {useSelector} from "react-redux";
import {useEffect} from "react";
import {LoadData} from "../../components";

export default function Winners() {
    
    const { t }          = useTranslation();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const {
        data:winnersData,
        isLoading,
    } = useApi(()=> getWinningShows(user.token,langVal,currency))
    useEffect(()=>{
        console.log(winnersData);
    },[winnersData])

    if (isLoading) return <LoadData />

    return (
      <div className='winners py-4'>
          <div className='container'>

                <div className='about-page py-4 my-4'>
                    <div className='row'>
                        <div className='col-md-6 col-xs-12'>
                            <div className='info'>
                                <h4 className=''>{t('header.winners')}</h4>
                                <p className='mt-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio. Fugit iste asperiores repellendus voluptate omnis iusto officiis nam praesentium. Add your vouchers more you can play more lotto at the time.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio. Fugit iste asperiores repellendus voluptate omnis iusto officiis nam praesentium. Add your vouchers more you can play more lotto at the time.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                            </div>
                        </div>
                        <div className='col-md-6 col-xs-12'>
                            <div className='img'>
                                <Image src={'/img/na_may_18.png'} quality='100' alt='img' width={100} height={100} />
                            </div>
                        </div>
                    </div>
                </div>
              <div className='video-play py-4 my-4'>
                  <h3 className='text-center my-4'>{t('app.pastShows')}</h3>
                  <div className='row'>
                      {winnersData.shows.length > 0 &&
                          winnersData.shows.map(show =>
                              <div className='col-md-4 col-xs-12'>
                                  <div className='block-video my-3 overflow-hidden rounded-3 position-relative text-center old-shadow'>
                                      <div className='video-img position-relative'>
                                          <Image src={'/img/na_may_18.png'} quality='100' alt='img' width={100} height={100} />
                                          <div className='over'>
                                              <span className='icon-play1' />
                                          </div>
                                      </div>
                                      <div className='video-info'>
                                          <h5 className='fw-light my-4'>22-12-2022</h5>
                                          <Link href={'/stream'} className='bgSecondColor px-4 py-2 rounded-2 mb-3 d-inline-block'>{t('app.watchNow')}</Link>
                                      </div>
                                  </div>
                              </div>
                          )
                      }

                  </div>
              </div>
                {/*<div className='video-play py-4 my-4'>*/}
                {/*    <div className='row'>*/}
                {/*        <div className='col-md-4 col-xs-12'>*/}
                {/*            <div className='block-video my-3 overflow-hidden rounded-3 position-relative text-center old-shadow'>*/}
                {/*                <div className='video-img position-relative'>*/}
                {/*                    <Image src={'/img/na_may_18.png'} quality='100' alt='img' width={100} height={100} />*/}
                {/*                    <div className='over'>*/}
                {/*                        <span className='icon-play1' />*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className='video-info'>*/}
                {/*                    <h5 className='fw-light my-4'>22-12-2022</h5>*/}
                {/*                    <Link href={'/stream'} className='bgSecondColor px-4 py-2 rounded-2 mb-3 d-inline-block'>{t('app.watchNow')}</Link>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

          </div>
      </div>
    )

}
  