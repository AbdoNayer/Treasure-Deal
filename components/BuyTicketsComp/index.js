import React from 'react';
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import Image from "next/image";
import {CountdownTimer} from "../CountdownTimer";
import {InputSelect} from "../Inputs/InputSelect";
import {InputText} from "../Inputs/InputText";
import {VoucherCard} from "../VoucherCard";
import {TicketCard} from "../TicketCard";
import {LoadData} from "../index";
import {useEffect, useRef, useState} from "react";
import {useApi} from "../../hooks/useApi";
import {getAllTickets} from "../../redux-toolkit/actions/axiosCalls";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {
    addTicketRaffillionaire, callCart,
    hideModalAction,
    selectLinesRaffillionaire,
    showModalAction
} from "../../redux-toolkit/actions";
import {ModalForm} from "../ModalForms/ModalForm";
import {
    addRaffillionaireSelectedTicketReducer,
    removeRaffillionaireSelectedTicketReducer
} from "../../redux-toolkit/reducer/raffillionaireLinesReducer";
import {addRaffillionaireBundleReducer} from "../../redux-toolkit/reducer/raffillionaireBundleReducer";
import io from "socket.io-client";
import {
    addSelectedTicketReducer,
    removeSelectedTicketReducer, resetSelectedTicketsReducer
} from "../../redux-toolkit/reducer/selectedTicketsReducer";


export default  function BuyTicketsComp ({type,typeDetails,typeName,refetchType,selectedTickets,drawType,backgroundImgClass='BG-2'}) {

    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);
    const raffillionaireInfo                            = useSelector((state) => state.raffillionaireBundle.raffillionaireBundle);
    const selectedTicketsReducer                        = useSelector((state) => state.selectedTickets.selectedTickets.selected_tickets);
    const cartInfo                                      = useSelector((state) => state.cart.cartState.carts);

    const router                                        = useRouter()
    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch()
    const [ticketOption,setTicketOption]                = useState('all')
    const [ticketCount,setTicketCount]                  = useState(63)
    const [ticketSearch,setTicketSearch]                = useState('')
    const [ticketFilter,setTicketFilter]                = useState('')
    const [allSelectedTickets,setAllSelectedTickets]    = useState([])

    const [horoscopeState,setHoroscopeState]            = useState(true)
    const [bundlesQuantity, setBundlesQuantity]         = useState([]);

    const didMount = useRef(false);
    const socket = io('https://treasuredeal.com:9090', {
        query: "id=" + user.id + "&user_type=User",
    });
    useEffect(()=>{
        // dispatch(callCart(user.token,langVal,currency))
        const addListener = data => {
            setAllSelectedTickets(prevState => prevState.includes(data.ticket) ? prevState : [...prevState,data.ticket])
        }
        const editListener = data => {
            setAllSelectedTickets(prevState => prevState.includes(data.ticket) ? prevState : [...prevState,data.ticket])
        }
        const deleteListener = data => {
            setAllSelectedTickets(prevState => prevState.filter(ticket=> ticket!==data.ticket))
        }
        const connectListener = data => {
            console.log('connect', 'connected to socket from web')
        }

        socket.once("connect", connectListener);
        socket.on("selectLineRes", addListener);
        socket.on("editLineRes", editListener);
        socket.on("deleteLineRes", deleteListener);
        return () => {
            dispatch(resetSelectedTicketsReducer())
            socket.off("selectLineRes", addListener);
            socket.off("editLineRes", editListener);
            socket.off("deleteLineRes", deleteListener);
        }
    },[]);

    useEffect(()=>{
        console.log('all selected tickets state',allSelectedTickets);
        console.log('reducer selected tickets', selectedTicketsReducer)
        console.log('cart info',
            cartInfo.filter(cart=> cart.cart_data.type === type).reduce((a,e) =>
                    a ? [...a,e.lines[0].ticket.join('') ] : e.lines[0].ticket.join('')
                ,[]
            )
        )
    },[allSelectedTickets,allSelectedTickets,selectedTicketsReducer])


    useEffect(()=>{
        setBundlesQuantity([...Array(raffillionaireInfo.qty).keys()])
    },[raffillionaireInfo.qty])


    const selectOptions = [
        {
            label:'Starts with',
            value:'start_with'
        },
        {
            label: 'Ends with',
            value: 'end_with'
        }
    ]

    const {
        data:allTicketsData,
        isLoading:isAllTicketsLoading,
        reFetch:refetchAllTickets,
    } = useApi(()=> getAllTickets(user.token,langVal,currency
        ,type,ticketOption==='lucky'?'all':ticketOption,ticketOption==='lucky'?1:ticketCount
        ,ticketFilter==='start_with'?ticketSearch:'',ticketFilter==='end_with'?ticketSearch:'')
    )
    useEffect(()=>{
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        refetchAllTickets()
    },[ticketOption,ticketFilter,ticketSearch])

    useEffect(()=>{
        if (allTicketsData) {
            setAllSelectedTickets(prevState => [
                ...prevState,
                ...allTicketsData?.tickets.filter(ticket=> ticket.selected).filter(ticket=> !prevState.includes(ticket.value)).map(ticket=> ticket.value)
            ])
        }
    },[allTicketsData])

    useEffect(()=>{
        setAllSelectedTickets(prevState =>
            [ ...new Set(
                [
                        ...prevState,
                        ...selectedTicketsReducer,
                        ...cartInfo.filter(cart=> cart.cart_data.type === type).reduce((a,e) =>
                                a ? [...a,e.lines[0].ticket.join('') ] : e.lines[0].ticket.join('')
                            ,[]
                        )
                ]
            ) ]
        )
    },[selectedTicketsReducer])

    const socketAddTicket = ticket => {
        socket.emit('selectLine', {user_id:user.id,type:type,ticket:ticket})
    }
    const socketDeleteTicket = ticket => {
        socket.emit('deleteLine', {user_id:user.id,type:type,ticket:ticket})
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
                    dispatch(showModalAction(
                        <ModalForm
                            title={t('millionaire.lotto.buttons.addBundle')}
                            applyText={t('millionaire.lotto.buttons.addBundle')}
                            applyButton
                            applyFunction={async () => {
                                await socketAddTicket(ticket)
                                await dispatch(callCart(user.token,langVal,currency))
                                dispatch(addSelectedTicketReducer(ticket))
                                dispatch(addRaffillionaireBundleReducer(raffillionaireInfo.qty+1))
                                await refetchType()
                                dispatch(hideModalAction())
                            }}>
                            <div className={'d-flex flex-column align-items-center justify-content-between'}>
                                <div className={'mb-5'}>{t('raffleillionaire.newBundle')}</div>
                            </div>
                        </ModalForm>)
                    )
                }
                else {
                    await socketAddTicket(ticket)
                    dispatch(addSelectedTicketReducer(ticket))
                    await dispatch(callCart(user.token,langVal,currency))
                    refetchType()
                }
            }
        }
    }
    const deleteTicket = async ticket => {
        await socketDeleteTicket(ticket)
        dispatch(removeSelectedTicketReducer(ticket))
        await refetchType()
    }

    return (
        <div className={'td-lotto container raffleillionaire'}>
            <div className="td-lotto-header">

                <div className='my-5'>
                    <h3 className="td-lotto-header-title fw-light mt-4 fs-1 text-center">{t('millionaire.lotto.title')}</h3>
                    <p className="td-lotto-header-description mt-4 fs-6">{t('millionaire.lotto.description')}</p>
                </div>

                <div className={`td-lotto-header-prize ${backgroundImgClass} mt-4 d-flex justify-content-between align-items-center p-4`}>
                    <div className="td-lotto-header-prize-logo">
                        <Image style={{ objectFit : "contain" }} width={100} height={100} src="/img/TD.png" alt="treasure deal logo"/>
                    </div>
                    <div className="td-lotto-header-prize-money d-flex flex-column text-center">
                        <div className="fw-bold">{typeName}</div>
                        <div className="fw-bold">{typeDetails.prize_value.toLocaleString()}</div>
                    </div>
                    <div className="td-lotto-header-prize-countdown align-self-end">
                        <CountdownTimer date={typeDetails.prize_date} />
                    </div>
                </div>
            </div>
            <div className="td-lotto-body">
                <div className="td-lotto-body-header d-flex align-items-center justify-content-between">
                    <div className="td-lotto-body-header-logo mx-2">
                        <Image style={{ objectFit : "contain" }} width={120} height={40} src="/img/logo-white.png" alt="treasure deal logo"/>
                    </div>
                    <div className="td-lotto-body-header-buttons d-flex align-items-center">
                        <div className='select-num m-2'>
                            <InputSelect
                                options={selectOptions}
                                placeholder={t('raffleillionaire.selOption')}
                                onChange={e=> setTicketFilter(e.value)}
                            />
                        </div>
                        <div className='input-num position-relative'>
                            <span className='mainColor'>{t('raffleillionaire.TD')} - </span>
                            <InputText
                                disabled={!ticketFilter}
                                placeholder={t('raffleillionaire.seaNumber')}
                                onChange={e=> setTicketSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="td-lotto-body-bundles position-relative p-4">
                    <div className='d-flex align-items-center justify-content-center mb-5'>
                        <button className={`btn-button mx-2 ${ticketOption === 'all' ? 'bgSecondColor' : 'bgGrayColor'}`} onClick={()=> setTicketOption('all')}>
                            {t('raffleillionaire.all')}
                        </button>
                        <button className={`btn-button mx-2 ${ticketOption === 'odd' ? 'bgSecondColor' : 'bgGrayColor'}`} onClick={()=> setTicketOption('odd')}>
                            {t('raffleillionaire.odd')}
                        </button>
                        <button className={`btn-button mx-2 ${ticketOption === 'even' ? 'bgSecondColor' : 'bgGrayColor'}`} onClick={()=> setTicketOption('even')}>
                            {t('raffleillionaire.even')}
                        </button>
                        <button className={`btn-button mx-2 ${ticketOption === 'lucky' ? 'bgSecondColor' : 'bgGrayColor'}`} onClick={()=> setTicketOption('lucky')}>
                            {t('raffleillionaire.myLucky')}
                        </button>
                    </div>
                    <div className='row'>
                        <div className='col-md-6 col-xs-12'>
                            <h4 className='fw-light'>{t('Your Selection')}</h4>
                            <div className="td-voucher-body-content-bundles p-4">
                                <div className='position-relative in-card-loop m-0'>
                                    {bundlesQuantity.map(bundle=> <VoucherCard
                                        key                 = { bundle }
                                        image               = { '/img/card.png' }
                                        price               = { raffillionaireInfo.price_per_bundle }
                                        date                = { raffillionaireInfo.date }
                                        terms               = { t('millionaire.voucher.cardTermsMini') }
                                        textModal           = { raffillionaireInfo.terms }
                                    />)}
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6 col-xs-12'>
                            <div className='d-flex align-items-center justify-content-between'>
                                <h4 className='fw-light'>{t('raffleillionaire.pickTickets')}</h4>
                                {/*<i className='icon-users mainColor fs-4' onClick={showPartners}/>*/}
                            </div>
                            {selectedTicketsReducer && selectedTicketsReducer.length > 0 && <div
                                className={'d-flex align-items-center justify-content-center flex-wrap over-card-bundle raffillionaire-selected-tickets'}>
                                {selectedTicketsReducer.map(item =>
                                        <TicketCard ticketMode={'delete'} ticket={item} key={item}
                                                    handleClick={deleteTicket}
                                        />
                                    // <div className='card-bun active text-center' key={item.id}>
                                    //     {
                                    //         isRemove ?
                                    //         <button className="spinner-border spinner-border-sm text-white bg-transparent" role="status" aria-hidden="true" />
                                    //         :
                                    //         <button onClick={() => deleteTicket(item.id)} disabled={isRemove} className='icon-x' />
                                    //     }
                                    //     <span> TD </span>
                                    //     <span>{item.ticket}</span>
                                    // </div>
                                )}
                            </div>
                            }
                            <div className={ticketOption === 'lucky' ? 'position-relative' : 'height-view position-relative'}>
                                {isAllTicketsLoading
                                    ?
                                    <div className='height-view'>
                                        <LoadData />
                                    </div>
                                    :
                                    ticketOption === 'lucky' ?
                                        <div className='one-card text-center my-5'>
                                            {horoscopeState
                                                ? <>
                                                    <p>{t('raffleillionaire.clickLucky')}</p>
                                                    <div className='d-flex align-items-center flex-column justify-content-center text-center' onClick={()=>setHoroscopeState(false)}>
                                                        <Image style={{ objectFit : "contain" }} width={300} height={300} alt='img' src={user.horoscope_image} />
                                                    </div>
                                                </>
                                                : <>
                                                    <p>{t('raffleillionaire.hereBest')}</p>
                                                    {allTicketsData.tickets.map((item, i) => (
                                                        <div key={item.value} className='bg-card-one d-flex align-items-center justify-content-center' onClick={()=>addTicket(item.value)}>
                                                            <div className='d-flex align-items-center flex-column justify-content-center text-center'>
                                                                {false
                                                                    ? <span className="spinner-border spinner-border-sm mainColor" role="status" aria-hidden="true"/>
                                                                    : <>
                                                                        <Image style={{ objectFit : "contain" }} width={50} height={50} alt='img' src='/img/favicon.png'/>
                                                                        <span>{item.value}</span>
                                                                    </>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <p>{t('raffleillionaire.clickSelection')}</p>
                                                </>
                                            }
                                        </div>
                                        : <div className='over-card-bundle d-flex flex-wrap'>
                                            {allTicketsData.tickets.map((item, i) => (
                                                <TicketCard ticketMode={allSelectedTickets.includes(item.value) ? 'selected' : 'select'} ticket={item.value} key={item.value} handleClick={addTicket}/>
                                            ))}
                                        </div>
                                }
                            </div>

                            {!(horoscopeState && ticketOption==='lucky') &&  <button
                                className={'btn-button bgMainColor text-white icon-repeat d-table m-auto my-4'}
                                onClick={() => refetchAllTickets()}
                            />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="td-lotto-footer d-flex align-items-center justify-content-between mb-5">
                <button className={'btn-button bgMainColor text-white'} >{t('millionaire.lotto.buttons.continueShopping')}</button>
                <button className={'btn-button bgMainColor text-white'} onClick={()=>router.push('/shopping-cart')}>
                    <span>{t('millionaire.lotto.buttons.viewCart')}</span>
                </button>
            </div>
        </div>

    )
}