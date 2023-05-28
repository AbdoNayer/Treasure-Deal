import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {VoucherCard} from "../../VoucherCard";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {deleteLineMillionaire, makeSubscription, showModalAction} from "../../../redux-toolkit/actions";
import {ModalForm} from "../../ModalForms/ModalForm";
import {EditLuckyNumberModalForm} from "../../ModalForms/EditLuckyNumberModalForm";
import _ from 'lodash';
import {MillionaireTicketCard} from "../MillionaireTicketCard";
import {addMillionVoucherBundleReducer} from "../../../redux-toolkit/reducer/millionVoucherReducer";
import {InputSelect} from '../../Inputs/InputSelect'


export const MillionaireCart = ({cartData,subscriptions}) => {

    const { t }                                             = useTranslation();
    const dispatch                                          = useDispatch();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const [isDeleteLoading,setIsDeleteLoading]              = useState(false);
    const [isDiscountLoading,setIsDiscountLoading]              = useState(false);
    const currency                                          = useSelector((state) => state.currency.currency);

    const subToOption = (sub) => ({value:sub?.id||0, label:sub?.discount_per === 0 ? "Single Bundle" : `X${sub.draw_times} (${sub.discount_per}%  Discount)`})

    const deleteLine = async (num) => {
        setIsDeleteLoading(true)
        await dispatch(deleteLineMillionaire({cartId:num},user.token,langVal,currency)).then(()=> {
            setIsDeleteLoading(false)
                // setMaxBundles(maxBundles.filter(bundle=> bundle[0] !== key))
                // setBundlesQuantity(prevState=> prevState.slice(0,-1))
            })
    }

    const editLineClick = (selectedLines,lineId) => {
        dispatch(showModalAction(
            <ModalForm title={t('app.updateLine')}>
                <EditLuckyNumberModalForm selectedLines={selectedLines} lineId={lineId}/>
            </ModalForm>
        ))
    }

    const applySubscription = (id) => {
        setIsDiscountLoading(true)
        const data = {
            subscription_id:id,
            cart_id:cartData.cart_data.id
        }
        dispatch(makeSubscription(data,user.token,langVal,currency))
            .then(()=>setIsDiscountLoading(false))
            .catch((e)=>setIsDiscountLoading(false))
    }

    return (
      <div className='mb-4'>
          {
            cartData.lines ?
            <div className="row mb-4">
                <div className='col-md-7 col-xs-12 p-0'>
                    <div className="td-voucher-body-content-bundles px-5 py-4">
                        <div className='position-relative in-card-loop m-0'>
                            <VoucherCard
                                image               = { '/img/bundelE.png' }
                                price               = { cartData.cart_data.sub_amount }
                                date                = { null }
                                terms               = { t('millionaire.voucher.cardTermsMini') }
                                textModal           = { cartData.terms }
                            />
                            <div className="bundel-id">
                                <span className="text-white">{t('shoppingCart.bundleId')} : </span>
                                <span className="text-white">9160154</span>
                            </div>
                        </div>
                        <div className="td-subscription d-flex align-items-center justify-content-between pt-2">
                            <div className="td-subscription-select d-flex align-items-center">
                                {/*<div className='td-renew d-flex align-items-center'>*/}
                                {/*    <div className="td-renew-checkbox">*/}
                                {/*        <input type="checkbox" onClick={e=> console.log(e.target.checked)}/>*/}
                                {/*    </div>*/}
                                {/*    <h6 className='mx-1 my-0 fw-light'>{t('shoppingCart.multiBundle')}</h6>*/}
                                {/*</div>*/}
                                <div className="td-subscription-select-wrapper mx-1">
                                    {subscriptions && <InputSelect
                                        isLoading={isDiscountLoading}
                                        placeholder={t('shoppingCart.multiBundle')}
                                        options={subscriptions.map(sub => subToOption(sub))}
                                        onChange={e => applySubscription(e.value)}
                                        defaultValue={cartData.cart_data.subscription_id && subToOption(subscriptions.find(sub => sub.id === cartData.cart_data.subscription_id))}
                                    />}
                                </div>
                            </div>
                            <button className={'bg-transparent'}>
                                {isDeleteLoading
                                    ? <span className={'fs-5 spinner-border spinner-border-sm mainColor'}/>
                                    : <span className={'icon-bin mainColor fs-5 '} onClick={()=> deleteLine(cartData.cart_data.id)}/>
                                }
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-md-5 col-xs-12 p-0'>
                    <div className='body-list-card p-4'>
                        <div className='d-flex align-items-center justify-content-between'>
                            <h6 className='fw-light m-0'>{t('app.ticketNumbers')}</h6>
                        </div>
                        <div className='body-list-number'>
                            <div className='number-list position-relative px-4 py-4 my-3'>
                                <MillionaireTicketCard bundle={cartData.lines} deleteLine={deleteLine} editLineClick={editLineClick} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :
            null
          }
      </div>
  )
}