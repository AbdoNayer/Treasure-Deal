import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {LoadData} from "../../../components";
import {useApi} from "../../../hooks/useApi";
import {
    editEventBookingRequest,
    getOrderDetails,
    sendEventBookingRequest
} from "../../../redux-toolkit/actions/axiosCalls";
import {EventTicket} from "../../../components/EventTicket";
import {showModalAction} from "../../../redux-toolkit/actions";
import {ModalForm} from "../../../components/ModalForms/ModalForm";
import Toastify from "toastify-js";

export default function EditEvent ({...props}) {
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const router                                            = useRouter();
    const { t }                                             = useTranslation();
    const dispatch                                          = useDispatch();
    const {order_id} = router.query
    const [selectedTickets,setSelectedTickets]              = useState([])
    const [notesState,setNotesState]                        = useState('')
    const [bookingLoading,setBookingLoading]                = useState(false)

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    const {
        data:orderDetailsData,
        isLoading:isOrderDetailsLoading,
        reFetch:refetchOrderDetails
    } = useApi(()=>  getOrderDetails(user.token,langVal,currency,order_id),false)

    useEffect(()=>{
        if (order_id) {
            refetchOrderDetails(() => getOrderDetails(user.token, langVal,currency, order_id))
        }
    },[order_id])

    useEffect(()=>{
        console.log(orderDetailsData);
    },[orderDetailsData])



    const cancellationPolicy = () => {
        dispatch(showModalAction(
            <ModalForm title={t('app.titlePolicy')}>
                This is cancellation policy
            </ModalForm>)
        )
    }
    const submitEventBooking = () => {
        setBookingLoading(true);
        const bookingData = {
            notes: notesState || null,
            tickets: JSON.stringify(selectedTickets.map(ticket => ({id:ticket.id,qty:ticket.qty}))),
            event_id:orderDetailsData.order.event.id,
            order_id:order_id
        };
        (async () => await editEventBookingRequest(user.token,langVal,currency,bookingData))()
            .then(r=> {
                console.log(r);
                setSelectedTickets([])
                Toastify({
                    text: 'Event updated successfully',
                    duration: 3000,
                    gravity: "top",
                    position: langVal === 'en' ? "left" : "right",
                    style: {
                        background: "#007427",
                    }
                }).showToast();
                setBookingLoading(false)
            })
            .catch(e => console.log(e)
            )
    }


    if (isOrderDetailsLoading) return <LoadData />

    if(user === null) return null;
    return (
        <div className='container'>

            <div className='row'>

                <div className='col-md-6 col-xs-12'>
                    <div className='my-2'>
                        <h6 className='bgMainColor p-3 text-white rounded-3 fw-light d-inline-block'>
                            {t('events.bookTickets')}
                        </h6>
                    </div>
                    {orderDetailsData?.order?.event?.tickets.map(ticket =>
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
    )
}