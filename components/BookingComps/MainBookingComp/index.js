import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {InputText} from "../../Inputs/InputText";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import Image from 'next/image';
import {useDispatch, useSelector} from "react-redux";
import {showModalAction} from "../../../redux-toolkit/actions";
import {ModalForm} from "../../ModalForms/ModalForm";
import {checkDateAvailability} from "../../../redux-toolkit/actions/axiosCalls";
import {useRouter} from "next/router";
import {InputSelect} from "../../Inputs/InputSelect";
import {PersonBookingComp} from "../PersonBookingComp";
import {BookingServices} from "../BookingServices";
import {BookingForm} from "../BookingForm";
import {CarBookingComp} from "../CarBookingComp";
import {LoadData} from "../../index";
import {BookingGender} from "../BookingGender";

export const MainBookingComp = ({goBack,defaultOrder,voucherId,merchantId='',merchantServices,refetchMerchantService,servicesLoading,merchantShift={from:'7:00',to:'20:00'},voucherType,...props}) => {
    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch();
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);
    const router                                        = useRouter();
    const [showBooking,setShowBooking]                  = useState(false)
    const {merchant_id} = router.query
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    //#region set services and employees
    const [serviceState,setServiceState] = useState([])
    const [employeesState,setEmployeesState] = useState([])

    const addEmployee = (person) => {
        setEmployeesState(prevState =>
            prevState.find(state=> state.id === person.id)
                ? prevState.filter(state => state.id!==person.id)
                : [...prevState,{id:person.id,name:person.name}]

        )
    }
    const addServiceHandler = (c) => {
        if (checkIsRadio()) {
            setServiceState([{id:c.id,price:c.price}])
        }
        else {
            if (voucherType==='limousine'||voucherType==='cleaner'){
                setServiceState(prevState => {
                    if (c.id === 0) return prevState.filter(state => state.serviceId!==c.serviceId)
                    return prevState.find(state => state.serviceId === c.serviceId)
                        ? prevState.filter(state => state.serviceId!==c.serviceId).concat({serviceId:c.serviceId,id:c.id,price:c.price})
                        : [...prevState,{serviceId:c.serviceId,id:c.id,price:c.price}]
                }

                )
            }
            else{
                setServiceState(prevState =>
                    prevState.find(state=> state.id === c.id)
                        ? prevState.filter(state => state.id!==c.id)
                        : [...prevState,{id:c.id,price:c.price}]
                )
            }
        }
    }
    //#endregion

    //#region check voucher type
    // table | room | car | yacht | doctor | salon | cleaner | pest_control | skydive | therapist | driver
    const checkVoucherType = () => {
        switch (voucherType) {
            case 'table':
            case 'doctor':
            case 'yacht':
            case 'skydive':
            case 'pest_control':
                return 'booking_type_1';
            case 'car':
            case 'room':
                return 'booking_type_2';
            case 'salon':
            case 'spa_therapist':
            case 'cleaner':
            case 'driver':
                return 'booking_type_3';
            case 'limousine':
                return 'booking_type_4';
        }
    }
    const checkAddressByVoucherType = () => {
        switch (voucherType) {
            case 'cleaner':
            case 'driver':
            case 'pest_control':
            case 'limousine':
                return true;
            default:
                return false;
        }
    }
    const checkHasAdultsCount = () => {
        switch (voucherType) {
            case 'table':
            // case 'room':
                return true;
            default:
                return false;
        }
    }
    useEffect(()=>{
        if (checkVoucherType()==='booking_type_2') setShowBooking(true)
        // if (checkVoucherType()==='booking_type_4') setShowBooking(true)
    },[])
    // useEffect(()=>{
    //     if (defaultOrder){
    //         // if (defaultOrder.time){
    //         //     setShowBooking(true)
    //         // }
    //     }
    // },[defaultOrder])
    //#endregion

    //#region check services radio or checkbox
    const checkIsRadio = () => {
        switch (voucherType) {
            case 'driver':
            case 'spa_therapist':
            case 'cleaner':
                return true;
            default:
                return false;
        }
    }
    //#endregion.

    //#region separate shift to timings
    const getTimeIntervals = (shiftStart,shiftEnd,interval=15) => {
        let startTime = parseInt(shiftStart.split(':')[0])*60;
        let endTime = parseInt(shiftEnd.split(':')[0])*60;
        if (endTime < startTime || endTime === startTime) {
            endTime = endTime + (60*24)
        }
        let ap = ['AM', 'PM'];
        let times = []
        for (let i=0; startTime<endTime; i++) {
            let hh = Math.floor(startTime/60); // getting hours of day in 0-24 format
            let mm = (startTime%60); // getting minutes of the hour in 0-55 format
            //#region old pm and am time format code block
            // times[i] =(hh!==12 ? ("0" + (hh % 12)).slice(-2) : 12 )+ ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
            //#endregion
            times[i] =(hh < 10 ? ("0" + hh) : (hh===24 ? '00' : hh) )+ ':' + ("0" + mm).slice(-2); // pushing data in array in [00:00 - 24:00 AM/PM format]
            startTime = startTime + interval;
        }
        return times
    }
    //#endregion

    //#region date state
    // const defaultDateStart = new Date(defaultOrder?.date||'')
    // const defaultDateEnd = new Date(defaultOrder?.date_to||'')
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    // const [dateStart, setDateStart] = useState(defaultOrder ? defaultDateStart : today)
    // const [dateEnd, setDateEnd] = useState(defaultOrder ? defaultDateEnd : tomorrow)
    const [dateStart, setDateStart] = useState(today)
    const [dateEnd, setDateEnd] = useState(tomorrow)
    //#endregion

    //#region calendar and time state
    const [showCalendar,setShowCalendar] = useState(false)
    const [availabilityLoading,setAvailabilityLoading] = useState(false)
    const [selectedTime,setSelectedTime] = useState(defaultOrder ? defaultOrder.time : '')
    const [timingsArray,setTimingsArray] = useState([])
    //#endregion

    //#region Remove Time Duplicates
    const removeDuplicatesAndSort = (arr) => [...new Set(arr)].sort()
    //#endregion

    //#region check availability of date and/or time
    const convertDate = date => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month}-${day}`;
    }
    const checkAvailability = () => {
        setAvailabilityLoading(true)

        const availabilityData = {
            merchant_id: merchantId ? merchantId : merchant_id,
            date: convertDate(dateStart),
        };

        (async () => await checkDateAvailability(user.token,langVal,currency,availabilityData))()
            .then(r=> {
                if (r.timings.length > 0)
                    r.timings.map(time => setTimingsArray(prevState => removeDuplicatesAndSort([...prevState, ...getTimeIntervals(time.from, time.to)])))
                else setTimingsArray([])
                setAvailabilityLoading(false)
            })
            .catch(e=> setAvailabilityLoading(false))
    }

    useEffect(()=>{
        if (checkVoucherType() !== 'booking_type_2') {
            checkAvailability()
        }
    },[dateStart])
    //#endregion

    //#region cars and rooms array
    useEffect(()=>{
        console.log(convertDate(dateStart));;
    },[dateStart])
    //#endregion

    return (
        <div className={'td_booking_comp'}>
            <div className="td_booking_comp_header">
                <div className={'my-5 border-dotted d-flex align-items-center justify-content-between pb-3'}>
                    <h4 className="fw-light m-0">Book {voucherType.split('_').join(' ')}</h4>
                    {goBack && <button className={'bgMainColor btn-button text-white w-auto px-4'} onClick={goBack}>{t("booking.Reserve.return")}</button>}
                </div>
            </div>

            <div className="">
                {checkVoucherType()==='booking_type_3' &&  <div className={'td_employee_services_wrapper'}>
                    {merchantServices?.services && merchantServices.services.length > 0 &&
                        <BookingServices
                            genderOptions={(voucherType==='cleaner'||voucherType==='pest_control')}
                            isServicesLoading={servicesLoading}
                            isRadio={checkIsRadio()}
                            services={merchantServices.services}
                            setSelectedServices={addServiceHandler}
                            voucherType={voucherType}
                        />
                    }
                </div>}
                {(voucherType==='cleaner'||voucherType==='pest_control') && <BookingGender />}
                <div className="td_booking_comp_availability mb-5">
                    <div className="row">
                        <div className="col-6 mb-4">
                            <h5>
                                {t("booking.Reserve.availability")}
                            </h5>
                        </div>
                        {timingsArray.length > 0 && <div className="col-6">
                            <h5>{t('booking.selectTime')}</h5>
                        </div>}
                    </div>
                    <div className="row align-items-start">
                        <div className="td_booking_comp_availability_wrapper position-relative col-md-6 col-xs-12">
                            <div className={'td_input_date d-flex align-items-center justify-content-between px-3'}>
                                <div className="td_date">
                                    {checkVoucherType()==='booking_type_2'
                                        ? <>From: {dateStart.toLocaleDateString(undefined,options)} &nbsp; To: {dateEnd.toLocaleDateString(undefined,options)}</>
                                        : <>{dateStart.toLocaleDateString(undefined,options)}</>
                                    }

                                </div>
                                <div className="td_date_open"><button onClick={()=>setShowCalendar(!showCalendar)} className='bg-transparent icon-date fs-4' /></div>
                            </div>
                            {showCalendar && <div className="td_calendar calendar-booking">
                                <Calendar
                                    next2Label={null}
                                    prev2Label={null}
                                    minDetail={'month'}
                                    selectRange={checkVoucherType()==='booking_type_2'}
                                    onChange={(e)=>{
                                        if (checkVoucherType()==='booking_type_2'){
                                            setDateStart(e[0])
                                            setDateEnd(e[1])
                                            setSelectedTime('')
                                        }else {
                                            setDateStart(e)
                                            setSelectedTime('')
                                        }
                                        // setShowCalendar(false)
                                    }}
                                    value={
                                        checkVoucherType()==='booking_type_2'
                                            ? [dateStart,dateEnd]
                                            : dateStart
                                    }
                                />
                            </div>}
                        </div>
                        <div className={'col-md-6 col-xs-12'}>
                            {checkVoucherType() !== 'booking_type_2' &&
                                (availabilityLoading
                                        ? <div className="select-ponier d-flex align-items-center justify-content-center">
                                            <span className={'spinner-border spinner-border-sm mainColor fs-6'}/>
                                        </div>
                                        : (timingsArray.length > 0
                                            ? 
                                            <div className="select-ponier">
                                                <InputSelect
                                                    isLoading={availabilityLoading}
                                                    onChange={e => {
                                                        setSelectedTime(e.value)
                                                        setShowBooking(true)
                                                    }}
                                                    options={timingsArray.map(time => ({label: time, value: time}))}
                                                    // defaultValue={defaultOrder ? {label:defaultOrder.time,value:defaultOrder.time} : undefined}
                                                />
                                            </div>
                                            :
                                            <div className={'position-relative text-center d-flex align-items-center justify-content-center'}>
                                                <h4 className="text-danger mt-0">{t('booking.closed')}</h4>
                                            </div>
                                            )
                                )

                            }
                        </div>
                    </div>
                    {showBooking && <div className="row">
                        <div className="col-6">
                            {servicesLoading
                                ? <div className={'modal-height-view position-relative'}><LoadData/></div>
                                : <>
                                    {(checkVoucherType()==='booking_type_1'||checkVoucherType()==='booking_type_2') && <>
                                        {voucherType==='doctor' &&
                                            <div className={'select-ponier mt-3 mb-3'}>
                                                <InputSelect className={'select-high-zIndex'} options={[{label:'filter1',value:1},{label:'filter2',value:2}]}/>
                                            </div>
                                        }
                                        {merchantServices.services.length > 0
                                            //merchantServices.services
                                            ? <>{merchantServices.services.map(service =>
                                                <CarBookingComp
                                                    setServices={addServiceHandler}
                                                    selectedServices={serviceState}
                                                    key={service.id}
                                                    car={service}
                                                />)
                                            }</>
                                            : 
                                            <div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center'}>
                                                <h4 className="text-danger">{t('app.noAvailable')}</h4>
                                            </div>
                                        }
                                    </>}
                                    {checkVoucherType()==='booking_type_3' && <>
                                        {merchantServices.employees.length > 0
                                            //merchantServices.services
                                            ? <>{merchantServices.employees.map(employee =>
                                                <PersonBookingComp
                                                    addSelectedPerson={addEmployee}
                                                    key={employee.id}
                                                    person={employee}
                                                    selectedEmployees={employeesState}
                                                />
                                            )}</>
                                            : 
                                            <div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center'}>
                                                <h4 className="text-danger">{t('app.noAvailable')}</h4>
                                            </div>
                                        }
                                    </>}
                                    {checkVoucherType()==='booking_type_4' && <>
                                        {merchantServices.services.length > 0
                                            //merchantServices.services
                                            ? <>{merchantServices.services.map(service =>
                                                <CarBookingComp
                                                    setServices={addServiceHandler}
                                                    selectedServices={serviceState}
                                                    // addSelectedPerson={addEmployee}
                                                    key={service.id}
                                                    car={service}
                                                    // selectedEmployees={employeesState}
                                                />
                                            )}</>
                                            : 
                                            <div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center'}>
                                                <h4 className="text-danger">{t('app.noAvailable')}</h4>
                                            </div>
                                        }
                                    </>}
                                </>
                            }
                        </div>
                        <div className="col-6">
                            <BookingForm
                                defaultAddressId={defaultOrder ? defaultOrder.address_id : ''}
                                defaultOrderId={defaultOrder ? defaultOrder.id : ''}
                                voucherId={voucherId}
                                merchantId={defaultOrder ? defaultOrder.merchant_id : merchant_id}
                                checkAddressByVoucherType={checkAddressByVoucherType}
                                serviceState={serviceState}
                                employeesState={employeesState}
                                time={selectedTime}
                                checkInDate={dateStart}
                                checkVoucherType={checkVoucherType}
                                checkHasAdultsCount={checkHasAdultsCount}
                                voucherType={voucherType}
                                checkOutDate={dateEnd}
                            />
                        </div>
                    </div>}
                </div>
            </div>


        </div>
    )
}