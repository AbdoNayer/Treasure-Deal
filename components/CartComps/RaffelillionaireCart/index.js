import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {VoucherCard} from "../../VoucherCard";
import {useState} from "react";
import {
    callCart,
    deleteTicketRaffillionaire, makeSubscription,
    showModalAction
} from "../../../redux-toolkit/actions";
import {ModalForm} from "../../ModalForms/ModalForm";
import {InputSelect} from '../../Inputs/InputSelect'
import {EditTicketModalForm} from "../../ModalForms/EditTicketModalForm";
import {AddLuckyPartnerModalForm} from "../../ModalForms/AddLuckyPartnerModalForm";
import io from "socket.io-client";


export const RaffelillionaireCart = ({cartData,subscriptions}) => {


    const { t }                                             = useTranslation();
    const dispatch                                          = useDispatch();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const [isDeleteLoading,setIsDeleteLoading]              = useState(false);
    const [isDiscountLoading,setIsDiscountLoading]          = useState(false);
    const subToOption = (sub) => ({value:sub?.id||0,label:sub?.discount_per === 0 ? "Single Bundle" : `X${sub.draw_times} (${sub.discount_per}%  Discount)`})
    const currency                                          = useSelector((state) => state.currency.currency);
    const socket = io('https://treasuredeal.com:9090', {
        query: "id=" + user.id + "&user_type=User",
    });

    const deleteLine = async (ticket) => {
        setIsDeleteLoading(true)
        socket.emit('deleteLine', {user_id:user.id,type:cartData.cart_data.type,ticket:ticket})
        await dispatch(callCart(user.token,langVal,currency))
            .then(()=>setIsDeleteLoading(false))
    }

    const editTicket = (line) => {
        dispatch(showModalAction(<ModalForm title={'Update Ticket'}>
            <EditTicketModalForm lineId={line.id} prevTicket={line.ticket.join('')} cartType={cartData.cart_data.type} />
        </ModalForm>))
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

    const showPartners = () => {
        dispatch(showModalAction(<ModalForm>
            <AddLuckyPartnerModalForm  singleTicket={cartData.lines[0]} selectedLuckyPartners={cartData.selected_lucky_partners || []}/>
        </ModalForm>))
    }

    const checkCartBackground = type => {
        switch (type) {
            case 'raffleillionaire':
                return 'BG-2';
            case 'bride_groom':
                return 'BG-6';
            case 'luxury_villas':
                return 'BG-4';
            case 'luxury_cars':
                return 'BG-3';
            case 'luxury_watches':
                return 'BG-5';
        }
    }

    return (
        <div className='row mb-4'>
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
                            <span className="text-white">{cartData.cart_data.id}</span>
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
                                <InputSelect
                                    isLoading={isDiscountLoading}
                                    placeholder={t('multiBundle')}
                                    options={subscriptions.map(sub=> subToOption(sub))}
                                    onChange={e=> applySubscription(e.value)}
                                    defaultValue={cartData.cart_data.subscription_id && subToOption(subscriptions.find(sub=>sub.id === cartData.cart_data.subscription_id))}
                                />
                            </div>
                        </div>
                        <div className="">
                            <button className={'bg-transparent mx-3'} onClick={showPartners}>
                                 <span className={'icon-users mainColor fs-5 '}/>
                            </button>
                            <button className={'bg-transparent'}>
                                {isDeleteLoading
                                    ? <span className={'fs-5 spinner-border spinner-border-sm mainColor'}/>
                                    : <span className={'icon-trash-2 mainColor fs-5 '} onClick={()=> deleteLine(cartData.lines[0].ticket.join(''))}/>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-5 col-xs-12 p-0'>
                <div className='body-list-card p-4'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <h6 className='fw-light m-0'>{t('app.ticketNumbers')}</h6>
                    </div>
                    <div className='body-list-number'>

                        <div className='body-list-number'>
                            {
                                cartData.lines.map((line)=>
                                <div key={line.id} className='number-list position-relative px-4 py-4 my-3'>
                                    <div className="position-relative">
                                        <div className="num-lis">
                                            <span className={`num-span fw-light position-relative ${checkCartBackground(cartData.cart_data.type)} bg-img    `}>
                                                <button onClick={()=>editTicket(line)} className="position-absolute top-0 end-0 m-1 text-white icon-edit-3 bg-transparent" />
                                                {t('raffleillionaire.TD')}
                                                <br />
                                                {line.ticket}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}