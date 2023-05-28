import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router';
import { getMillionaire, buyMillionaire } from '../../redux-toolkit/actions';
import {VoucherCard} from "../../components/VoucherCard";
import {LoadData} from "../../components";
import Image from 'next/image';


export default  function TheMillionaireVoucher () {
    const { t }                                         = useTranslation();
    const router                                        = useRouter();
    const langVal                                       = useSelector((state) => state.language.language);
    const millionareInfo                                = useSelector((state) => state.millionVoucher.millionVoucher);
    const user                                          = useSelector((state) => state.user.user);
    const dispatch                                      = useDispatch();
    const currency                                      = useSelector((state) => state.currency.currency);

    const [ isLoadData, setIsLoadData ]                    = useState(true);
    const [ isLoading, setIsLoading ]                      = useState(false);
    // const [ subscriptionState, setSubscriptionState ]      = useState(false)
    // const [ renewState, setRenewState ]                    = useState(false)
    const [ bundlesQuantity, setBundlesQuantity ]          = useState(1)
    const [ vouchersState, setVouchersState ]              = useState([]);

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    useEffect(()=>{
        if (user) {
            setIsLoadData(true)
            dispatch(getMillionaire(user.token, langVal,currency)).then(()=>{
                setIsLoadData(false);
            }).catch(()=>{
                setIsLoadData(false);
            });
        }
    },[]);


    useEffect(()=>{
        setVouchersState([
            <VoucherCard
                key                 = { 0 }
                image               = { '/img/card.png' }
                price               = { millionareInfo.price_per_bundle }
                date                = { millionareInfo.date }
                terms               = { t('millionaire.voucher.cardTermsMini') }
                textModal           = { millionareInfo.terms }
            />
        ])
    },[millionareInfo])

    const addBundle = () => {
        setBundlesQuantity(bundlesQuantity+1);
        setVouchersState([
            ...vouchersState,
            <VoucherCard
                key                 = { vouchersState.length }
                image               = { '/img/card.png' }
                price               = { millionareInfo.price_per_bundle }
                date                = { millionareInfo.date }
                terms               = { t('millionaire.voucher.cardTermsMini') }
                textModal           = { millionareInfo.terms }
            />
        ]);
    }

    const removeBundle = () => {
        setBundlesQuantity(bundlesQuantity-1);
        setVouchersState(vouchersState.slice(0, -1));
    }

    const nextBundle = () => {

        setIsLoading(true)

        // const data = {
        //     qty                 : bundlesQuantity,
        //     entry_type          : 'OneTime',
        //     autorenew           : renewState,
        //     discount            : 15,
        //     draws               : 4,
        //     subscription        : subscriptionState
        // }
        //
        //
        dispatch(buyMillionaire(bundlesQuantity)).then(()=>{
            router.push('/the-millionaire-voucher/millionaire-lotto');
            setIsLoading(false);
        }).catch(()=>{
            setIsLoading(false);
        });
    }
    
    if(isLoadData) return ( <LoadData /> )

    if(user === null) return null;


    return (
        <div className="py-5 container">
            <div className="td-voucher-header">
                <h2 className='text-center fw-light'>{t('millionaire.voucher.title')}</h2>
                <p className='text-center fw-light'>{ millionareInfo.description }</p>
            </div>
            <div className="td-voucher-body mt-5">
                <div className="td-voucher-body-subTitle d-flex align-items-center mb-3">
                    <Image style={{ objectFit : "contain" }} width={50} height={50} src="/img/favicon.png" alt="treasure deal logo" className={'me-3'}/>
                    <h3 className='fw-light'>{t('millionaire.voucher.subTitle')}</h3>
                </div>
                <div className="td-voucher-body-content row">
                    <div className="td-voucher-body-content-bundles col-md-6 col-xs-12">
                    <div className='position-relative in-card-loop'>
                        { vouchersState }
                    </div>
                    </div>
                    <div className="td-voucher-body-content-brief col-md-6 col-xs-12 px-5">
                        <p className="fw-light">{ millionareInfo.brief }</p>
                        {/* <div className='td-subscription d-flex align-items-center mt-3'>
                           <div className="td-subscription-wrapper">
                           <input type="checkbox" onClick={e=> setSubscriptionState(e.target.checked)}/>
                           </div>
                        <h6 className='td-subscription-title fs-5 mx-2'>{t('millionaire.voucher.subscription')}</h6>
                        </div> */}
                        {/* {subscriptionState && <div className="td-subscription-select mt-3 ms-5">
                           <div className="td-subscription-select-wrapper">
                           <InputSelect/>
                           </div>
                           <div className='td-renew d-flex align-items-center mt-4'>
                               <div className="td-renew-checkbox">
                               <input type="checkbox" onClick={e=> setRenewState(e.target.checked)}/>
                               </div>
                               <h6 className='mx-2'>{t('millionaire.voucher.renew')}</h6>
                           </div>
                        </div>} */}
                        <div className="td-price-info mt-5 d-flex justify-content-between align-items-end">
                        <div className="td-price-info-details">
                            <div className="td-voucher-price fs-5 fw-bold">{t('millionaire.voucher.price')} {currency} {millionareInfo.price_per_bundle} x {bundlesQuantity}</div>
                            <div className="td-voucher-total-price fs-4 fw-bold">{t('millionaire.voucher.total')} {currency} {Number(parseFloat(millionareInfo.price_per_bundle)*bundlesQuantity).toFixed(2)}</div>
                        </div>
                            <div className="td-price-info-buttons d-flex align-items-center">
                                <button onClick={removeBundle} disabled={bundlesQuantity === 1}>
                                    <i className='icon-minus'/>
                                </button>
                                <span className='text-center p-2'>{bundlesQuantity}</span>
                                <button onClick={addBundle} disabled={bundlesQuantity === millionareInfo.max_bundles}>
                                    <i className='icon-plus'/>
                                </button>
                            </div>
                        </div>
                        <div className='td-voucher-body-content-next d-flex justify-content-center mt-5'>
                            
                            <button className='btn-button bgMainColor text-white d-table' onClick={nextBundle} disabled={isLoading}>
                                {isLoading
                                    ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                                    : t('millionaire.voucher.nextButton')
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}