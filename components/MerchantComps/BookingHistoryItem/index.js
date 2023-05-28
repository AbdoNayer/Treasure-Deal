import Image from "next/image";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useState} from "react";
import {showModalAction} from "../../../redux-toolkit/actions";
import {ModalForm} from "../../ModalForms/ModalForm";
import {InputText} from "../../Inputs/InputText";
import {useRouter} from "next/router";
import {BookingDetailsModalForm} from "../../ModalForms/BookingDetailsModalForm";

export const BookingHistoryItem = ({order,handleCancelBooking,...props}) => {
    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch();
    const router                                        = useRouter();
    const [isCancelling,setIsCancelling] = useState(false)
    const handleCancel = (orderId) => {
        setIsCancelling(true)
        handleCancelBooking(orderId)
            .catch(e=>setIsCancelling(false))
    }
    // console.log(order)
    const checkCancelBackGroundColor = () => {
        switch (order.status) {
            case 'new':
                return 'bgBageColor';
            case 'canceled':
                return 'bgSecondColor';
            case 'finished':
                return 'bgAzrqColor text-white';
            case 'accepted':
                return 'bgGreenColor text-white';
            case 'rejected':
                return 'bg-danger text-white'
        }
    }

    const showOrderTitle = () => {
        switch (order.shop_type) {
            case 'event':
                return <h5 className="fw-light">{order.event?.title}</h5>
            case 'illusion':
                return <div className={'flex-column'}>
                    <h4 className="fw-light">Hotel Booking</h4>
                    <h5 className="fw-light">{order.illusion_data?.PartyName}</h5>
                </div>
            case 'property':
                return <div className={'flex-column'}>
                    <h4 className="fw-light">Property Viewing</h4>
                    <h5 className="fw-light">{order.services[0]?.service_name}</h5>
                </div>
            default:
                return <>
                    <h5 className="fw-light">{order.voucher?.category}</h5>
                    <span className="mainColor mx-2">( {Number(order.voucher?.discount_per)}% Off )</span>
                </>
        }
    }

    const showOrderDescription = () => {
        switch (order.shop_type) {
            case 'event':
                return <h6 className="fw-light">{order.event?.brief}</h6>
            case 'illusion':
                return <div>Passengers: {order.illusion_data?.Passengers?.length}</div>
            case 'property':
                return <div/>
            default:
                return <h6 className="fw-light m-0">{order.voucher?.description}</h6>
        }
    }

    const openModal = () => {
        dispatch(showModalAction(
            <ModalForm title={t('booking.details.modalTitle')}>
                <BookingDetailsModalForm orderId={order.id}/>
            </ModalForm>
        ));
    }

    return (
        <div {...props} className="block-item-cate d-flex align-items-center p-2 row">
            {/*<div className="col-md-3 col-xs-12">*/}
            {/*    <div className="img-vocher position-relative">*/}
            {/*        <Image style={{ width:"100%" }} width={338} height={230} alt='' src={'/img/9.png'} className='w-100' />*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className="col-md-12 col-xs-12">
                <div className="info-vocher">
                    <div className='d-flex align-items-center justify-content-between'>
                        <div className='d-flex align-items-center'>
                            {showOrderTitle()}
                        </div>
                        <div className='d-flex align-items-center'>
                            <span className="mx-2 fw-light">{t('ordersProfile.status')}</span>
                            <button className={`${checkCancelBackGroundColor()} px-3 py-2 fw-light rounded-pill`}>{order.status}</button>
                        </div>
                    </div>
                    <h6 className="fw-light">{order.voucher?.merchant}</h6>
                    <div className="d-flex align-items-center justify-content-between">
                        {showOrderDescription()}
                        {(order.status !== 'canceled'&&order.shop_type!=='illusion') &&
                            <button
                                className='bgSecondColor px-3 py-2 fw-light rounded-2 mx-3'
                                onClick={() => handleCancel(order.id)}
                            >
                                {isCancelling ? <span className={'spinner-border spinner-border-sm text-black'}/> : <>Cancel</>}

                            </button>
                        }
                    </div>
                    <div className={'d-flex align-items-center my-3'}>
                        <button className='bgMainColor px-3 py-2 fw-light rounded-2 text-white' onClick={()=> openModal()}>{t('user.profile.Redeem.bookingDetails')}</button>
                        {(order.shop_type!=='illusion'&&order.shop_type!=='property') && <button className='bgMainColor mx-2 px-3 py-2 fw-light rounded-2 text-white'
                                 onClick={() => router.push(`/booking/edit-reservation?order_id=${order.id}`)}>{t('user.profile.Redeem.editBooking')}</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}