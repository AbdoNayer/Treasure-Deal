import {useState} from "react";

export const BookingGender = ({...props}) => {
    const [serviceGender,setServiceGender] = useState('')
    return (
        <div className={'td_booking_services'}>
            <div className="td_service_provider mt-5 mb-5">
                <div className="td_title mb-3">Service Provider</div>
                <div className="td_gender_wrapper d-flex align-items-center">
                    <div
                        onClick={() => setServiceGender('male')}
                        className={`td_gender ${serviceGender === 'male' && 'td_selected_gender'} d-flex align-items-center justify-content-center fs-5 me-4`}
                    >Male</div>
                    <div
                        onClick={() => setServiceGender('female')}
                        className={`td_gender ${serviceGender === 'female' && 'td_selected_gender'} d-flex align-items-center justify-content-center fs-5`}
                    >Female</div>
                </div>
            </div>
        </div>
    )
}