import {InputText} from "../../Inputs/InputText";
import Image from "next/image";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {InputSelect} from "../../Inputs/InputSelect";
import {useEffect, useState} from "react";
import {Map} from "../../Map";
import {hideModalAction, showModalAction} from "../../../redux-toolkit/actions";
import {ModalForm} from "../../ModalForms/ModalForm";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {
    addNewAddresses,
    editBookingRequest,
    getMyAddresses,
    sendBookingRequest
} from "../../../redux-toolkit/actions/axiosCalls";
import * as yup from "yup";
import {AddressListModalForm} from "../../ModalForms/AddressListModalForm";
import {useApi} from "../../../hooks/useApi";
import {ErrorModalForm} from "../../ModalForms/ErrorModalForm";
import {useRouter} from "next/router";

export const BookingForm = ({time,checkInDate,serviceGender,merchantId,voucherId,checkHasAdultsCount,defaultAddressId,defaultOrderId,checkOutDate='',checkVoucherType,checkAddressByVoucherType,serviceState,employeesState,voucherType,...props}) => {
    const { t }                                             = useTranslation();
    const dispatch                                          = useDispatch()
    const dateOptions                                       = { year: 'numeric', month: 'long', day: 'numeric' };
    const user                                              = useSelector((state) => state.user.user);
    const {location:defaultLocationSelector, default_address:defaultAddressState}   = useSelector((state) => state.location);
    const langVal                                           = useSelector((state) => state.language.language);
    const [selectedAddress,setSelectedAddress]              = useState(defaultAddressState);
    const router                                            = useRouter();
    const currency                                          = useSelector((state) => state.currency.currency);
    const [addressTitleState,setAddressTitleState] = useState('Default Address');
    const {
        data:addressData,
    } = useApi(()=> getMyAddresses(user.token,langVal,currency))

    useEffect(()=>{
        if (addressData){
            if (defaultAddressId){
                setSelectedAddress(addressData.addresses.find(add=> add.id === defaultAddressId))
                setAddressTitleState('Order Address')
            }
        }
    },[addressData])

    const [totalPrice,setTotalPrice] = useState(0)
    const [addressLocation,setAddressLocation] = useState()

    useEffect(()=>{
        setTotalPrice(serviceState.reduce((a,e) => a + parseFloat(e.price),0))
    },[serviceState,employeesState])

    const [addressMode,setAddressMode] = useState('default')
    const [buildingType,setBuildingType] = useState('apartment')
    const [notesState,setNotesState] = useState('')
    const [adultsCount,setAdultsCount] = useState(0)
    const [childrenCount,setChildrenCount] = useState(0)
    const [childrenChair,setChildrenChair] = useState(false)
    const [smokingArea,setSmokingArea] = useState(false)
    useEffect(()=>{
        setChildrenCount(0)
    },[childrenChair])

    //#region modal popups
    const cancellationPolicy = () => {
        dispatch(showModalAction(
        <ModalForm title={'cancellation policy'}>
            This is cancellation policy
        </ModalForm>))
    }
    const updateAddress = (address) => {
        setSelectedAddress(address);
        setAddressTitleState('Selected Address')
        dispatch(hideModalAction());
    }
    const addressBookList = () => {
        dispatch(showModalAction(
        <ModalForm title={t('boooking.addressBook')}>
            <AddressListModalForm addressData={addressData?.addresses} updateSelectedAddress={(address)=>updateAddress(address)}/>
        </ModalForm>))
    }
    const errorPopUp = (title,message,button=t('millionaire.lotto.pop_ups.error_popup.no_bundles.button')) => {
        dispatch(showModalAction(<ErrorModalForm
            title={title}
            message={message}
            buttonMessage={button}
        />))
    }
    //#endregion

    //#region check-in and check-out messages
    const [checkDateMsg,setCheckDateMsg] = useState({
        checkIn:"",
        checkOut:"",
    })
    const checkInCheckOutMsg = () => {
        switch (voucherType) {
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
    }
    useEffect(()=>{
        checkInCheckOutMsg()
    },[voucherType])
    //#endregion

    //#region yup validation schema
    let addressBook = yup.object().shape({
        building_name:yup.string().when([],{
            is: ()=> addressMode!=='default',
            then: yup.string().required('required'),
            otherwise: yup.string().notRequired()
        }),
        street:yup.string().when([],{
            is: ()=> addressMode!=='default',
            then: yup.string().required('required'),
            otherwise: yup.string().notRequired()
        }),
        apartment_number:yup.string().when([],{
            is: ()=> addressMode!=='default',
            then: yup.string().required('required'),
            otherwise: yup.string().notRequired()
        }),
        floor:yup.string().when([],{
            is: ()=> addressMode!=='default',
            then: yup.string().required('required'),
            otherwise: yup.string().notRequired()
        }),
        additional_directions:yup.string(),
    });
    //#endregion

    //#region form submit function
    const [bookingLoading,setBookingLoading] = useState(false)
    const [bookingErrorMessage,setBookingErrorMessage] = useState('')
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(addressBook),
    });
    const convertDate = date => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month}-${day}`;
    }
    const submitBooking = async (addressId) => {
        const bookingData = {
            merchant_id:merchantId,
            voucher_id:voucherId,
            date:convertDate(checkInDate),
            date_to: checkVoucherType()==='booking_type_2' ? convertDate(checkOutDate) : '',
            gender: (voucherType==='cleaner'||voucherType==='pest_control') ? serviceGender : undefined,
            time,
            table_option: voucherType==='table' ? 'dinner' : undefined,
            voucher_type:voucherType,
            adults_count: checkHasAdultsCount() ?adultsCount:undefined,
            children_count: checkHasAdultsCount() ?childrenCount:undefined,
            smooking_area: checkHasAdultsCount() ?smokingArea:undefined,
            children_chair: checkHasAdultsCount() ?childrenChair:undefined,
            notes: notesState,
            services:JSON.stringify(serviceState.map(service=> service.serviceId ? ({id:service.serviceId,price_id:service.id}) : ({id: service.id,price_id:0}))),
            employees:JSON.stringify(employeesState.map(employee => employee.id)),
            address_id:addressId
        };
        if (defaultOrderId) await editBookingRequest(user.token,langVal,currency,{...bookingData,order_id:defaultOrderId})
        else await sendBookingRequest(user.token,langVal,currency,bookingData)
    }
    const submitHandler = data => {
        if (serviceState.length === 0){
            errorPopUp(
                t('boooking.noSelected'),
                t('boooking.makeSure')
            )
            return
        }
        if (checkVoucherType()==='booking_type_3'){
            if (employeesState.length === 0) {
                errorPopUp(
                    t('boooking.NoEmSelected'),
                    t('boooking.makeSureEm')
                )
                return
            }
        }
        if (addressMode !== 'default') {
            if (!addressLocation.lat || !addressLocation.lng) {
                errorPopUp(
                    t('boooking.noLocation'),
                    t('boooking.makeSureLo')
                )
                return
            }
        }
        if (checkVoucherType()!=='booking_type_2'){
            if (!time) {
                errorPopUp(
                    t('boooking.noResSelected'),
                    t('boooking.makeSureRe')
                )
                return
            }
        }
        if (checkHasAdultsCount()) {
            if (adultsCount === 0) {
                errorPopUp(
                    t('boooking.adultsCount'),
                    t('boooking.makeSureSp')
                )
                return;
            }
            if (childrenChair && childrenCount===0){
                errorPopUp(
                    t('boooking.childrenCount'),
                    t('boooking.makeSureKid')
                )
                return;
            }
        }
        const addressData = {
            type: buildingType,
            building_name: data.building_name,
            street: data.street,
            apartment_number: data.apartment_number,
            floor: data.floor,
            is_default: defaultAddressState.id ? 0 : 1,
            lat: addressLocation?.lat||'',
            lng: addressLocation?.lng||'',
            map_desc: 'adad',
            additional_directions: data.additional_directions
        };
        if (addressMode !== 'default') {
            setBookingLoading(true);
            (async () => await addNewAddresses(user.token,langVal,currency,addressData))().then(r=> {
                submitBooking(r.data.id)
                    .then(()=>router.push(`booking-success?merchant_id=${merchantId}`))
                    .catch(e=> {
                        setBookingLoading(false)
                        setBookingErrorMessage(e.response.data.msg)
                    })
            });
        } else {
            setBookingLoading(true);
            submitBooking(selectedAddress.id)
                .then(()=>router.push(`booking-success?merchant_id=${merchantId}`))
                .catch(e=> {
                    setBookingLoading(false)
                    setBookingErrorMessage(e.response.data.msg)
                    console.table(e.response.data);
                })
        }
        // (async () => await addNewAddresses(user.token,langVal,currency,addressData))().then(r=> console.log(r))
    }
    //#endregion

    return (
        <div>
            <div className="p-4 rounded-3 old-shadow box-result my-5 mt-3 pt-1">
                <h4>{t('booking.Reserve.bookingRequest')}</h4>
                <div>{totalPrice > 0 && <h5>{currency} {employeesState.length > 0 ? totalPrice*employeesState.length : totalPrice}</h5>}</div>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard</p>
                <div className="d-flex align-items-center my-3 border-dotted pb-3">
                    {time && <h6 className="fw-light m-0 bgMainColor text-white w-auto p-3 rounded-1">TIME : {time}</h6>}
                    <h6 className="fw-light m-0 bgMainColor text-white w-auto p-3 rounded-1 mx-3">{checkDateMsg.checkIn} : {checkInDate.toLocaleDateString(undefined,dateOptions)}</h6>
                    {checkVoucherType()==='booking_type_2' && <h6 className="fw-light m-0 bgMainColor text-white w-auto p-3 rounded-1 mx-3">{checkDateMsg.checkOut} : {checkOutDate.toLocaleDateString(undefined,dateOptions)}</h6>}
                </div>
                <div className="my-4 border-dotted">
                    <div className="row mt-4">
                        {checkHasAdultsCount() && <>
                            <div className={`${childrenChair ? 'col-md-6' : 'col-md-12'} col-md-6 col-xs-12 mb-4 select-ponier`}>
                                <InputSelect
                                    onChange={e => setAdultsCount(e.value)}
                                    label={'Adults Count'}
                                    options={[...Array(10).keys()].slice(1).map(entry => ({label:entry,value:entry}))}
                                />
                            </div>
                            {childrenChair && !smokingArea && <div className="col-md-6 col-xs-12 mb-4 select-ponier">
                                <InputSelect
                                    onChange={e => setChildrenCount(e.value)}
                                    label={'Children Count'}
                                    options={[...Array(10).keys()].slice(1).map(entry => ({
                                        label: entry,
                                        value: entry
                                    }))}
                                />
                            </div>}
                            <div className={'col-md-6 col-xs-12 mb-4 td_radio_select d-flex align-items-center'}>
                                <label htmlFor={'smoking'}
                                       className={'fs-6 w-100'}>{'smoking area'}</label>
                                <input type={"checkbox"} id={'smoking'} name={'smoking'}
                                       value={'smoking'}
                                       onChange={(e)=> {
                                           if (childrenChair) {
                                               errorPopUp(
                                                   'Children present',
                                                   "You can't smoke in the presence of children"
                                               )
                                               e.target.checked = false;
                                               e.preventDefault()
                                               e.stopPropagation()
                                           } else setSmokingArea(!smokingArea)

                                       }}
                                />
                            </div>
                            <div className={'col-md-6 col-xs-12 mb-4 td_radio_select d-flex align-items-center'}>
                                <label htmlFor={'children_chair'}
                                       className={'fs-6 w-100'}>{'children chair'}</label>
                                <input type={"checkbox"} id={'children_chair'} name={'children_chair'}
                                       value={'children_chair'}
                                       onChange={(e)=> {
                                           if (smokingArea) {
                                               errorPopUp(
                                                   'Smoking Selected',
                                                   "You can't bring children to smoking area"
                                               )
                                               e.target.checked = false;
                                               e.preventDefault()
                                               e.stopPropagation()
                                           } else setChildrenChair(!childrenChair)
                                       }}
                                />
                            </div>
                        </>}
                        <div className="col-md-12 col-xs-12 mb-4">
                            <InputText label={t('favouritesProfile.name')} placeholder={user.full_name} disabled/>
                        </div>
                        <div className="col-md-6 col-xs-12 mb-4">
                            <InputText label={t('booking.Reserve.email')} placeholder={user.email} disabled/>
                        </div>
                        <div className="col-md-6 col-xs-12 mb-4">
                            <InputText label={t('booking.Reserve.phone')} placeholder={`+${user.full_phone}`} disabled/>
                        </div>
                        <div className="col-md-12 col-xs-12 mb-4">
                            <label className="fw-light mb-2">{t('booking.Reserve.additionalNote')}</label>
                            <textarea onChange={e=>setNotesState(e.target.value)} maxLength={250}/>
                        </div>
                    </div>
                    {checkAddressByVoucherType() &&
                        <>
                            <h4>{t('booking.Reserve.addressDetails')}</h4>
                            {defaultAddressState.id && <div className="td_booking_form_default_address p-2 mb-3"
                                  onClick={() => setAddressMode('default')}>
                                <div className="td_title d-flex justify-content-between align-items-center">
                                    <h5 className={'td_default_address fs-5'}>{addressTitleState}</h5>
                                    <div className={`td_rounded_radio ${addressMode === 'default' && 'td_selected_radio'}`}/>
                                </div>
                                {addressMode === 'default' && <>
                                    <div className="td_address_wrapper d-flex align-items-start mb-2">
                                        <h5 className="td_address_wrapper_title m-0 fw-light">{t('booking.name')}</h5>
                                        <span className="td_address_wrapper_desc">{user.first_name}</span>
                                    </div>
                                    <div className="td_address_wrapper d-flex align-items-start mb-2">
                                        <h5 className="td_address_wrapper_title m-0 fw-light">{t('booking.address')}</h5>
                                        <div className="td_address_wrapper_desc d-flex">
                                            <span className={'me-2'}>{selectedAddress.building_name},</span>
                                            <span className={'me-2'}>{selectedAddress.apartment_number},</span>
                                            <span className={'me-2'}>{selectedAddress.floor}...</span>
                                        </div>
                                    </div>
                                    <div className="td_address_wrapper d-flex align-items-start mb-2">
                                        <h5 className="td_address_wrapper_title m-0 fw-light">{t('booking.phone')}</h5>
                                        <span className="td_address_wrapper_desc">+{user.full_phone}</span>
                                    </div>
                                </>}
                            </div>
                            }
                            {addressData?.addresses.length > 0 && <button
                                className={`btn-button w-100 px-4 mb-3 border-main border-5 bg-transparent`}
                                onClick={addressBookList}>
                                Select From Address book
                            </button>}
                            <button
                                className={`btn-button w-100 px-4 mb-3 border-main border-5 bg-transparent ${addressMode==='new_address'&& 'bgMainColor text-white'}`}
                                onClick={()=>setAddressMode('new_address')}>
                                    {t('booking.addAddress')}
                            </button>
                                {addressMode==='new_address' && <form className="td_booking_form_new_address_wrapper" id={'booking-form-id'} onSubmit={handleSubmit(submitHandler)}>
                                <div className="td_bld_type d-flex align-items-center justify-content-between mb-4">
                                    <div onClick={()=> setBuildingType('apartment')} className={`d-flex align-items-center flex-column justify-content-center ${buildingType==='apartment' && 'td_bld_selected'}`}>
                                        <span className="icon-apartment fs-3 my-2" />
                                        <p className="m-0">{t('booking.apartment')}</p>
                                    </div>
                                    <div onClick={()=> setBuildingType('house')} className={`d-flex align-items-center flex-column justify-content-center ${buildingType==='house' && 'td_bld_selected'}`}>
                                        <span className="icon-home-m fs-3 my-2" />
                                        <p className="m-0">{t('booking.house')}</p>
                                    </div>
                                    <div onClick={()=> setBuildingType('office')} className={`d-flex align-items-center flex-column justify-content-center ${buildingType==='office' && 'td_bld_selected'}`}>
                                        <span className="icon-office fs-3 my-2" />
                                        <p className="m-0">{t('booking.office')}</p>
                                    </div>
                                </div>
                                <div className="td_new_address_details mb-3">
                                    <div className="row">
                                        <div className="col-6 mb-2">
                                            <InputText label={'Building Name'} errorMessage={errors.building_name?.message} {...register('building_name')}/>
                                        </div>
                                        <div className="col-6 mb-2">
                                            <InputText label={'Street'} errorMessage={errors.street?.message} {...register('street')}/>
                                        </div>
                                        <div className="col-6 mb-2">
                                            <InputText label={'Apartment No.'} errorMessage={errors.apartment_number?.message} {...register('apartment_number')}/>
                                        </div>
                                        <div className="col-6 mb-2">
                                            <InputText label={'Floor'}errorMessage={errors.floor?.message} {...register('floor')} />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="">{t('booking.additionalDir')}</label>
                                            <textarea label={'Additional Directions (Optional)'} {...register('additional_directions')} />
                                        </div>
                                    </div>
                                </div>
                                <div className="td_new_address_map">
                                    <div className="map_title d-flex align-items-center mb-2 fs-5">
                                        <span className={'me-2 icon-map-pin'}/>
                                        <div>{t('booking.selectMap')}</div>
                                    </div>
                                    <div className="td_map_wrapper">
                                        <Map
                                            setAddressLocation={setAddressLocation}
                                            defaultCenter={defaultLocationSelector.lat ? {lat:defaultLocationSelector.lat,lng:defaultLocationSelector.long} : undefined}
                                            defaultMarkerPosition={defaultLocationSelector.lat ? {lat:defaultLocationSelector.lat,lng:defaultLocationSelector.long} : undefined}
                                        />
                                    </div>
                                </div>
                            </form>}
                        </>
                    }


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
                    onClick={handleSubmit(submitHandler)}
                    type={'submit'}
                    form={'booking-form-id'}
                    className={'bgMainColor btn-button text-white w-auto my-4 d-table m-auto px-4'}
                >
                    {bookingLoading
                        ? <span className={'spinner-border spinner-border-sm text-white'}/>
                        : <>{t("booking.Reserve.sendBooKing")}</>
                    }
                </button>
                <div className={'text-center text-danger'}>{bookingErrorMessage}</div>
            </div>
        </div>
    )
}