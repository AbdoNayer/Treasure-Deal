import { t } from "i18next";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {callCart, hideModalAction, showModalAction} from "../../redux-toolkit/actions";
import {ModalForm} from "../ModalForms/ModalForm";
import {
    addSelectedTicketReducer,
    removeSelectedTicketReducer
} from "../../redux-toolkit/reducer/selectedTicketsReducer";
import {addRaffillionaireBundleReducer} from "../../redux-toolkit/reducer/raffillionaireBundleReducer";
import Toastify from "toastify-js";
// import React from "@types/react";

export const TicketCard = ({handleClick,socket,type,refetchType,lock,setLock,setAllSelectedTickets,typeDetails,ticket,ticketValue,allSelectedTickets,ticketId,ticketMode,prevTicket,isModal=false,...props}) => {
    const [isLoading,setIsLoading]                      = useState(false)
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);
    const selectedTicketsReducer                        = useSelector((state) => state.selectedTickets.selectedTickets.selected_tickets);
    const dispatch                                      = useDispatch()
    const raffillionaireInfo                            = useSelector((state) => state.raffillionaireBundle.raffillionaireBundle);

    const socketAddTicket = async (ticket,callbackFn) => {
        await socket.emit('selectLine', {user_id:user.id,type:type,ticket:ticket},callbackFn)
    }
    const socketDeleteTicket = async (ticket,callbackFn) => {
        await socket.emit('deleteLine', {user_id:user.id,type:type,ticket:ticket},callbackFn)
    }
    // useEffect(()=>{
    //     console.log(cartInfo.filter(cart=> cart.cart_data.type === type).reduce((a,e) =>
    //             a ? [...a,e.lines[0].ticket.join('') ] : e.lines[0].ticket.join('')
    //         ,[]
    //     ));
    // },[cartInfo])
    const editTicket = async (ticket) => {
        if (allSelectedTickets.includes(ticket)) {
            Toastify({
                text: 'Ticket Already Selected',
                duration: 3000,
                gravity: "top",
                position: langVal === 'en' ? "left" : "right",
                style: {
                    background: "#F00",
                }
            }).showToast();
        }
        else {
            setIsLoading(true)
            await socketAddTicket(ticket, async (res) => {
                if (res.status === 'ok') {
                    await socketDeleteTicket(prevTicket, async (r) => {
                        if (r.status==='ok'){
                            await dispatch(callCart(user.token,langVal,currency)).then(()=> {
                                setIsLoading(false)
                                dispatch(hideModalAction())
                            })
                        }
                    })
                }
            })
        }
    }
    const addTicket = async ticket => {
        if (selectedTicketsReducer.includes(ticket) || allSelectedTickets.includes(ticket)) {
            dispatch(showModalAction(<ModalForm title={t('raffleillionaire.alreadyChosen')}>
                <div className={'d-flex flex-column align-items-center justify-content-between'}>
                    <div className={'mb-4'}>{t('raffleillionaire.ticketAlready')}</div>
                </div>
            </ModalForm>))
        }
        else{
            if (typeDetails.max_bundles === selectedTicketsReducer.length) {
                dispatch(showModalAction(<ModalForm title={t('millionaire.lotto.pop_ups.bundle_limit.title')}>
                    <div className={'text-center mb-4'}>
                        {t('raffleillionaire.youBundles')}
                    </div>
                </ModalForm>))
            }
            else {
                if (raffillionaireInfo.qty === selectedTicketsReducer.length) {
                    if(lock) {
                        Toastify({
                            text: "Handling another ticket please wait",
                            duration: 3000,
                            gravity: "top",
                            position: langVal === 'en' ? "left" : "right",
                            style: {
                                background: "#F00",
                            }
                        }).showToast();
                        return
                    }
                    dispatch(showModalAction(
                        <ModalForm
                            title={t('millionaire.lotto.buttons.addBundle')}
                            applyText={t('millionaire.lotto.buttons.addBundle')}
                            applyButton
                            applyFunction={async () => {
                                setLock(true)
                                setIsLoading(true)
                                await socketAddTicket(ticket,async (r)=> {
                                    if (r.status === 'ok') {
                                        await dispatch(callCart(user.token,langVal,currency))
                                        dispatch(addSelectedTicketReducer(ticket))
                                        dispatch(addRaffillionaireBundleReducer(raffillionaireInfo.qty+1))
                                        await refetchType()
                                        dispatch(hideModalAction())
                                        setIsLoading(false)
                                        setLock(false)
                                    }
                                })
                            }}>
                            <div className={'d-flex flex-column align-items-center justify-content-between'}>
                                <div className={'mb-5'}>{t('raffleillionaire.newBundle')}</div>
                            </div>
                        </ModalForm>)
                    )
                }
                else {
                    if(lock) {
                        Toastify({
                            text: "Handling another ticket please wait",
                            duration: 3000,
                            gravity: "top",
                            position: langVal === 'en' ? "left" : "right",
                            style: {
                                background: "#F00",
                            }
                        }).showToast();
                        return
                    }
                    setIsLoading(true)
                    setLock(true)
                    await socketAddTicket(ticket,async (r)=>{
                        if (r.status === 'ok') {
                            dispatch(addSelectedTicketReducer(ticket))
                            await dispatch(callCart(user.token,langVal,currency))
                            refetchType()
                            setIsLoading(false)
                            setLock(false)
                        }
                    })
                }
            }
        }
    }
    const deleteTicket = async ticket => {
        if(lock) {
            Toastify({
                text: "Handling another ticket please wait",
                duration: 3000,
                gravity: "top",
                position: langVal === 'en' ? "left" : "right",
                style: {
                    background: "#F00",
                }
            }).showToast();
            return
        }
        setIsLoading(true)
        setLock(true)
        await socketDeleteTicket(ticket,async (r)=>{
            if (r.status==='ok'){
                await dispatch(callCart(user.token,langVal,currency)).then(async ()=>{
                    setAllSelectedTickets(prevState => prevState.filter(item=> item!==ticket))
                    await dispatch(removeSelectedTicketReducer(ticket))
                    setIsLoading(false)
                    setLock(false)
                })
            }
        })
        // dispatch(removeSelectedTicketReducer(ticket))
        await refetchType()
    }
    const clickHandler =async () =>{
        if (!handleClick) return
        if (isModal) await editTicket(ticket)
        else{
            if (ticketMode==='select') await addTicket(ticket)
            if (ticketMode==='delete') await deleteTicket(ticket)
        }
    }

  return (

      <div className={`card-bun text-center position-relative ${ticketMode==='delete' && 'active'} ${isModal && 'card-bun-modal'}`} onClick={clickHandler} {...props}>
          {isLoading && (ticketMode==='select'&&ticketMode!=='delete') &&
              <div className='is-over d-flex align-items-center justify-content-center w-100 h-100'>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
              </div>
          }
          {ticketMode==='selected' &&
              <div className='is-over d-flex align-items-center justify-content-center w-100 h-100'/>
          }
          {ticketMode==='delete' &&
              (isLoading
                  ? <button className="spinner-border spinner-border-sm text-white bg-transparent" role="status" aria-hidden="true" />
                  : <button disabled={isLoading} onClick={clickHandler} className='icon-x' />
              )
          }
          <span> {t('raffleillionaire.TD')} </span>
          <span>{ticket}</span>
      </div>
  )
}