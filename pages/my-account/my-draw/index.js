import {useTranslation} from "react-i18next";
import { useSelector } from "react-redux";
import {PrizePolicyTable} from "../../../components/PrizePolicyTable";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/pagination"
// import required modules
import { Pagination } from "swiper";
import {CountdownTimer} from "../../../components/CountdownTimer";
import {useRouter} from "next/router";
import {useApi} from "../../../hooks/useApi";
import {getDrawDetailsCall} from "../../../redux-toolkit/actions/axiosCalls";
import {useEffect, useState} from "react";
import {LoadData} from "../../../components";
import {BundleWrapper} from "../../../components/BundleWrapper";
import Image from 'next/image';

export default function MyDraw() {

    const { t }                             = useTranslation();
    const router                                            = useRouter();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const millionLinesInfo                  = useSelector((state) => state.linesMillionair.millionLines);
    const {draw_id} = router.query
    const currency                               = useSelector((state) => state.currency.currency);

    const {
        data,
        isLoading,
        reFetch
    } = useApi(()=>  getDrawDetailsCall(user.token,langVal,currency,draw_id),router.isReady)

    useEffect(()=>{
        if (draw_id) reFetch(()=>  getDrawDetailsCall(user.token,langVal,currency,draw_id))
    },[draw_id])


    // const lisNum2 = ['43', '87', '66', '88' , '29', '20', '43'];

    // const data = [
    //     {
    //         "id": 1,
    //         "numbers5_count": 5,
    //         "numbers2_count": 2,
    //         "ticket_ranking": 0,
    //         "ticket_ranking_text": "result.",
    //         "prize": "25000000.00",
    //         "winners_count": 0
    //     },
    //     {
    //         "id": 2,
    //         "numbers5_count": 5,
    //         "numbers2_count": 2,
    //         "ticket_ranking": 0,
    //         "ticket_ranking_text": "result.",
    //         "prize": "25000000.00",
    //         "winners_count": 0
    //     },
    //     {
    //         "id": 3,
    //         "numbers5_count": 5,
    //         "numbers2_count": 2,
    //         "ticket_ranking": 0,
    //         "ticket_ranking_text": "result.",
    //         "prize": "25000000.00",
    //         "winners_count": 0
    //     },
    //     {
    //         "id": 4,
    //         "numbers5_count": 5,
    //         "numbers2_count": 2,
    //         "ticket_ranking": 0,
    //         "ticket_ranking_text": "result.",
    //         "prize": "25000000.00",
    //         "winners_count": 0
    //     }
    // ]


    if (isLoading) return <LoadData/>
    return (
        <div className='my-draw container'>
            <div className="row">
                <div className="col-md-7 col-xs-12">

                    <div className="py-5">

                        <div className="head my-4">
                            <h5>Draw - {data.draw.series}</h5>
                            <p className="fw-light">{t('draw.details')}</p>
                        </div>

                        <div className="bgGrayColor p-3 rounded-3 text-center my-3">
                            <h5 className="fw-light">{t('draw.grandPrize')}</h5>
                            <div className='lis-number active d-flex align-items-center justify-content-center my-3'>
                                {data.draw.type === 'millionaire'
                                    ? <>
                                        {data.draw.numbers5.map(num => <span key={num} className='mx-1'>{num}</span>)}
                                        {data.draw.numbers2.map(num => <span key={num} className='mx-1'>{num}</span>)}
                                    </>
                                    : <div className={'fw-bold fs-3'}>
                                        TD- {data.draw.ticket}
                                    </div>
                                }
                            </div>
                        </div>

                        {/*<div className="bgGrayColor p-4 rounded-3 d-flex align-items-center justify-content-between">*/}
                        {/*    <h6 className="fw-light m-0">{t('draw.refferalCode')}</h6>*/}
                        {/*    <div className="d-flex align-items-center">*/}
                        {/*        <div className="d-flex align-items-center">*/}
                        {/*            <div className="copy-click">*/}
                        {/*                <span>ALAND12461</span>*/}
                        {/*                <i className="icon-copy ms-3 mainColor"></i>*/}
                        {/*            </div>*/}
                        {/*            <i className="icon-share-f mainColor"></i>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/*<div className='table-view my-5 overflow-hidden'>*/}
                        {/*    <table className="table table-bordered text-center rounded-3">*/}
                        {/*        <thead className='bgMainColor'>*/}
                        {/*        <tr>*/}
                        {/*            <th className='fw-light text-white'>{t("draw.drawSeries")}</th>*/}
                        {/*            <th className='fw-light text-white'>{t("draw.drawDate")}</th>*/}
                        {/*            <th className='fw-light text-white'>{t("header.results")}</th>*/}
                        {/*        </tr>*/}
                        {/*        </thead>*/}
                        {/*        <tbody>*/}
                        {/*            <tr>*/}
                        {/*                <td className='fw-light'>TDTM-2022-0013</td>*/}
                        {/*                <td className='fw-light'>25-12-2022</td>*/}
                        {/*                <td className='fw-light'>Waiting for results</td>*/}
                        {/*            </tr>*/}
                        {/*        </tbody>*/}
                        {/*    </table>*/}
                        {/*</div>*/}

                        <div className="my-4 header-title-info">
                            <h5 className="fw-light">{t('draw.selectedNumber')}</h5>
                        </div>

                        {/*<div className="block-item d-flex align-items-center position-relative px-2 py-2 flex-fill">*/}
                        {/*    <h5 className="fw-light">#1</h5>*/}
                        {/*    <h5 className="mx-4">TD-225536</h5>*/}
                        {/*</div>*/}

                        {data.carts.map((cart,idx) => <BundleWrapper key={idx} data={data} cart={cart}/> )}


                        <div className="my-4 header-title-info">
                            <h5 className="fw-light">{t('draw.prizePolicy')}</h5>
                        </div>

                        <div className='my-4 result-millionaire'>
                            <PrizePolicyTable prizes={data.prize_matchings || []} drawType={data.draw.type==='millionaire'?'mill':'raff'}/>
                        </div>

                        {/*<div className="my-4 header-title-info">*/}
                        {/*    <h5 className="fw-light">{t('draw.purchasedBundle')}</h5>*/}
                        {/*</div>*/}

                        {/*<div className='table-view my-5 overflow-hidden'>*/}
                        {/*    <table className="table table-bordered text-center rounded-3">*/}
                        {/*        <thead className='bgMainColor'>*/}
                        {/*        <tr>*/}
                        {/*            <th className='fw-light text-white'>{t("draw.datePurchase")}</th>*/}
                        {/*            <th className='fw-light text-white'>{t("draw.rafferalCode")}</th>*/}
                        {/*            <th className='fw-light text-white'>{t("ordersProfile.confirmationNo")}</th>*/}
                        {/*            <th className='fw-light text-white'>{t("ordersProfile.paymentMethod")}</th>*/}
                        {/*        </tr>*/}
                        {/*        </thead>*/}
                        {/*        <tbody>*/}
                        {/*            <tr>*/}
                        {/*                <td className='fw-light'>25-12-2022</td>*/}
                        {/*                <td className='fw-light'>ALAND12461</td>*/}
                        {/*                <td className='fw-light'>578965231</td>*/}
                        {/*                <td className='fw-light'>Visa* 0099</td>*/}
                        {/*            </tr>*/}
                        {/*        </tbody>*/}
                        {/*    </table>*/}
                        {/*</div>*/}

                        {/*<div className="my-4 header-title-info">*/}
                        {/*    <h5 className="fw-light">{t('draw.entryDetails')}</h5>*/}
                        {/*</div>*/}

                        {/*<div className="bgGrayColor rounded-3">*/}
                        {/*    <div className="p-3 header-title-info d-flex align-items-center justify-content-between">*/}
                        {/*        <h6 className="fw-light m-0">{t('millionaire.voucher.price')} Bundle of 30 x 1</h6>*/}
                        {/*        <span>AED 600.00</span>*/}
                        {/*    </div>*/}
                        {/*    <div className="p-3 border-0 header-title-info d-flex align-items-center justify-content-between">*/}
                        {/*        <h6 className="fw-light m-0">{t('millionaire.cart.totalPrice')}</h6>*/}
                        {/*        <span>AED 600.00</span>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                    </div>

                </div>
                <div className="col-md-5 col-xs-12">
                    
                    <div className="py-5">

                        <div className="my-4 header-title-info">
                            <h5 className="fw-light">{t('draw.yourTicket')}</h5>
                        </div>
    
                        <div className="">
                            <Swiper pagination={true} modules={[Pagination]} className={'td-categories-swiper'}>
                                {data.carts.map((cart,idx) => <SwiperSlide className={''} key={idx}>
                                    <div className="bg-card px-3 py-5">
                                        <div className="bg-white rounded-3 p-3">
                                            <div className="header-title-info mb-4">
                                                <div className="header-title-info text-center py-3">
                                                    <Image style={{ objectFit : "contain" }} width={80} height={80} src="/img/logo.png" alt="logo" />
                                                </div>
                                                <div className="header-title-info text-center py-3">
                                                    <h6 className="fw-light m-0">{data.draw.date}</h6>
                                                </div>
                                                <div className="my-3">
                                                    <h5 className="text-center">{data.draw.type}</h5>
                                                    <div className="my-3">
                                                        <h6 className="fw-light">{t('app.ticketNumbers')}</h6>
                                                        {cart.lines.map((line,i) =>
                                                            <div className="block-item d-flex align-items-center position-relative py-2 flex-fill" key={line.id}>
                                                                <span className="fw-light">#{i+1}</span>
                                                                <div className='lis-number d-flex align-items-center justify-content-center mx-1'>
                                                                    {data.draw.type === 'millionaire'
                                                                        ? <>
                                                                            {line.luckynumber5.map(num => <span key={num} className={`mx-1 ${data.draw.numbers5.includes(num) && 'text-white bgMainColor'}`}>{num}</span>)}
                                                                            {line.luckynumber2.map(num => <span key={num} className={`mx-1 ${data.draw.numbers2.includes(num) && 'text-white bgSecondColor'}`}>{num}</span>)}
                                                                        </>
                                                                        : <div className={'fw-bold fs-5'}>
                                                                            TD- {line.ticket}
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                        {/*<div className="block-item d-flex align-items-center position-relative px-2 py-2 flex-fill">*/}
                                                        {/*    <h5 className="fw-light">#1</h5>*/}
                                                        {/*    <h5 className="mx-4">TD-225536</h5>*/}
                                                        {/*</div>*/}

                                                    </div>
                                                </div>
                                                {data.draw.type==='millionaire'&&<div className="my-3">
                                                    <h6 className="">Raffle No.</h6>
                                                    <div className="d-flex align-items-center">
                                                        <h6 className="fw-light m-0">{t('draw.raffleID')}</h6>
                                                        <h6 className="fw-light mainColor mx-2 m-0">9160245876</h6>
                                                    </div>
                                                </div>}
                                                <div className="my-4">
                                                    <h6 className="">{t('draw.otherDetails')}</h6>
                                                    <div className="rounded-3 d-it-new">
                                                        <div className="p-3 d-flex align-items-center justify-content-between">
                                                            <h6 className="fw-light m-0">{t('draw.drawDate')}</h6>
                                                            <h6 className="fw-light mx-2 m-0">{data.draw.date}</h6>
                                                        </div>
                                                        <div className="p-3 d-flex align-items-center justify-content-between">
                                                            <h6 className="fw-light m-0">{t('draw.grandPrize')}</h6>
                                                            <h6 className="fw-light mx-2 m-0">AED {parseFloat(data.prize_matchings[0].prize).toLocaleString()}</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-qr text-center">
                                                <Image style={{ width: '100%', height: '100%' }} width={318} height={318} alt='QR' src="/img/QR.png" />
                                                <h4 className="">A1-213ABC-D11</h4>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>)}

                            </Swiper>
                        </div>

                        <div className='my-5'>
                                
                                <div className='bg-voukum d-flex align-items-center justify-content-between'>
                                    <div className="d-flex flex-column align-items-center">
                                        <h5 className='text-white'>{t('category.millionaire')}</h5>
                                        <button className='btn-button bg-white' onClick={()=>router.push('/the-millionaire-voucher/millionaire-lotto')}>
                                            {t('millionaire.lotto.buttons.addBundle')}
                                        </button>
                                    </div>
                                    <div className="align-self-end">
                                        <CountdownTimer date={millionLinesInfo.prize_date}/>
                                    </div>
                                </div>

                                <div className='bg-voukum d-flex align-items-center justify-content-between'>
                                    <div className="d-flex flex-column text-center align-items-center">
                                        <h5 className='text-white'>{t('category.raffleillionaire')}</h5>
                                        <button className='btn-button bg-white'  onClick={()=>router.push('/raffleillionaire-bundle/raffleillionaire')}>
                                            {t('millionaire.lotto.buttons.addBundle')}
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center align-self-end">

                                        <i className='icon-date fs-4 text-white mx-2'></i>
                                        <p className='text-white'>
                                            Estimate Date 15-02-2023
                                            <br/>
                                            When campaign sold out
                                        </p>

                                    </div>
                                </div>

                                <div className='bg-voukum d-flex align-items-center justify-content-between'>
                                    <div className="d-flex flex-column text-center align-items-center">
                                        <h5 className='text-white'>{t('category.cars')}</h5>
                                        <button className='btn-button bg-white'>
                                            {t('millionaire.lotto.buttons.addBundle')}
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center align-self-end">

                                        <i className='icon-date fs-4 text-white mx-2'></i>
                                        <p className='text-white'>
                                            Estimate Date 15-02-2023
                                            <br/>
                                            When campaign sold out
                                        </p>

                                    </div>
                                </div>

                                <div className='bg-voukum d-flex align-items-center justify-content-between'>
                                    <div className="d-flex flex-column text-center align-items-center">
                                        <h5 className='text-white'>{t('category.villas')}</h5>
                                        <button className='btn-button bg-white'>
                                            {t('millionaire.lotto.buttons.addBundle')}
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center align-self-end">

                                        <i className='icon-date fs-4 text-white mx-2'></i>
                                        <p className='text-white'>
                                            Estimate Date 15-02-2023
                                            <br/>
                                            When campaign sold out
                                        </p>

                                    </div>
                                </div>

                                <div className='bg-voukum d-flex align-items-center justify-content-between'>
                                    <div className="d-flex flex-column text-center align-items-center">
                                        <h5 className='text-white'>{t('category.watches')}</h5>
                                        <button className='btn-button bg-white'>
                                            {t('millionaire.lotto.buttons.addBundle')}
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center align-self-end">

                                        <i className='icon-date fs-4 text-white mx-2'></i>
                                        <p className='text-white'>
                                            Estimate Date 15-02-2023
                                            <br/>
                                            When campaign sold out
                                        </p>

                                    </div>
                                </div>

                                <div className='bg-voukum d-flex align-items-center justify-content-between'>
                                    <div className="d-flex flex-column text-center align-items-center">
                                        <h5 className='text-white'>{t('category.bride')}</h5>
                                        <button className='btn-button bg-white'>
                                            {t('millionaire.lotto.buttons.addBundle')}
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center align-self-end">

                                        <i className='icon-date fs-4 text-white mx-2'></i>
                                        <p className='text-white'>
                                            Estimate Date 15-02-2023
                                            <br/>
                                            When campaign sold out
                                        </p>

                                    </div>
                                </div>

                            </div>

                    </div>

                </div>
            </div>
        </div>
    )
}