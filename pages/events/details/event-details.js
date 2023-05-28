import React, { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";
import Image from 'next/image';
import {useRouter} from "next/router";
import {useApi} from "../../../hooks/useApi";
import {getMerchantDetails, sendEventBookingRequest} from "../../../redux-toolkit/actions/axiosCalls";
import {LoadData} from "../../../components";
import {EventTicket} from "../../../components/EventTicket";
import {showModalAction} from "../../../redux-toolkit/actions";
import {ModalForm} from "../../../components/ModalForms/ModalForm";
import Toastify from "toastify-js";
import {t} from "i18next";


export default function DetailsName() {
  
    const { t }                                         = useTranslation();
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);
    const router                                        = useRouter()
    const dispatch                                      = useDispatch()
    const {id,event}                                    = router.query
    const [currentEvent,setCurrentEvent]                = useState(null)
    const [selectedTickets,setSelectedTickets]          = useState([])
    const [bookingLoading,setBookingLoading]            = useState(false)
    const [notesState,setNotesState]                    = useState('')
    const [bookingErrorMessage,setBookingErrorMessage]  = useState('')


    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    const {
        data:eventDetails,
        isLoading:isEventDetailsLoading,
        reFetch:refetchEventDetails
    } = useApi(()=> getMerchantDetails(user.token,langVal,currency,id),false)
    useEffect(()=>{
        if (id) refetchEventDetails()
    },[id])
    useEffect(()=>{
        if (eventDetails) {
            setCurrentEvent(eventDetails.merchants.events.find(ev => ev.id === Number(event)));
        }
    },[eventDetails])

    const cancellationPolicy = () => {
        dispatch(showModalAction(
            <ModalForm title={t('app.titlePolicy')}>
                This is cancellation policy
            </ModalForm>))
    }
    const submitEventBooking = () => {
        setBookingLoading(true);
        const bookingData = {
            notes: notesState || null,
            tickets: JSON.stringify(selectedTickets.map(ticket => ({id:ticket.id,qty:ticket.qty}))),
            event_id:event
        };
        (async () => await sendEventBookingRequest(user.token,langVal,currency,bookingData))()
            .then(r=> {
                console.log(r);
                setSelectedTickets([])
                Toastify({
                    text: 'Request sent successfully',
                    duration: 3000,
                    gravity: "top",
                    position: langVal === 'en' ? "left" : "right",
                    style: {
                        background: "#007427",
                    }
                }).showToast();
                setBookingLoading(false)
            })
            .catch(e => console.log(e))
    }

    if (isEventDetailsLoading || !currentEvent) return <LoadData/>

    if(user === null) return null;
    
    return (
      <div className='page-events-ev'>
          

            <div className=''>


                <div className='container pt-5 pb-4'>

                    <div className='position-relative ev-poster'>

                        <Image className='rounded-3 c-img' unoptimized={true} width={550} height={450} alt='img' src={currentEvent.cover}/>

                        <Image className='w-100 rounded-3' unoptimized={true} width={188} height={500} alt='cover' src='/img/mask-m.png'/>

                        <div className='ti-live-man'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <h2 className='text-white m-0'>{currentEvent.title}</h2>
                                <div className='d-flex align-items-center'>
                                    <i className='icon-location1 text-white fs-3'/>
                                    {/*<h5 className='text-white my-0 mx-2'>Coca-Cola Arena</h5>*/}
                                </div>
                            </div>
                            <p className='text-white mt-5 mb-0'>{currentEvent.brief}</p>
                            <p className='text-white mt-5 mb-0'>Support: {currentEvent.email}</p>
                            <div className='p-2 d-flex align-items-center mt-5'>
                                <div className='d-flex align-items-center bg-white rounded-3 p-3'>
                                    <i className='icon-date fs-5'/>
                                    <span className='mx-2 fs-6'>{currentEvent.date}</span>
                                </div>
                                <div className='d-flex align-items-center bg-white rounded-3 p-3 mx-3'>
                                    <i className='icon-clock fs-5'/>
                                    <span className='mx-2 fs-6'>{currentEvent.time}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='row'>
                        <div className='col-md-6 col-xs-12'>

                            <div className='my-2'>
                                <h6 className='bgMainColor p-3 text-white rounded-3 fw-light d-inline-block'>
                                    {t('events.aboutEvent')}
                                </h6>
                                <p className='pe-4'>{currentEvent.description}</p>
                            </div>

                            <div className='my-2'>

                                <h6 className='bgMainColor p-3 text-white rounded-3 fw-light d-inline-block'>
                                {t('events.ticketCategories')}
                                </h6>
                                {currentEvent.tickets.map(ticket =>
                                    <div className='d-flex align-items-center my-2' key={ticket.id}>
                                        <h6 className='m-0'>{ticket.title} : </h6>
                                        <h6 className='m-0 mx-1'>{currency + ' ' + ticket.price}</h6>
                                    </div>
                                )}

                            </div>

                        </div>
                        <div className='col-md-6 col-xs-12'>

                            <h6 className='bgMainColor py-3 px-5 text-white rounded-3 fw-light d-inline-block'>
                            {t('events.overview')}
                            </h6>

                            <div className='d-flex my-4'>
                                <i className='icon-location1 mainColor fs-4'/>
                                <span className='mx-2'>{currentEvent.map_desc}</span>
                            </div>

                            <div className='d-flex my-4'>
                                <i className='icon-internet mainColor fs-4'/>
                                <Link href={currentEvent.website} className='mx-2 mainColor'>{currentEvent.website}</Link>
                            </div>

                            <div className='d-flex my-4'>
                                <i className='icon-call mainColor fs-4'/>
                                <span className='mx-2'>{currentEvent.phone}</span>
                            </div>

                            <div className="gmap_canvas">
                                {/*<iframe width="100%" height="200" className='rounded-3' src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;coord=52.70967533219885, -8.020019531250002&amp;q=1%20Grafton%20Street%2C%20Dublin%2C%20Ireland&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>*/}
                                <iframe width="100%" height="200" className='rounded-3' src={`https://maps.google.com/maps?q=${currentEvent.lat},${currentEvent.lng}&z=15&output=embed`} frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"/>
                            </div>

                        </div>
                    </div>

                </div>

                <hr/>

                <div className='container'>

                    <div className='row'>

                        <div className='col-md-6 col-xs-12'>
                            <div className='my-2'>
                                <h6 className='bgMainColor p-3 text-white rounded-3 fw-light d-inline-block'>
                                {t('events.bookTickets')}
                                </h6>
                            </div>
                            {currentEvent.tickets.map(ticket =>
                                <EventTicket
                                    key={ticket.id}
                                    ticket={ticket}
                                    selectedTickets={selectedTickets}
                                    setSelectedTickets={setSelectedTickets}
                                />
                            )}
                        </div>

                        {selectedTickets.length > 0 && <div className='col-md-6 col-xs-12'>
                            <div className='my-2'>
                                <h6 className='bgMainColor p-3 text-white rounded-3 fw-light d-inline-block'>
                                {t('events.finalizeBooking')}
                                </h6>
                            </div>

                            <div className="td-mini-booking-request">
                                <div className={'p-4 rounded-3 old-shadow box-result my-5 mt-3 pt-1'}>
                                    <h4>{t('booking.Reserve.bookingRequest')}</h4>
                                    <div>
                                        <h5>{t('millionaire.cart.totalPrice')} {currency + ' ' + selectedTickets.reduce((acc,e) => (acc+e.price*e.qty) ,0)}</h5>
                                    </div>
                                    {/*<div>{totalPrice > 0 && <h5>{currency} {employeesState.length > 0 ? totalPrice*employeesState.length : totalPrice}</h5>}</div>*/}
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard</p>

                                    <div className="my-4 border-dotted">
                                        <label className="fw-light mb-2">{t('booking.Reserve.additionalNote')}</label>
                                        <textarea onChange={e=>setNotesState(e.target.value)} maxLength={250}/>
                                    </div>
                                    <div className="bgGrayColor p-3">
                                        <div className="d-flex">
                                            <span className="mainColor fw-light">{t('booking.Reserve.note')}</span>
                                            <p className="fw-light m-0 mx-2">
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
                                            </p>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-end mt-3">
                                            <h6 className="fw-light m-0 mx-2">{t('booking.Reserve.cancellation')}</h6>
                                            <button className="icon-info" onClick={cancellationPolicy} />
                                        </div>
                                    </div>
                                    <button
                                        onClick={submitEventBooking}
                                        className={'bgMainColor btn-button text-white w-auto my-4 d-table m-auto px-4'}
                                    >
                                        {bookingLoading
                                            ? <span className={'spinner-border spinner-border-sm text-white'}/>
                                            : <>{t("booking.Reserve.sendBooKing")}</>
                                        }
                                    </button>
                                    {/*<div className={'text-center text-danger'}>{bookingErrorMessage}</div>*/}

                                </div>
                            </div>
                        </div>}

                    </div>

                </div>

            </div>

      </div>
    )
}