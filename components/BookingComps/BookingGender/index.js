import {useState} from "react";
import { useTranslation } from "react-i18next";

export const BookingGender = ({serviceGender,setServiceGender,...props}) => {
    const { t }              = useTranslation();
    return (
        <div className={'td_booking_services'}>
            <div className="td_service_provider mt-5 mb-5">
                <div className="td_title mb-3">{t('app.serviceProvider')}</div>
                <div className="td_gender_wrapper d-flex align-items-center">
                    <div
                        onClick={() => setServiceGender('Male')}
                        className={`td_gender ${serviceGender === 'Male' && 'td_selected_gender'} d-flex align-items-center justify-content-center fs-5 me-4`}
                    >{t('app.male')}</div>
                    <div
                        onClick={() => setServiceGender('Female')}
                        className={`td_gender ${serviceGender === 'Female' && 'td_selected_gender'} d-flex align-items-center justify-content-center fs-5`}
                    >{t('app.female')}</div>
                </div>
            </div>
        </div>
    )
}