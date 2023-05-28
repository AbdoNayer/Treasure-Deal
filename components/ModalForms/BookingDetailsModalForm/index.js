import {InputText} from "../../Inputs/InputText";
import {useTranslation} from "react-i18next";
import {getOrderDetails} from "../../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../../hooks/useApi";
import {useEffect,useState} from "react";
import {useSelector} from "react-redux";
import {LoadData} from "../../index";

export const BookingDetailsModalForm = ({orderId,...props}) => {
    const { t }                                         = useTranslation();
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);

    const {
        data,
        isLoading,
        reFetch
    } = useApi(()=> getOrderDetails(user.token,langVal,currency,orderId))

    const bookingDetailsBasedOnType = () => {
        switch (data.order.shop_type) {
            case 'event':
                return <>
                    <h5>{data.order.event?.title}</h5>
                    <p>{data.order.event?.description}</p>
                    <div className="d-flex align-items-center my-3 border-dotted pb-3 flex-wrap">
                        {data.order.event.time && <h6 className="fw-light m-0 bgMainColor text-white w-auto py-2 px-3 rounded-1 mb-2">TIME : {data.order.event.time}</h6>}
                        <h6 className="fw-light m-0 bgMainColor text-white w-auto py-2 px-3 rounded-1 mx-3 mb-2">{checkDateMsg.checkIn} : {data.order?.event.date}</h6>
                        <h6 className="fw-light m-0 bgMainColor text-white w-auto py-2 px-3 rounded-1 mb-2">Purchased Tickets : {data.order?.purchased_tickets.length}</h6>
                    </div>
                </>
            case 'illusion':
                return <>
                    <h5>{data.order.illusion_data?.PartyName}</h5>
                    <p>Passengers: {data.order.illusion_data?.Passengers.length}</p>
                    <div className="d-flex align-items-center my-3 border-dotted pb-3 flex-wrap">
                        <h6 className="fw-light m-0 bgMainColor text-white w-auto py-2 px-3 rounded-1 mb-2">Price : {data.order.illusion_data.Currency + ' ' + data.order.final_total}</h6>
                        <h6 className="fw-light m-0 bgMainColor text-white w-auto py-2 px-3 rounded-1 mx-3 mb-2">{checkDateMsg.checkIn} : {data.order?.date?.split('T')[0]}</h6>
                        {data.order.date_to && <h6 className="fw-light m-0 bgMainColor text-white w-auto py-2 px-3 rounded-1 mx-3 mb-2">{checkDateMsg.checkOut} : {data.order.date_to.split('T')[0]}</h6>}
                    </div>
                </>
            case 'property':
                return <>
                    <h5>Property Viewing</h5>
                    <p>{data.order.services[0].service_name}</p>
                    <div className="d-flex align-items-center my-3 border-dotted pb-3 flex-wrap">
                        {data.order.time && <h6 className="fw-light m-0 bgMainColor text-white w-auto py-2 px-3 rounded-1 mb-2">TIME : {data.order.time}</h6>}
                        <h6 className="fw-light m-0 bgMainColor text-white w-auto py-2 px-3 rounded-1 mx-3 mb-2">{checkDateMsg.checkIn} : {data.order?.date?.split('T')[0]}</h6>
                    </div>
                </>
            default:
                return <>
                    <h5>{data.order.voucher?.category}</h5>
                    <p>{data.order.voucher?.description}</p>
                    <div className="d-flex align-items-center my-3 border-dotted pb-3 flex-wrap">
                        {data.order.time && <h6 className="fw-light m-0 bgMainColor text-white w-auto py-2 px-3 rounded-1 mb-2">TIME : {data.order.time}</h6>}
                        <h6 className="fw-light m-0 bgMainColor text-white w-auto py-2 px-3 rounded-1 mx-3 mb-2">{checkDateMsg.checkIn} : {data.order?.date?.split('T')[0]}</h6>
                        {data.order.date_to && <h6 className="fw-light m-0 bgMainColor text-white w-auto py-2 px-3 rounded-1 mx-3 mb-2">{checkDateMsg.checkOut} : {data.order.date.split('T')[0]}</h6>}
                    </div>
                </>
        }
    }

    //#region check-in and check-out messages
    const [checkDateMsg,setCheckDateMsg] = useState({
        checkIn:"",
        checkOut:"",
    })
    const checkInCheckOutMsg = () => {
        if (data.order.voucher_type) {
            switch (data.order.voucher_type) {
                case 'car':
                    setCheckDateMsg({checkIn: 'Pick Up',checkOut: 'Handover'})
                    return;
                case 'room':
                    setCheckDateMsg({checkIn: 'Check In',checkOut: 'Check Out'})
                    return;
                default:
                    setCheckDateMsg({checkIn: 'Arrival Date',checkOut: ''})
                    return;
            }
        } else {
            switch (data.order.shop_type) {
                case 'illusion':
                    setCheckDateMsg({checkIn: 'Check In',checkOut: 'Check Out'})
                    return;
                case 'event':
                    setCheckDateMsg({checkIn: 'Event Date',checkOut: ''})
                    return;
                case 'property':
                    setCheckDateMsg({checkIn: 'Viewing Date',checkOut: ''})
                    return;
            }
        }
    }
    useEffect(()=>{
        if (data?.order) checkInCheckOutMsg()
    },[data?.order.voucher_type])
    //#endregion

    if (isLoading) return <div className={'modal-height-view position-relative'}><LoadData/></div>
    return (
        <div className=" booking-det rounded-3 mb-4  box-result">
            {bookingDetailsBasedOnType()}
            <div className={`my-2 ${data.order.final_price && 'border-dotted'}`}>
                <div className="row">
                    <div className="col-md-12 col-xs-12 mb-2">
                        <InputText label={t('favouritesProfile.name')} placeholder={user.full_name} disabled />
                    </div>
                    <div className="col-md-6 col-xs-12 mb-2">
                        <InputText label={t('booking.Reserve.email')} placeholder={user.email} disabled />
                    </div>
                    <div className="col-md-6 col-xs-12 mb-2">
                        <InputText label={t('booking.Reserve.phone')} placeholder={`+${user.full_phone}`} disabled />
                    </div>
                    {/*<div className="col-md-12 col-xs-12 mb-2">*/}
                    {/*    <label className="fw-light mb-2">{t('booking.Reserve.additionalNote')}</label>*/}
                    {/*    <textarea placeholder="Sh3wZa@gmail.com" value={'Sh3wZa@gmail.com'} disabled />*/}
                    {/*</div>*/}
                </div>
            </div>
            {data.order.final_price && <div className="d-flex justify-content-between align-items-center py-2">
                <h6 className="m-0 fw-light">{t('millionaire.cart.totalPrice')}</h6>
                <span>AED {data.order.final_price}</span>
            </div>}
        </div>
    )
}