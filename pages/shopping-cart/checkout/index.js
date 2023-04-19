import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { InputText } from "../../../components/Inputs/InputText";
import {LoadData} from "../../../components";
import {callCart, payCart} from "../../../redux-toolkit/actions";
import {useRouter} from "next/router";
import {checkReferralIdCall} from "../../../redux-toolkit/actions/axiosCalls";
import {t} from "i18next";
import Toastify from "toastify-js";

export default function CheckOut() {
    
    const { t }                                             = useTranslation();
    const dispatch                                          = useDispatch();
    const [ isLoadData, setIsLoadData ]                     = useState(false);
    const [ isCard, setIsCard ]                             = useState('');
    const router                                            = useRouter();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const cartInfo                                          = useSelector((state) => state.cart.cartState);
    const currency                                          = useSelector((state) => state.currency.currency);

    const [referralId,setReferralId]                        = useState('')
    const [referralDiscount,setReferralDiscount]            = useState('')
    const [referralChecked,setReferralChecked]              = useState(false)
    const [refLoading,setRefLoading]                        = useState(false)

    const [payLoading,setPayLoading]                        = useState(false)

    useEffect(()=>{
        setIsLoadData(true)
        dispatch(callCart(user.token,langVal,currency))
            .then(()=>setIsLoadData(false))
            .catch(()=>setIsLoadData(false))
    },[]);

    useEffect(()=>{
        if (cartInfo.carts.map(cart=> cart.cart_data.can_checkout).includes(false)) router.push('/shopping-cart')
    },[])

    // 'AJU202318'
    const checkReferral = () => {
        setRefLoading(true);
        (async ()=> await checkReferralIdCall(user.token,langVal,currency, {refferal_id:referralId}))()
            .then(r=> {
                setReferralDiscount(r.refferal_discount);
                setReferralChecked(true);
                setRefLoading(false);
            })
            .catch(e=> {
                setRefLoading(false);
                Toastify({
                    text: e.response.data.msg,
                    duration: 3000,
                    gravity: "top",
                    position: langVal === 'en' ? "left" : "right",
                    style: {
                        background: "#F00",
                    }
                }).showToast();
            })
    }
    const payCartHandler = () => {
        setPayLoading(true)
        const data = referralChecked ? {
            pay_type: isCard,
            refferal_id : referralId
        } : {
            pay_type: isCard,
        }
        dispatch(payCart(data,user.token,router,langVal,currency))
            .then(()=>setPayLoading(false))
            .catch((e)=> setPayLoading(false))
    }

    if(isLoadData) return ( <LoadData /> )

    return (
      <div className='td-card container'>

            <div className="td-card-header">
                <h3 className="td-lotto-header-title mt-4 fs-1 text-center fw-light">{t('millionaire.cart.CHECKOUT')}</h3>
            </div>

            <div className='up-cart'>

                <div className='body-order'>

                    <h5 className='fw-normal'>{t("millionaire.checkout.yourOrder")}</h5>

                    <div className='view-check-num old-shadow'>
                        <table className="table text-center mt-4">
                            <thead className='bgMainColor'>
                            <tr>
                                <th className='fw-light text-white fs-6 p-2'>{t("shoppingCart.SI")}</th>
                                <th className='fw-light text-white fs-6 p-2'>{t("shoppingCart.bundleId")}</th>
                                <th className='fw-light text-white fs-6 p-2'>{t("shoppingCart.bundleType")}</th>
                                <th className='fw-light text-white fs-6 p-2'>{t("shoppingCart.subscription")}</th>
                                <th className='fw-light text-white fs-6 p-2'>{t("shoppingCart.discount")}</th>
                                <th className='fw-light text-white fs-6 p-2'>{t("shoppingCart.price")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartInfo.carts.map(cart=>
                                <tr key={cart.cart_data.id}>
                                    <td>1</td>
                                    <td>{cart.cart_data.id}</td>
                                    <td>{cart.cart_data.type}</td>
                                    <td>X {cart.cart_data.draw_times}</td>
                                    <td>{cart.cart_data.discount_amount > 0 ? cart.cart_data.discount_amount : 'N/A'}</td>
                                    <td>{cart.cart_data.amount}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        <div className='d-flex align-items-end px-3 justify-content-end flex-column w-100 pb-3'>
                            <div className='d-flex align-items-center justify-content-between w-50'>
                                <h6 className='fw-light'>{t('shoppingCart.subTotal')}</h6>
                                <h6 className='fw-light'>{cartInfo.total_sub_amount}</h6>
                            </div>
                            <div className='d-flex align-items-center justify-content-between w-50'>
                                <h6 className='fw-light'>{t('shoppingCart.totalDiscount')}</h6>
                                <h6 className='fw-light'>{cartInfo.total_discount}</h6>
                            </div>
                            {referralChecked && <div className='d-flex align-items-center justify-content-between w-50'>
                                <h6 className='fw-light'>Referral Discount</h6>
                                <h6 className='fw-light'>{referralDiscount}</h6>
                            </div>}
                            <div className='d-flex align-items-center justify-content-between w-50'>
                                <h6 className='fw-light'>{cartInfo.vat_percentage} {t('shoppingCart.VAT')}</h6>
                                <h6 className='fw-light'>{(parseFloat(cartInfo.vat_percentage) / 100) * Number(cartInfo.total_sub_amount)}</h6>
                            </div>
                        </div>
                    </div>

                    <div className='d-flex align-items-end flex-column justify-content-end mx-2 my-2'>
                        <div className={`d-flex align-items-center justify-content-between w-50 ${referralChecked && 'grayColor text-decoration-line-through'}`}>
                            <h6>{t('millionaire.checkout.total')}</h6>
                            <h6>{currency} {cartInfo.final_total}</h6>
                        </div>
                    </div>
                    {referralChecked && <div>
                        <div className='d-flex align-items-end flex-column justify-content-end mx-2 my-2'>
                            <div className='d-flex align-items-center justify-content-between w-50'>
                                <h6>{t('millionaire.checkout.total')}</h6>
                                <h6>{currency} {Number(cartInfo.final_total) - Number(referralDiscount)}</h6>
                            </div>
                        </div>
                    </div>}

                </div>

                <div className='form-code'>
                    
                    <div className='d-flex align-items-center'>
                        <div className='flex-fill'>
                            <InputText 
                                label={t('millionaire.checkout.enterReferralCode')}
                                errorMessage={''}
                                onChange={(e)=> setReferralId(e.target.value)}
                            />
                        </div>
                        <button className='btn-button bgMainColor text-white' onClick={checkReferral}>
                            {refLoading
                                ? <span className={'fs-5 spinner-border spinner-border-sm'}/>
                                : <>{t('millionaire.checkout.applyHere')}</>
                            }

                        </button>
                    </div>

                </div>

                <div className='pay-payment'>
                    
                    <h5 className='fw-normal'>{t("millionaire.checkout.paymentMode")}</h5>

                    <div className='border-block choose-pay'>
                        <div className='d-flex my-3 align-items-center justify-content-between'>

                            <label className="check-box d-flex align-items-center" onClick={()=> setIsCard('wallet')}>
                                <input type="radio" name="radio" />
                                <span className="checkmark"></span>
                                <strong className='fw-light mx-2'>{t('millionaire.checkout.TDWallet')}</strong>
                            </label>

                            <p className='m-0'>{t("millionaire.checkout.yourBalance")} AED {user.wallet_balance}</p>

                        </div>
                        <div className='d-flex my-3 align-items-center justify-content-between'>

                            <label className="check-box d-flex align-items-center" onClick={()=> setIsCard('coins')}>
                                <input type="radio" name="radio" />
                                <span className="checkmark"></span>
                                <strong className='fw-light mx-2'>{t('millionaire.checkout.TDCoins')}</strong>
                            </label>

                            <p className='m-0'>{t("millionaire.checkout.yourCoins")} AED {user.my_coins}</p>

                        </div>
                        <div className='d-flex my-3 align-items-center justify-content-between'>

                            <label className="check-box d-flex align-items-center" onClick={()=> setIsCard('credit')}>
                                <input type="radio" name="radio" />
                                <span className="checkmark"></span>
                                <strong className='fw-light mx-2'>{t('millionaire.checkout.creditCard')}</strong>
                            </label>

                        </div>
                        <div className='d-flex my-3 align-items-center justify-content-between'>

                            <label className="check-box d-flex align-items-center" onClick={()=> setIsCard('paypal')}>
                                <input type="radio" name="radio" />
                                <span className="checkmark"></span>
                                <strong className='fw-light mx-2'>{t('millionaire.checkout.paypal')}</strong>
                            </label>

                        </div>
                    </div>


                    {
                        isCard === 'credit' ?
                        <div className='border-block my-4'>
                            
                            <div className='form-pay'>
                                <div className='d-flex align-items-center mb-3'>
                                    <div className='w-75 px-1'>
                                        <InputText 
                                            label={t('millionaire.checkout.cardNumber')}
                                            errorMessage={''}
                                        />
                                    </div>
                                    <div className='w-25 px-1'>
                                        <InputText 
                                            label={t('millionaire.checkout.expiry')}
                                            errorMessage={''}
                                        />
                                    </div>
                                </div>

                                <div className='d-flex align-items-center mb-3'>
                                    <div className='w-75 px-1'>
                                        <InputText 
                                            label={t('millionaire.checkout.nameCard')}
                                            errorMessage={''}
                                        />
                                    </div>
                                    <div className='w-25 px-1'>
                                        <InputText 
                                            label={t('millionaire.checkout.CVV')}
                                            errorMessage={''}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center px-2 check-save">
                                <input type="checkbox" />
                                <strong className='fw-light mx-2'>{t('millionaire.checkout.saveCard')}</strong>
                            </div>

                        </div>
                        :
                        null
                    }

                    <button className='btn-button bgMainColor w-75 d-table m-auto mt-4 text-white' onClick={payCartHandler}>
                        {payLoading
                            ? <span className={'fs-5 spinner-border spinner-border-sm'}/>
                            : <>{t('millionaire.checkout.payNow')}</>
                        }

                    </button>

                </div>

            </div>

      </div>
    )
}