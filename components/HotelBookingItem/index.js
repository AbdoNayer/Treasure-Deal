import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {
    Pagination, Thumbs, Autoplay
} from 'swiper';
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/pagination"
import "swiper/components/autoplay"
import "swiper/components/thumbs";
import Image from "next/image";
import {useTranslation} from "react-i18next";
import {showModalAction} from "../../redux-toolkit/actions";
import {ModalForm} from "../ModalForms/ModalForm";
import {ModalBookingRoom} from "../ModalForms/ModalBookingRoom";
import {useDispatch} from "react-redux";
SwiperCore.use([Pagination,Thumbs,Autoplay]);


export const HotelBookingItem = ({contract,openGalleryModal,galleryOptions,startDate,endDate,commission,discount,...props}) => {
    const { t }                                                     = useTranslation();
    const dispatch                                                  = useDispatch()

    const openModalBookingRoom = () => {
        dispatch(showModalAction(
            <div className="modal-booking-room">
                <ModalForm title={t('booking.Reserve.bookingRequest')}>
                    <ModalBookingRoom contract={contract} startDate={startDate} endDate={endDate} />
                </ModalForm>
            </div>
        ));
    }
    return (
        <div className="col-md-12 item-result-hotel">
            <div className={'td_car_booking td_hotel_booking mt-3'}>
                <div className="rounded-1 p-3">
                    <div className='row td_hotel_info_wrapper border-0'>
                        <div className="td_img_wrapper_hotel col-md-4 col-xs-12">
                            {contract.images.length > 0
                                ? <Swiper
                                    spaceBetween={10}
                                    grabCursor
                                    loop
                                    autoplay={{
                                        delay: 5000,
                                        waitForTransition: true,
                                        pauseOnMouseEnter: true,
                                        disableOnInteraction: false,
                                    }}
                                    className={'td-car-gallery-swiper'}
                                >
                                    {contract.images.map((img,idx) =>
                                        <SwiperSlide key={idx}
                                                     onClick={() => openGalleryModal(contract.images.map(item => ({src:item})))}>
                                            <Image className="w-100 rounded-1" width={200}
                                                   height={400} alt='service logo'
                                                   src={img}/>
                                        </SwiperSlide>
                                    )}
                                </Swiper>
                                : <Image
                                    className="w-100 rounded-1"
                                    width={200}
                                    height={200}
                                    alt='service logo'
                                    src={galleryOptions[0].src}
                                />
                            }
                        </div>
                        <div className="td_car_details col-md-8 col-xs-12 pt-2">
                            <div className="d-flex align-items-center justify-content-between fl-col mb-3">
                                <h4 className="m-0 mb-3">{contract.RoomType}</h4>
                                {/*<span className="text-danger fw-bold">{contract.TotalRate + ' ' + contract.CurrCode}</span>*/}
                                <div>
                                    <span className="fw-bold me-2">{((contract.TotalRate + (contract.TotalRate * (commission/100))) - ((contract.TotalRate * (discount/100)))).toFixed(2) + ' ' + contract.CurrCode}</span>
                                    <strike className="text-danger fw-bold">{(contract.TotalRate + (contract.TotalRate * (commission/100))).toFixed(2) + ' ' + contract.CurrCode}</strike>
                                </div>
                            </div>
                            <p className="mb-3">{contract.ContractLabel}</p>
                            <h6 className="mb-3">{contract.MealPlan}</h6>
                            <button
                                className="bgMainColor px-3 py-2 w-auto rounded-2 d-flex align-items-center justify-content-between text-white"
                                onClick={() => openModalBookingRoom()}
                            >
                                        {t('hotel.form.select')}
                                        {/*<h6 className="m-0 fw-light text-white small-font-13">Show Offers</h6>*/}
                                        {/*<span className="icon-chevron-down text-white"/>*/}
                            </button>
                        </div>
                    </div>
                    {/* {
                        inShowOffers ?
                            <div className='row p-2'>
                                <div className="col-md-4 col-xs-12">
                                    <div className="border p-2 my-2 rounded-3">
                                        <div
                                            className="d-flex align-items-center justify-content-between">
                                            <h5 className="mb-3">Name offer</h5>
                                            <span className="text-danger">324 AED</span>
                                        </div>
                                        <button className="bgMainColor p-2 rounded-2 text-white"
                                                onClick={() => setInShowFormBooking(!inShowFormBooking)}>
                                            Select Offer
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-4 col-xs-12">
                                    <div className="border p-2 my-2 rounded-3">
                                        <div
                                            className="d-flex align-items-center justify-content-between">
                                            <h5 className="mb-3">Name offer</h5>
                                            <span className="text-danger">324 AED</span>
                                        </div>
                                        <button className="bgMainColor p-2 rounded-2 text-white"
                                                onClick={() => setInShowFormBooking(!inShowFormBooking)}>
                                            Select Offer
                                        </button>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                    } */}
                </div>
            </div>
        </div>
    )
}