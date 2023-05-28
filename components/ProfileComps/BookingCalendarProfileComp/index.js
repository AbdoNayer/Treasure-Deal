import Calendar from 'react-calendar';
import {useTranslation} from "react-i18next";
import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getBookingCalendar} from "../../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../../hooks/useApi";
import {useTable} from "../../../hooks/table-hook";
import {groupBy} from "lodash";
import {convertIndexToSerial} from "../../../redux-toolkit/consts";
import {Pagination} from "../../Pagination";
import {LoadData} from "../../index";
import {showModalAction} from "../../../redux-toolkit/actions";
import {ModalForm} from "../../ModalForms/ModalForm";
import {BookingDetailsModalForm} from "../../ModalForms/BookingDetailsModalForm";


export const BookingCalendarProfileComp = ({...props}) => {
    
    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch();
    const [date, setDate]                               = useState(new Date())
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);
    const [newFortmattedDates,setNewFortmattedDates]    = useState([])
    const [currentPage,setCurrentPage]                  = useState(1)
    const {setObjs,filteredObjs,message}                = useTable([])

    let PageSize = 4;

    const {
        data:bookingData,
        isLoading:isBookingDataLoading,
        reFetch:refetchBookingData
    } = useApi(()=> getBookingCalendar(user.token,langVal,currency))
    useEffect(()=>{
        console.log(bookingData);
    },[bookingData])

    const currentTableData = useMemo(() => {
        if (filteredObjs) {
            const firstPageIndex = (currentPage - 1) * PageSize;
            const lastPageIndex = firstPageIndex + PageSize;
            return filteredObjs.slice(firstPageIndex, lastPageIndex);
        }
    }, [currentPage,filteredObjs]);

    const checkDate = date => {
        const month = date.toLocaleDateString().split('/')[0]
        const day = date.toLocaleDateString().split('/')[1]
        const year = date.toLocaleDateString().split('/')[2]
        return year+'-'+ (month<10 ? '0'+month : month) +'-'+ (day<10 ? '0'+day : day)
    }

    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('en-US', { month: 'long' });
    }

    const checkBookingDate = (date) => {
        // return !!dateArr.find(dateV => dateV.day === date);
        return !!newFortmattedDates.find(dateV => dateV[0] === checkDate(date));
    }
    const checkBookingEvents = date => {
        return newFortmattedDates.find(dateV => dateV[0] === checkDate(date))[1];
    }


    const today = date;
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedToday = dd + '-' + getMonthName(mm) + '-' + yyyy;

    const openModal = (orderId) => {
        dispatch(showModalAction(
            <ModalForm title={t('booking.details.modalTitle')}>
                <BookingDetailsModalForm orderId={orderId}/>
            </ModalForm>
        ));
    }

    const checkBookingObject = (obj) => {
        switch (obj.shop_type) {
            case 'event':
                return obj.event.date
            default:
                return obj?.date?.split('T')[0];
        }
    }

    const bookingCalendarItem = (item) => {
        switch (item.shop_type) {
            case 'illusion':
                return <>
                    <h5 className='m-0'>Hotel Booking</h5>
                    <p className='m-0 mt-1'>{item?.illusion_data?.PartyName}</p>
                </>
            case 'property':
                return <>
                    <h5 className='m-0'>Property Viewing</h5>
                    <p className='m-0 mt-1'>{item?.services[0]?.service_name}</p>
                </>
            case 'event':
                return <>
                    <h5 className='m-0'>{item?.event?.title}</h5>
                    <p className='m-0 mt-1'>{item?.event?.time}</p>
                </>
            default:
                return <>
                    <h5 className='m-0'>{item?.voucher?.category}</h5>
                    <p className='m-0 mt-1'>{item?.voucher?.merchant}</p>
                </>
        }
    }

    useEffect(()=>{
        checkDate(date)
    },[date]);
    useEffect(()=>{
        if (bookingData) {
            // console.log(bookingData)
            // console.log(Object.entries(groupBy(bookingData.orders,(obj)=>obj?.date?.split('T')[0])))
            // console.log(Object.entries(groupBy(bookingData.orders,(obj)=> checkBookingObject(obj))))
            setNewFortmattedDates(Object.entries(groupBy(bookingData.orders,(obj)=>checkBookingObject(obj))))
        }
    },[bookingData])
    useEffect(()=>{
        if (checkBookingDate(date)){
            setObjs(newFortmattedDates.find(dateV => dateV[0] === checkDate(date))[1])
        }
    },[date])
    useEffect(()=>{
        setCurrentPage(1);
    },[filteredObjs,checkBookingDate(date)])

    if (isBookingDataLoading) return <div className={'modal-height-view position-relative'}><LoadData/></div>

    return (
        <div className={'td_profile_calendar pb-5'}>
            <h3>Booking Calendar</h3>
            <div className="row">
                <div className={(checkBookingDate(date) && filteredObjs.length>0) ? "col-8" : "col-12"}>
                    {/*<div className="calendar-container calendar-pro">*/}
                    <div className="">
                        <Calendar
                            next2Label={null}
                            prev2Label={null}
                            minDetail={'month'}
                            onChange={setDate}
                            value={date}
                            tileClassName={(t)=> checkBookingDate(t.date) && 'td_tile_active'}
                            tileContent={
                                (t)=> checkBookingDate(t.date)
                                    && <div className={'td_tile_reservation'}>{checkBookingEvents(t.date).length} Reservations</div>
                            }
                        />
                    </div>
                </div>
                {checkBookingDate(date) && filteredObjs.length>0 &&
                    <div className="col-4 td_booking">
                        <div className="temp-title text-center">
                            <h4 className="fw-light bg-white position-relative m-auto d-table px-3 py-3 fs-6">{formattedToday}</h4>
                        </div>
                        <div className="td_booking_events">
                            <div className='modal-height-view overflow-scroll p-2'>
                                {currentTableData.map((item,i) =>
                                    <div className='d-flex justify-content-between align-items-center old-shadow rounded-3 my-3 p-3' key={item.id}>
                                        <div className='d-flex align-items-center'>
                                            <span className='d-flex justify-content-center align-items-center bgMainColor rounded-3 text-white'>
                                                {convertIndexToSerial(i,currentPage,PageSize) < 10
                                                    ? `0${convertIndexToSerial(i,currentPage,PageSize)}`
                                                    : convertIndexToSerial(i,currentPage,PageSize)}
                                            </span>
                                            <div className='mx-2'>
                                                {bookingCalendarItem(item)}
                                            </div>
                                        </div>
                                        <button className='icon-arrow-up bg-transparent rounded-3' onClick={()=> openModal(item.id)}/>
                                    </div>
                                )}
                                <Pagination
                                    className="pagination-bar"
                                    currentPage={currentPage}
                                    totalCount={filteredObjs.length}
                                    pageSize={PageSize}
                                    onPageChange={page=>setCurrentPage(page)}
                                />
                            </div>
                            {/* {
                            checkBookingDate(date.getDate())
                                ?
                                dateArr.find(dateV => dateV.day === date.getDate())?.events.map((event,idx) => <div key={idx}>{event}</div>)
                                :
                                <div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center'}>
                                    <h5 className="text-danger">{t('booking.header.noBooking')}</h5>
                                </div>
                        } */}
                        </div>

                    </div>
                }

            </div>


        </div>
    )
}