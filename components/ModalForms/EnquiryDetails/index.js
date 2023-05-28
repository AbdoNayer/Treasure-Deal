import { InputSelect } from "../../Inputs/InputSelect";
import {chaneEnquiryStatus, getEnquiryDetailsData} from "../../../redux-toolkit/actions/axiosCalls";
import {useDispatch, useSelector} from "react-redux";
import {useApi} from "../../../hooks/useApi";
import {useTranslation} from "react-i18next";
import {LoadData} from "../../index";
import {useEffect, useState} from "react";
import {hideModalAction} from "../../../redux-toolkit/actions";

export const EnquiryDetails = ({enquiryId,refetchEnquires}) => {
    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch()
    const langVal                                       = useSelector((state) => state.language.language);
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);
    const [isUpdating,setIsUpdating]                    = useState(false)
    const [requestStatus,setRequestStatus]              = useState('')
    const [paymentType,setPaymentType]                  = useState()
    const [updateErrorMessage,setUpdateErrorMessage]    = useState('')
    const {
        data:enquiryDetails,
        isLoading:isEnquiryDetailsLoading,
        reFetch:refetchEnquiryDetails
    } = useApi(()=> getEnquiryDetailsData(enquiryId,user.token,langVal,currency))

    const genderOptions = [
        // {label: 'Payment In Cash', value: 'Payment In Cash'},
        {label: t('app.cash'), value: 'cash'},
        // {label: 'Visa', value: 'Visa'},
    ]

    const updateEnquiryRequestStatus = async () => {
        if (!requestStatus) {
            setUpdateErrorMessage(t('app.selectStatus'))
            return
        }
        if (!paymentType) {
            setUpdateErrorMessage(t('app.selectType'))
            return
        }
        if (requestStatus && paymentType) setUpdateErrorMessage('')
        setIsUpdating(true)
        const newEnquiryObject = {
            id: enquiryId,
            status:requestStatus,
            payment_method:paymentType
        }
        console.log(newEnquiryObject)
        await chaneEnquiryStatus(newEnquiryObject,user.token,langVal,currency)
            .then(r=>{
                setIsUpdating(false)
                refetchEnquiryDetails()
                dispatch(hideModalAction())
            })
            .catch(e=> {
                setUpdateErrorMessage(e.response.data.msg)
                setIsUpdating(false)
            })

    }
    if (isEnquiryDetailsLoading) return <div><LoadData/></div>
    
    return (
        <div className="mb-2">
            <div className="d-flex align-items-center justify-content-between my-2">
                <h6 className="m-0">{t('booking.name')}</h6>
                <span>{enquiryDetails.enquiry.merchant.name}</span>
            </div>
            {/*<div className="d-flex align-items-center justify-content-between my-2">*/}
            {/*    <h6 className="m-0">Phone : </h6>*/}
            {/*    <span>+971 524163789</span>*/}
            {/*</div>*/}
            {/*<div className="d-flex align-items-center justify-content-between my-2">*/}
            {/*    <h6 className="m-0">Email : </h6>*/}
            {/*    <span>rrr.aaa@gmail.com</span>*/}
            {/*</div>*/}
            {/*<div className="d-flex align-items-center justify-content-between my-2">*/}
            {/*    <h6 className="m-0">Merachant : </h6>*/}
            {/*    <span>Salon</span>*/}
            {/*</div>*/}
            <div className="d-flex align-items-center justify-content-between my-2">
                <h6 className="m-0">{t('booking.package')}</h6>
                <span>{enquiryDetails.enquiry.package.name}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between my-2">
                <h6 className="m-0">{t('booking.deliveryTime')}</h6>
                <span>{enquiryDetails.enquiry.package.delivery_time}</span>
            </div>
            <div className="d-flex align-items-center justify-content-between my-2">
                <h6 className="m-0">{t('booking.status')}</h6>
                <span className="text-warning">{enquiryDetails.enquiry.status_text}</span>
            </div>
            {(enquiryDetails.enquiry.status!=='accepted'&&enquiryDetails.enquiry.status!=='rejected') &&<>
                <div className="py-2 my-3 border-top border-bottom">

                    <h6 className="">{t('booking.chhangeStatus')}</h6>

                    <div className='my-2 d-flex align-items-center'>

                        <label className="check-box d-flex align-items-center mt-2">
                            <input type="radio" name="radio" onChange={e => setRequestStatus('accepted')}/>
                            <span className="checkmark"/>
                            <strong className='fw-light mx-2'>{t('app.accept')}</strong>
                        </label>

                        <label className="check-box d-flex align-items-center mt-2 mx-3">
                            <input type="radio" name="radio" onChange={e => setRequestStatus('rejected')}/>
                            <span className="checkmark"/>
                            <strong className='fw-light mx-2'>{t('app.reject')}</strong>
                        </label>

                    </div>

                </div>

                <div className="mb-3">
                    <label className='mb-2 fw-light'>{t('app.payment')}</label>
                    <div className={'select-add select-full'}>
                        <InputSelect
                            options={genderOptions}
                            placeholder={t('hotel.form.select')}
                            onChange={e => setPaymentType(e.value)}
                        />
                    </div>
                </div>
                <div className={'d-flex justify-content-center mb-2'}>
                    <button className={'btn-button bgMainColor text-white px-3 w-auto'}
                            onClick={updateEnquiryRequestStatus}>
                        {isUpdating
                            ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                            : <>{t('app.updateStatus')}</>
                        }
                    </button>
                </div>
                {updateErrorMessage && <div className={'text-center'}>
                    <small className={'text-center text-danger'}>{updateErrorMessage}</small>
                </div>}
            </>}

        </div>
    )

}