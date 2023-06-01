import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { InputSelect } from "../../../components/Inputs/InputSelect";
import { ModalForm } from "../../../components/ModalForms/ModalForm";
import {useDispatch, useSelector} from "react-redux";
import {setInputStateAction, showModalAction} from '../../../redux-toolkit/actions';
import {useRouter} from "next/router";
import {useApi} from "../../../hooks/useApi";
import {
    getAllRedeems,
    getBookingHistory,
    getMerchantDetails,
    getMerchantServices
} from "../../../redux-toolkit/actions/axiosCalls";
import {LoadData, Feedback} from "../../../components";
import {RedeemVoucherModalForm} from "../../../components/ModalForms/RedeemVoucherModalForm";
import {MerchantVouchers} from "../../../components/MerchantComps/MerchantVouchers";
import {RedeemedVouchers} from "../../../components/MerchantComps/RedeemedVouchers";
import {GalleryModalForm} from "../../../components/ModalForms/GalleryModalForm";
import Image from 'next/image';
import {BookingHistory} from "../../../components/MerchantComps/BookingHistory";
import {MainBookingComp} from "../../../components/BookingComps/MainBookingComp";

export default function BookingDetails() {
    
    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch();
    const router                                        = useRouter();
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);

    const [currentFilter,setCurrentFilter]              = useState('vouchers');
    const {merchant_id} = router.query

    const [currentRedeemPage,setCurrentRedeemPage] = useState(1)

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);
    //#region Redeems
    const {
        data:redeemsData,
        isLoading:redeemsLoading,
        reFetch:refetchRedeems
    } = useApi(()=> getAllRedeems(currentRedeemPage,user.token,langVal,currency,merchant_id),false)
    //#endregion

    const [currentBookingPage,setCurrentBookingPage] = useState(1)
    //#region Booking History
    const filterOptions = [
        {label:'all',value:'all'},
        {label:'new',value:'new'},
        {label:'accepted',value:'accepted'},
        {label:'rejected',value:'rejected'},
        {label:'canceled',value:'canceled'},
        {label:'finished',value:'finished'},
    ]
    const [bookingFilter,setBookingFilter] = useState('all')
    const {
        data:bookingHistoryData,
        isLoading:isBookingHistoryLoading,
        reFetch:refetchBookingHistory
    } = useApi(()=> getBookingHistory(currentBookingPage,bookingFilter,user.token,langVal,currency,merchant_id),router.isReady)
    //#endregion

    //#region Merchant Details
    const {
        data,
        isLoading,
        reFetch
    } = useApi(()=>  getMerchantDetails(user.token,langVal,currency,merchant_id),router.isReady)

    useEffect(()=>{
        if (merchant_id) {
            reFetch()
            refetchRedeems()
            refetchBookingHistory()
        }
    },[merchant_id])
    //#endregion

    useEffect(()=>{
        refetchRedeems()
    },[currentRedeemPage])

    useEffect(()=>{
        refetchBookingHistory()
    },[currentBookingPage,bookingFilter])

    //#region Merchant Services
    const {
        data:merchantServices,
        isLoading:isMerchantServicesLoading,
        reFetch: refetchMerchantServices
    } = useApi(()=> getMerchantServices(user.token,langVal,currency,merchant_id,''),false)
    //#endregion

    const updateMerchantBranch = (id) =>
        router.push({ query: { ...router.query, merchant_id: id } }, undefined, { shallow: true });

    const openModal = (type,voucher_id='') => {
        if(type === 'terms'){
            dispatch(showModalAction(
                <ModalForm title={t('booking.details.terms')}>
                    <div className={'text-center mb-4'}>
                        {t('millionaire.voucher.brief')}
                    </div>
                </ModalForm>
            ));
        }
        else if(type === 'map'){
            dispatch(showModalAction(
                <ModalForm title={t('booking.details.map')}>
                    <div className="mapouter">
                        <div className="gmap_canvas">
                            <iframe id="gmap_canvas" src={`https://maps.google.com/maps?q=${data.merchants.lat},${data.merchants.lng}&z=15&output=embed`} frameborder="0" scrolling="no" marginheight="0" marginwidth="0"/>
                        </div>
                    </div>
                </ModalForm>
            ));
        }
        else if(type === 'features'){
            dispatch(showModalAction(
                <div className='features-section'>
                    <ModalForm title={t('booking.details.features')}>
                        <div className='mb-4'>
                            {data.merchants.amenities.map(amenity =>
                                <div className='d-flex align-items-center py-3 px-4 border-main-def' key={amenity.id}>
                                    <Image style={{ objectFit : "contain" }} width={50} height={50} src={amenity.image} alt="amenity icon"/>
                                    <h6 className='mx-3'>{amenity.name}</h6>
                                </div>
                            )}

                            {/*<div className='d-flex align-items-center py-3 px-4 border-main-def'>*/}
                            {/*    <i className='icon-award fs-3'></i>*/}
                            {/*    <h6 className='mx-3'>Quality</h6>*/}
                            {/*</div>*/}
                            {/*<div className='d-flex align-items-center py-3 px-4 border-main-def'>*/}
                            {/*    <i className='icon-customer-service fs-3'></i>*/}
                            {/*    <h6 className='mx-3'>Customer Service</h6>*/}
                            {/*</div>*/}
                        </div>
                    </ModalForm>
                </div>
            ));
        }
        else if(type === 'about'){
            dispatch(showModalAction(
                <ModalForm title={t('app.aboutUs')}>
                    <div className={'text-center mb-4'}>
                        {data.merchants.description}
                    </div>
                </ModalForm>
            ));
        }
        else if(type === 'gallery'){
            dispatch(showModalAction(
                <ModalForm title={t('booking.details.gallery')}>
                    <GalleryModalForm gallery={data.merchants.gallaries}/>
                </ModalForm>
            ));
        }
        else if(type === 'menu'){
            dispatch(showModalAction(
                <ModalForm title={t('booking.details.menu')}>
                    <GalleryModalForm gallery={data.merchants.menus} isMenu/>
                </ModalForm>
            ));
        }
        else if(type==='redeem'){
            dispatch(setInputStateAction('input-start'))
            dispatch(showModalAction(<ModalForm title={'Redeem Voucher'}>
                <RedeemVoucherModalForm voucher_id={voucher_id}/>
            </ModalForm>))
        }
    }

    const [showBooking,setShowBooking] = useState(false)
    const [slug,setSlug] = useState()
    const [voucherId,setVoucherId] = useState('')
    const updateSlug = str => {
        setShowBooking(true)
        setSlug(str)
        refetchMerchantServices(() => getMerchantServices(user.token,langVal,currency,merchant_id,str))
    }
    const updateVoucherId = str => {
        setVoucherId(str)
    }

    const checkFilter = (type) => {
        switch (type) {
            case 'vouchers':
                return <MerchantVouchers openModal={openModal} vouchers={data.merchants.vouchers} merchantId={data.merchants.id} updateVoucherId={updateVoucherId} updateSlug={updateSlug} shopType={data.merchants.shop_type} type={data.merchants.type} />;
            case 'redeem':
                if (redeemsData.redeems.length > 0) return <RedeemedVouchers openModal={openModal} currentPage={currentRedeemPage} updatePage={page=>setCurrentRedeemPage(page)} redeems={redeemsData.redeems} pagination={redeemsData.pagination} refetchRedeems={refetchRedeems}/>;
                else return <div className={'text-center text-danger fs-3 p-5 my-5'}>No redeemed vouchers yet</div>
            case 'booking':
                return <>
                    <div className={'w-25 select-add select-full'}>
                        <InputSelect
                            placeholder={'select filter...'}
                            onChange={e=> setBookingFilter(e.value)}
                            options={filterOptions}
                        />
                    </div>
                    {bookingHistoryData.orders.length > 0
                        ? <BookingHistory refetchBooking={refetchBookingHistory}
                                        bookingHistory={bookingHistoryData.orders}
                                        currentPage={currentBookingPage}
                                        updatePage={page => setCurrentBookingPage(page)}
                                        pagination={bookingHistoryData.pagination}/>
                        : <div className={'text-center text-danger fs-3 p-5 my-5'}>No booking orders yet</div>

                    }
                </>
        }
    }

    if (isLoading) return <LoadData/>

    if(user === null) return null;

    return (
      <div className="container booking details">

            <div className="my-5 border-dotted">
                <h4 className="fw-light">{t('app.myBundle')}</h4>
            </div>

            <div className=''>
                <div className='row'>
                    <div className='col-md-4 col-xs-12'>
                        <div className="img-item old-shadow w-100 rounded-3 d-flex align-items-center justify-content-center">
                            <Image style={{ width: '100%', height: '100%' }} width={318} height={318} alt='img' src={data.merchants.logo} />
                        </div>
                    </div>
                    <div className='col-md-8 col-xs-12'>
                        <div className="info-cate">
                            <div className='d-flex align-items-center justify-content-between fl-col'>
                                <h4>{data.merchants.business_name}</h4>
                                {data.merchants.branches.length> 0 &&
                                <div className=''>
                                    <label className='mainColor fw-light mx-2'>{t('booking.details.branch')}</label>
                                    <div className="select-add p-0 d-flex align-items-center">
                                        <InputSelect
                                            options={data.merchants.branches.map(branch=> ({label:branch.map_desc,value:branch.id}))}
                                            onChange={(e)=> updateMerchantBranch(e.value)}
                                            placeholder={t('register.placeholders.select')}
                                        />
                                    </div>
                                </div>
                                }
                            </div>
                            <p className="fw-light">{data.merchants.brief}</p>
                            <div className='d-flex align-items-center justify-content-between my-4 fl-col'>
                                <div className='icon mb-3' onClick={()=>window.open(`tel:[${data.merchants.full_phone}]`)}>
                                    <i className='icon-call mainColor fs-3'/>
                                    <span className='mx-2 fw-light'>{data.merchants.full_phone}</span>
                                </div>
                                {data.merchants.website && <div className='icon' onClick={() => window.open(data.merchants.website, "_blank")}>
                                    <i className='icon-internet mainColor fs-3'/>
                                    <span className='mx-2 fw-light'>{data.merchants.website}</span>
                                </div>}
                            </div>
                            <div className='d-flex align-items-center my-4 wrap-center'>
                                <button className='icon bg-transparent mb-3' onClick={()=> openModal('map')}>
                                    <i className='icon-map-v fs-3'/>
                                    <span className='mx-2 fw-light'>{t('booking.details.map')}</span>
                                </button>
                                {data.merchants.amenities.length > 0 && <button className='icon mx-2 mb-3 bg-transparent' onClick={() => openModal('features')}>
                                    <i className='icon-book fs-3'/>
                                    <span className='mx-2 fw-light'>{t('booking.details.features')}</span>
                                </button>}

                                {data.merchants.menus.length > 0 && <button className='icon mx-2 mb-3 bg-transparent' onClick={() => openModal('menu')}>
                                    <i className='icon-menu fs-3'/>
                                    <span className='mx-2 fw-light'>{t('booking.details.Menus')}</span>
                                </button>}


                                <button className='icon mx-2 bg-transparent mb-3' onClick={()=> openModal('about')}>
                                    <i className='icon-info fs-3'/>
                                    <span className='mx-2 fw-light'>{t('booking.details.about')}</span>
                                </button>
                                {data.merchants.gallaries.length > 0 && <button className='icon mx-2 mb-3 bg-transparent' onClick={() => openModal('gallery')}>
                                    <i className='icon-image-gallery fs-3'/>
                                    <span className='mx-2 fw-light'>{t('booking.details.gallery')}</span>
                                </button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=''>

                {!showBooking && <div className="my-5 border-dotted d-flex align-items-center justify-content-between pb-3 fl-col">
                    <h4 className="fw-light">{t('booking.details.myVouchers')}</h4>
                    <div className="td_orders_table_actions">
                        <div className="td_orders_table_actions_filters d-flex align-items-center">
                            <button
                                className={`td_filter fw-light ms-2 me-2 ${currentFilter === 'vouchers' && 'td_filter_active bgMainColor text-white'}`}
                                onClick={() => currentFilter !== 'vouchers' && setCurrentFilter('vouchers')}>
                                {t('booking.details.vouchers')}
                            </button>
                            {((data.merchants.type==='waik_in')||(data.merchants.type==='all')) && <button
                                className={`td_filter fw-light ms-2 me-2 ${currentFilter === 'redeem' && 'td_filter_active bgMainColor text-white'}`}
                                onClick={() => {
                                    if (currentFilter !== 'redeem') {
                                        refetchRedeems()
                                        setCurrentFilter('redeem')
                                    }
                                }}>
                                {t('app.redeem')}
                            </button>}
                            {((data.merchants.type==='booking')||(data.merchants.type==='all')) && <button
                                className={`td_filter fw-light ms-2 me-2 ${currentFilter === 'booking' && 'td_filter_active bgMainColor text-white'}`}
                                onClick={() => currentFilter !== 'booking' && setCurrentFilter('booking')}>
                                Booking History
                            </button>}
                        </div>
                    </div>
                </div>}

                {showBooking
                    ? <MainBookingComp
                        merchantServices={merchantServices}
                        servicesLoading={isMerchantServicesLoading}
                        refetchMerchantService={refetchMerchantServices}
                        voucherId={voucherId}
                        voucherType={slug}
                        goBack={()=>setShowBooking(false)}
                    />
                    : <div className={'td_filter_wrapper'}>
                        {checkFilter(currentFilter)}
                    </div>
                }

            </div>

      </div>
    )
}
  