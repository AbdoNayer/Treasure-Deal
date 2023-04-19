import Image from "next/image";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useState,useEffect} from "react";
import {VoucherCard} from "../VoucherCard";
import {buyRaffillionaire} from "../../redux-toolkit/actions";
import {useRouter} from "next/router";

export const BuyVoucher = ({title,subTitle,brief,description,maxBundles,pricePerBundle,voucherImage,voucherDate,voucherTerms,onNextRouter,...props}) => {
    const { t }                                            = useTranslation();
    const dispatch                                         = useDispatch();
    const router                                           = useRouter();

    const [ isLoading, setIsLoading ]                      = useState(false);
    const [ bundlesQuantity, setBundlesQuantity ]          = useState(1)
    const [ vouchersState, setVouchersState ]              = useState([]);

    useEffect(()=>{
        setVouchersState([
            <VoucherCard
                key                 = { 0 }
                image               = { voucherImage }
                price               = { pricePerBundle }
                date                = { voucherDate }
                terms               = { t('millionaire.voucher.cardTermsMini') }
                textModal           = { voucherTerms }
            />
        ])
    },[])

    const addBundle = () => {
        setBundlesQuantity(bundlesQuantity+1);
        setVouchersState([
            ...vouchersState,
            <VoucherCard
                key                 = { vouchersState.length }
                image               = { voucherImage }
                price               = { pricePerBundle }
                date                = { voucherDate }
                terms               = { t('millionaire.voucher.cardTermsMini') }
                textModal           = { voucherTerms }
            />
        ]);
    }
    const removeBundle = () => {
        setBundlesQuantity(bundlesQuantity-1);
        setVouchersState(vouchersState.slice(0, -1));
    }

    const nextBundle = () => {
        setIsLoading(true)
        dispatch(buyRaffillionaire(bundlesQuantity)).then(()=>{
            router.push(onNextRouter)
            setIsLoading(false);
        }).catch(()=>{
            setIsLoading(false);
        });
    }


    return (
        <div className={'py-5 container'}>
            <div className="td-voucher-header">
                <h2 className='text-center fw-light'>{title}</h2>
                <p className='text-center fw-light'>{description}</p>
            </div>
            <div className="td-voucher-body mt-5">
                <div className="td-voucher-body-subTitle d-flex align-items-center mb-3">
                    <Image style={{ objectFit : "contain" }} width={50} height={50} src="/img/favicon.png" alt="treasure deal logo" className={'me-3'}/>
                    <h3 className='fw-light'>{subTitle}</h3>
                </div>
                <div className="td-voucher-body-content row">
                    <div className="td-voucher-body-content-bundles col-md-6 col-xs-12">
                        <div className='position-relative in-card-loop'>
                            { vouchersState }
                        </div>
                    </div>
                    <div className="td-voucher-body-content-brief col-md-6 col-xs-12 px-5">
                        <p className="fw-light">{brief}</p>
                        <div className="td-price-info mt-5 d-flex justify-content-between align-items-end">
                            <div className="td-price-info-details">
                                <div className="td-voucher-price fs-5 fw-bold">{t('millionaire.voucher.price')} {pricePerBundle} x {bundlesQuantity}</div>
                                <div className="td-voucher-total-price fs-4 fw-bold">{t('millionaire.voucher.total')} {Number(parseFloat(pricePerBundle)*bundlesQuantity).toFixed(2)}</div>
                            </div>
                            <div className="td-price-info-buttons d-flex align-items-center">
                                <button onClick={removeBundle} disabled={bundlesQuantity === 1}>
                                    <i className='icon-minus'/>
                                </button>
                                <span className='text-center p-2'>{bundlesQuantity}</span>
                                <button onClick={addBundle} disabled={bundlesQuantity === maxBundles}>
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

                            {/*<Link href={'/raffleillionaire-bundle/raffleillionaire'}>*/}
                            {/*    {t('millionaire.voucher.nextButton')}*/}
                            {/*</Link>*/}

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}