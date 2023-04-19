import {LoadData} from "../../index";
import {useState} from "react";
import { useTranslation } from "react-i18next";

export const BookingServices = ({services,voucherType,isServicesLoading,isRadio=false,setSelectedServices,...props}) => {
    
    const { t }              = useTranslation();
    const [bookingDuration,setBookingDuration] = useState([])
    const [selectedServiceId,setSelectedServiceId] = useState('')
    const [selectedDurationId,setSelectedDurationId] = useState('')
    const checkVoucher = () =>{
        switch (voucherType) {
            case 'cleaner':
            case 'spa_therapist':
                return true;
            default:
                return false;
        }
    }
    return (
        <div className={'td_booking_services mb-5'}>
            {isServicesLoading
                ? <div className={'modal-height-view position-relative'}><LoadData/></div>
                : <>
                    <div className="td_services_wrapper p-3">
                        <div className="td_title">{t('booking.serviceType')}</div>
                        <div className={'d-flex mt-4'}>
                            {isRadio
                                ? (services.map((service, idx) =>
                                    <div key={idx} className={'td_radio_select d-flex align-items-center mb-3 me-3'}>
                                        <input type={"radio"} id={service.id} name={'person_radio_options'}
                                               className={'me-2'} value={service.id}
                                               // onChange={e => setSelectedServices(service)}/>
                                               onChange={e => {
                                                        if (checkVoucher()){
                                                            setBookingDuration(service.prices);
                                                            setSelectedServiceId(service.id)
                                                        } else setSelectedServices(service)
                                                    }
                                               }
                                        />
                                        <label htmlFor={service.id}
                                               className={'fs-6'}>{service.name}</label>
                                    </div>
                                ))
                                : (services.map((service, idx) =>
                                    <div key={idx} className={'td_radio_select d-flex align-items-center mb-3 me-3'}>
                                        <input type={"checkbox"} id={service.id} name={'person_checkbox_options'}
                                               className={'me-2'} value={service.id}
                                               onChange={e => setSelectedServices(service)}/>
                                        <label htmlFor={service.id}
                                               className={'fs-6'}>{service.name} - {service.price} AED</label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="td_service_provider mt-5">
                        {bookingDuration.length > 0 &&
                            <>
                                <div className="td_title mb-3">{t('booking.selectDuration')}</div>
                                <div className={'td_gender_wrapper d-flex align-items-center'}>
                                    {bookingDuration.map(duration =>
                                        <div
                                            className={`td_gender ${selectedDurationId===duration.id &&'td_selected_gender'} d-flex align-items-center justify-content-center fs-5 me-4`}
                                            onClick={()=> {
                                                setSelectedServices({
                                                    id: duration.id,
                                                    serviceId: selectedServiceId,
                                                    price: duration.price
                                                })
                                                setSelectedDurationId(duration.id)
                                            }}
                                            key={duration.id}>{duration.duration}</div>
                                    )}
                                </div>
                            </>
                        }
                    </div>
                </>
            }
        </div>
    )
}

