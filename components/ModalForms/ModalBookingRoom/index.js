import {useState} from "react";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Toastify from 'toastify-js';
import {InputSelect} from "../../Inputs/InputSelect";
import { InputText } from "../../Inputs/InputText";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {getCode} from 'country-list'
import {useApi} from "../../../hooks/useApi";
import {getAllCountries, sendIllusionHotelBooking} from "../../../redux-toolkit/actions/axiosCalls";

export const ModalBookingRoom = ({contract,startDate,endDate}) => {
    const { t }                                             = useTranslation();
    const langVal                                           = useSelector((state) => state.language.language);
    const user                                              = useSelector((state) => state.user.user);
    const currency                                          = useSelector((state) => state.currency.currency);
    const [errorMessage,setErrorMessage]                    = useState('')
    const [isSubmitting,setIsSubmitting]                    = useState(false)

    // const [fields, setFields]                           = useState([<></>]);

    //#region countries
    const {
        data:countriesData,
        isLoading:isCountriesLoading,
    } = useApi(()=> getAllCountries(user.token,langVal,currency))
    //#endregion

    //#region schema validations
    let passengersSchema = {
        passenger: yup.object().shape({
            passengerTitle: yup.mixed().notOneOf([null,''], "title required").required('title required'),
            firstName: yup.string().required('name required').min(3,'At least 3 characters'),
            lastName: yup.string().required('name required').min(3,'At least 3 characters'),
            passengerType: yup.mixed().notOneOf([null,''], "type required").required('type required'),
            passengerNationality: yup.mixed().notOneOf([null,''], "Nationality required").required('Nationality required'),
            passengerGender: yup.mixed().notOneOf([null,''], "Gender required").required('Gender required'),
            passengerAge: yup.string().matches(/^([1-9][0-9]+|[1-9])$/gm,'positive integers only').max(2,'max age').required('age required'),
        }),
    }
    let bookingPartySchema = yup.object().shape({
        partyName: yup.string().required('party name is required').min(3,'At least 3 characters'),
        paymentType: yup.mixed().notOneOf([null,''], "payment type required").required('payment type required'),
        passengers: yup.array().of(yup.object().shape(passengersSchema)),
    })
    //#endregion

    //#region form hook
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(bookingPartySchema)
    });
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "passengers", // unique name for your Field Array
        rules: {minLength:1,maxLength:5}
    });
    //#endregion

    //#region select options
    const genderOptions = [
        {label: 'Male', value: 'Male'},
        {label: 'Female', value: 'Female'},
    ]
    const typeOptions = [
        {label: 'Adult', value: 'Adult'},
        {label: 'Child', value: 'Child'},
    ]
    const titleOptions = [
        {label: 'Mr', value: 'Mr'},
        {label: 'Mrs', value: 'Mrs'},
        {label: 'Miss', value: 'Miss'},
        {label: 'Ms', value: 'Ms'},
    ]
    const paymentOptions = [
        {label: 'TD Wallet', value: 'wallet'},
        {label: 'TD Coins', value: 'coins'},
    ]
    //#endregion

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month < 10 ? ('0' + month) : month}-${day < 10 ? ('0' + day) : day}`;
    }
    const formatDateIllusion = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return Number(`${year}${month < 10 ? ('0' + month) : month}${day < 10 ? ('0' + day) : day}`);
    }
    const makeAgencyRef = () => {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < 8) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    const addNewField = () => {
        console.log(contract)
        if(fields.length < contract.maxPassengers){
            // setFields(fields.concat(<></>));
            append({}, {})

        }else{
            Toastify({
                text: t('hotel.form.sorryNoMoreAdd'),
                duration: 3000,
                gravity: "top",
                position: langVal === 'en' ? "left" : "right",
                style: {
                  background: "#F00",
                }
            }).showToast();
        }
    }

    const submitHandler = data => {
        setIsSubmitting(true)
        setErrorMessage('')
        console.log('data',data);
        let oldHotelObj = {
            "OutputFormat": "JSON",
            "HotelBookingRequest": {
                "Profile": {
                    "password": "Tr!3@sUrEDe@L2023",
                    "code": "TreasureDealQR",
                    "tokenNumber": "0ccd04b3-3bf2-4680-a64e-6a894316a1d2"
                },
                "PassengerDetails": {
                    "Passenger": data.passengers.map((passenger,idx) => ({
                        "PaxNumber": idx+1,
                        "RoomNo": 1,
                        "Title": passenger.passenger.passengerTitle,
                        "PassengerType": passenger.passenger.passengerType === 'Adult' ? 'ADT' : 'CHLD',
                        "Age": parseInt(passenger.passenger.passengerAge),
                        "FirstName": passenger.passenger.firstName,
                        "LastName": passenger.passenger.lastName,
                        "Nationality": getCode(passenger.passenger.passengerNationality === 'Aland Islands' ? 'Åland Islands' : passenger.passenger.passengerNationality),
                        "Gender": passenger.passenger.passengerGender === 'Male' ? "M" : "F"
                    }))
                },
                "HotelDetails": {
                    "StartDate": formatDateIllusion(startDate),
                    "EndDate": formatDateIllusion(endDate),
                    "HotelCode": contract.hotelCode,
                    "CityCode": contract.hotelCityCode,
                    "PartyName": data.partyName,
                    "AgencyRef": makeAgencyRef(),
                    "RoomDetails": {
                        "Room": {
                            "MealPlanCode": contract.MealPlanCodeLong,
                            "RoomTypeCode": contract.RoomTypeCode,
                            "ContractTokenId": contract.ContractTokenId,
                            "Rate": contract.TotalRate,
                            "RoomConfigurationId": contract.RoomConfigurationId
                        }
                    },
                }
            }
        }
        let hotelBookingObj = {
            "profile":
                {
                    "password": "Tr!3@sUrEDe@L2023",
                    "code": "TreasureDealQR",
                    "tokenNumber": "0ccd04b3-3bf2-4680-a64e-6a894316a1d2"
                },
            "passengers": data.passengers.map((passenger,idx) => ({
                "PaxNumber": idx+1,
                "RoomNo": 1,
                "Title": passenger.passenger.passengerTitle,
                "PassengerType": passenger.passenger.passengerType === 'Adult' ? 'ADT' : 'CHILD',
                "Age": parseInt(passenger.passenger.passengerAge),
                "FirstName": passenger.passenger.firstName,
                "LastName": passenger.passenger.lastName,
                "Nationality": getCode(passenger.passenger.passengerNationality === 'Aland Islands' ? 'Åland Islands' : passenger.passenger.passengerNationality),
                "Gender": passenger.passenger.passengerGender === 'Male' ? "M" : "F"
            })),
            "hotelDetails":{
                "startDate":formatDateIllusion(startDate),
                "endDate":formatDateIllusion(endDate),
                "HotelCode": contract.hotelCode,
                "CityCode": contract.hotelCityCode,
                "PartyName": data.partyName,
                "agencyRef":makeAgencyRef(),
                "roomDetails":{
                    "room":[
                        {
                            "MealPlanCode": contract.MealPlanCodeLong,
                            "RoomTypeCode": contract.RoomTypeCode,
                            "ContractTokenId": contract.ContractTokenId,
                            "Rate": contract.TotalRate,
                            "RoomConfigurationId": contract.RoomConfigurationId,
                            "currencyCode": contract.CurrCode,
                        }
                    ]
                }
            }
        }

        const bookingObject = {
            date:formatDate(startDate),
            date_to:formatDate(endDate),
            amount:contract.TotalRate,
            pay_type:data.paymentType,
            illusion_json: JSON.stringify(hotelBookingObj)
        };
        (async () => await sendIllusionHotelBooking(user.token,langVal,currency,bookingObject))()
            .then(r=> {
                console.log(r)
                setIsSubmitting(false)
            })
            .catch(e=> {
                setErrorMessage(e.response?.data?.msg)
                setIsSubmitting(false)
            })
    }

    return (
        <form className="" onSubmit={handleSubmit(submitHandler)}>
            <div className="row mb-3">
                <div className="col-6 col-xs-12">
                    <label className='fw-light mb-2 small-font-13'>{t('hotel.form.partyName')}</label>
                    <InputText
                        className='small-font-13 px-2 border'
                        {...register('partyName')}
                        errorMessage={errors.partyName?.message}
                    />
                </div>
                <div className="col-6 col-xs-12">
                    <label className='fw-light mb-2 small-font-13'>{t('hotel.form.payMethod')}</label>
                    {/*<InputText className='small-font-13 px-2 border'/>*/}
                    <div className="select-add select-full">
                        <Controller
                            control={control}
                            defaultValue={''}
                            name='paymentType'
                            render={({field,value,ref}) =>
                                <InputSelect
                                    {...field}
                                    // placeholder={t('login.country_selector_placeholder')}
                                    error={errors.paymentType}
                                    // errorMessage={errors.paymentType?.message}
                                    inputRef={ref}
                                    value={paymentOptions.find(c => c.value === value)}
                                    onChange={val => field.onChange(val.value)}
                                    options={paymentOptions}
                                />
                            }
                        />
                    </div>
                    {errors.paymentType?.message && <small className='text-danger'>{errors.paymentType?.message}</small>}
                </div>
            </div>
            {fields.length<1&&addNewField()}
            {
                fields.map((fieldObj, idx) => (
                    <div key={fieldObj.id} className='row'>
                        <div className="col col-xs-12 mb-3">
                            <label className='fw-light mb-2 small-font-13'>{t('hotel.form.passengerTitle')}</label>
                            {/*<InputText*/}
                            {/*    className='small-font-13 px-2 border'*/}
                            {/*    {...register(`passengers.${idx}.passenger.passengerTitle`)}*/}
                            {/*    errorMessage={errors && errors.passengers && errors.passengers.length > 0 && errors.passengers[idx]?.passenger?.passengerTitle?.message}*/}
                            {/*/>*/}
                            <div className="select-add select-full">
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name={`passengers.${idx}.passenger.passengerTitle`}
                                    render={({field,value,ref}) =>
                                        <InputSelect
                                            {...field}
                                            // placeholder={t('login.country_selector_placeholder')}
                                            // error={errors.paymentType}
                                            // errorMessage={errors.paymentType?.message}
                                            // errorMessage={errors && errors.passengers && errors.passengers.length > 0 && errors.passengers[idx]?.passenger?.passengerTitle?.message}
                                            inputRef={ref}
                                            value={titleOptions.find(c => c.value === value)}
                                            onChange={val => field.onChange(val.value)}
                                            options={titleOptions}
                                        />
                                    }
                                />
                            </div>
                            {errors && errors.passengers && errors.passengers.length > 0 && errors.passengers[idx]?.passenger?.passengerTitle?.message && <small className='text-danger'>{errors.passengers[idx]?.passenger?.passengerTitle?.message}</small>}
                        </div>
                        <div className="col col-xs-12 mb-3">
                            <label className='fw-light mb-2 small-font-13'>{t('hotel.form.firstName')}</label>
                            <InputText
                                className='small-font-13 px-2 border'
                                {...register(`passengers.${idx}.passenger.firstName`)}
                                errorMessage={errors && errors.passengers && errors.passengers.length > 0 && errors.passengers[idx]?.passenger?.firstName?.message}
                            />
                        </div>
                        <div className="col col-xs-12 mb-3">
                            <label className='fw-light mb-2 small-font-13'>{t('hotel.form.lastName')}</label>
                            <InputText
                                className='small-font-13 px-2 border'
                                {...register(`passengers.${idx}.passenger.lastName`)}
                                errorMessage={errors && errors.passengers && errors.passengers.length > 0 && errors.passengers[idx]?.passenger?.lastName?.message}
                            />
                        </div>
                        <div className="col col-xs-12 mb-3">
                            <label className='fw-light mb-2 small-font-13'>{t('hotel.form.passengerType')}</label>
                            {/*<InputText className='small-font-13 px-2 border'/>*/}
                            <div className="select-add select-full">
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name={`passengers.${idx}.passenger.passengerType`}
                                    render={({field,value,ref}) =>
                                        <InputSelect
                                            {...field}
                                            // placeholder={t('login.country_selector_placeholder')}
                                            // error={errors.paymentType}
                                            // errorMessage={errors.paymentType?.message}
                                            // errorMessage={errors && errors.passengers && errors.passengers.length > 0 && errors.passengers[idx]?.passenger?.passengerTitle?.message}
                                            inputRef={ref}
                                            value={typeOptions.find(c => c.value === value)}
                                            onChange={val => field.onChange(val.value)}
                                            options={typeOptions}
                                        />
                                    }
                                />
                            </div>
                            {errors && errors.passengers && errors.passengers.length > 0 && errors.passengers[idx]?.passenger?.passengerTitle?.message && <small className='text-danger'>{errors.passengers[idx]?.passenger?.passengerTitle?.message}</small>}
                        </div>
                        <div className="col col-xs-12 mb-3">
                            <label className='fw-light mb-2 small-font-13'>{t('hotel.form.gender')}</label>
                            {/*<div className="select-add">*/}
                            {/*    <InputSelect*/}
                            {/*        placeholder={t('hotel.form.select')}*/}
                            {/*        options={genderOptions}*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <div className="select-add select-full">
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name={`passengers.${idx}.passenger.passengerGender`}
                                    render={({field,value,ref}) =>
                                        <InputSelect
                                            {...field}
                                            // placeholder={t('login.country_selector_placeholder')}
                                            // error={errors.paymentType}
                                            // errorMessage={errors.paymentType?.message}
                                            // errorMessage={errors && errors.passengers && errors.passengers.length > 0 && errors.passengers[idx]?.passenger?.passengerGender?.message}
                                            inputRef={ref}
                                            value={genderOptions.find(c => c.value === value)}
                                            onChange={val => field.onChange(val.value)}
                                            options={genderOptions}
                                        />
                                    }
                                />
                            </div>
                            {errors && errors.passengers && errors.passengers.length > 0 && errors.passengers[idx]?.passenger?.passengerGender?.message && <small className='text-danger'>{errors.passengers[idx]?.passenger?.passengerGender?.message}</small>}
                        </div>
                        <div className="col col-xs-12 mb-3">
                            <label className='fw-light mb-2 small-font-13'>{t('hotel.form.age')}</label>
                            <InputText
                                className='small-font-13 px-2 border'
                                defaultValue={25}
                                type={'number'}
                                {...register(`passengers.${idx}.passenger.passengerAge`)}
                                errorMessage={errors && errors.passengers && errors.passengers.length > 0 && errors.passengers[idx]?.passenger?.passengerAge?.message}
                            />
                        </div>
                        <div className="col col-xs-12 mb-3">
                            <label className='fw-light mb-2 small-font-13'>{t('hotel.form.nationality')}</label>
                            {/*<InputText className='small-font-13 px-2 border'/>*/}
                            <div className="select-add select-full">
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name={`passengers.${idx}.passenger.passengerNationality`}
                                    render={({field,value,ref}) =>
                                        <InputSelect
                                            {...field}
                                            // placeholder={t('login.country_selector_placeholder')}
                                            // error={errors.paymentType}
                                            // errorMessage={errors.paymentType?.message}
                                            // errorMessage={errors && errors.passengers && errors.passengers.length > 0 && errors.passengers[idx]?.passenger?.passengerNationality?.message}
                                            inputRef={ref}
                                            value={countriesData?.countries?.find(c => c.name === value)}
                                            onChange={val => field.onChange(val.label)}
                                            options={countriesData?.countries?.map(country => ({label:country.name,value:country.id}))}
                                        />
                                    }
                                />
                            </div>
                            {errors && errors.passengers && errors.passengers.length > 0 && errors.passengers[idx]?.passenger?.passengerNationality?.message && <small className='text-danger'>{errors.passengers[idx]?.passenger?.passengerNationality?.message}</small>}
                        </div>
                        {fields.length > 1 &&
                            <div className="col-md-1 col-xs-12 d-flex align-items-center justify-content-center">
                                <button onClick={()=>remove(idx)} className={'icon-bin bg-danger btn-circle text-white d-table m-auto rounded-circle'}/>
                            </div>
                        }
                    </div>
                ))
            }
            {errorMessage && <h6 className={'text-center text-danger'}>{errorMessage}</h6>}
            <div className="d-flex align-items-center justify-content-center">
                <button type={'submit'} className={'bgMainColor btn-button text-white w-auto me-3 my-4 d-table px-4'}>
                    {isSubmitting
                        ? <span className={'spinner-border spinner-border-sm text-white'}/>
                        : <>{t('hotel.form.submit')}</>
                    }
                </button>
                <button type={'button'} onClick={()=> addNewField()} className={'bgMainColor btn-button text-white w-auto my-4 d-table px-4'}>
                    {t('hotel.form.addNewField')}
                </button>
            </div>
        </form>
    )
}