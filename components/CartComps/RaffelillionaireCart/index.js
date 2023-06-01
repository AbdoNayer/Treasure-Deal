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
import Toastify from "toastify-js";
import {removeSelectedTicketReducer} from "../../../redux-toolkit/reducer/selectedTicketsReducer";


export const RaffelillionaireCart = ({cartData,subscriptions,isDeleting,setIsDeleting,socket}) => {


    const { t }                                             = useTranslation();
    const dispatch                                          = useDispatch();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const [isDeleteLoading,setIsDeleteLoading]              = useState(false);
    const [isDiscountLoading,setIsDiscountLoading]          = useState(false);
    const subToOption = (sub) => ({value:sub?.id||0,label:sub?.discount_per === 0 ? "Single Bundle" : `X${sub.draw_times} (${sub.discount_per}%  Discount)`})
    const currency                                          = useSelector((state) => state.currency.currency);

    // const withTimeout = (onSuccess, onTimeout, timeout) => {
    //     let called = false;
    //     const timer = setTimeout(() => {
    //         if (called) return;
    //         called = true;
    //         onTimeout();
    //     }, timeout);
    //     return (...args) => {
    //         if (called) return;
    //         called = true;
    //         clearTimeout(timer);
    //         onSuccess.apply(this, args);
    //     }
    // }

    const deleteTicket = async (ticket) => {
        await socket.emit('deleteLine', {user_id:user.id,type:cartData.cart_data.type,ticket:ticket},r=> {
            if (r.status === 'ok'){
                dispatch(callCart(user.token,langVal,currency))
                    .then(async ()=> {
                        setIsDeleteLoading(false)
                        setIsDeleting(false)
                        await dispatch(callCart(user.token,langVal,currency))
                    })
            }
        })
    }

    const deleteLine = async (ticket) => {
        if (isDeleting) {
            Toastify({
                text: "Deleting another item please wait",
                duration: 3000,
                gravity: "top",
                position: langVal === 'en' ? "left" : "right",
                style: {
                    background: "#F00",
                }
            }).showToast();
            return
        }
        setIsDeleting(true)
        setIsDeleteLoading(true)
        // socket.emit('deleteLine', {user_id:user.id,type:cartData.cart_data.type,ticket:ticket})
        await deleteTicket(ticket)
            // .then(async ()=>{
            // setTimeout(async ()=>{
            //     await dispatch(callCart(user.token,langVal,currency))
            //         .then(async ()=> {
            //             setIsDeleteLoading(false)
            //             setIsDeleting(false)
            //             await dispatch(callCart(user.token,langVal,currency))
            //         })
            // },1500)
            // await dispatch(callCart(user.token,langVal,currency)).then(async ()=>{
            //     setIsDeleteLoading(false)
            //     setIsDeleting(false)
        // })
    }

    const editTicket = (line) => {
        if (isDeleting||isDiscountLoading) {
            Toastify({
                text: "Handling another item please wait",
                duration: 3000,
                gravity: "top",
                position: langVal === 'en' ? "left" : "right",
                style: {
                    background: "#F00",
                }
            }).showToast();
            return
        }
        dispatch(showModalAction(<ModalForm title={t('app.updateTicket')}>
            <EditTicketModalForm lineId={line.id} socket={socket} prevTicket={line.ticket.join('')} cartType={cartData.cart_data.type} />
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
                                    : <span className={`icon-bin ${isDeleting ? 'secondColor ' : 'mainColor '}fs-5 `} onClick={()=> deleteLine(cartData.lines[0].ticket.join(''))}/>
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