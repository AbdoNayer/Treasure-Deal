import Calendar from 'react-calendar';
import {useTranslation} from "react-i18next";
import {useState} from "react";


export const BookingCalendarProfileComp = ({...props}) => {
    
    const { t }     = useTranslation();
    const [date, setDate] = useState(new Date())
    
    const dateArr = [
        {
            id:0,
            day:15,
            events: ['ev1', 'ev2', 'ev3']
        },
        {
            id:1,
            day:20,
            events: ['ev4', 'ev5']
        },
        {
            id:2,
            day:7,
            events: ['ev6', 'ev7', 'ev8', 'ev9']
        },
    ]
    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('en-US', { month: 'long' });
    }
    const checkBookingDate = (date) => {
        return !!dateArr.find(dateV => dateV.day === date);
    }


    const today = date;
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedToday = dd + '-' + getMonthName(mm) + '-' + yyyy;

    return (
        <div className={'td_profile_calendar pb-5'}>
            <h3>Booking Calendar</h3>
            <div className="row">
                <div className="col-8">
                    <div className="calendar-container calendar-pro">
                        <Calendar
                            next2Label={null}
                            prev2Label={null}
                            minDetail={'month'}
                            onChange={setDate}
                            value={date}
                            tileClassName={(t)=> checkBookingDate(t.date.getDate()) && 'td_tile_active'}
                        />
                    </div>
                </div>
                <div className="col-4 td_booking">
                    <div className="temp-title text-center">
                        <h4 className="fw-light bg-white position-relative m-auto d-table px-3 py-3 fs-6">{formattedToday}</h4>
                    </div>
                    <div className="td_booking_events">
                        <div className='modal-height-view overflow-scroll p-2'>
                            <div className='d-flex justify-content-between align-items-center old-shadow rounded-3 my-3 p-3'>
                                <div className='d-flex align-items-center'>
                                    <span className='d-flex justify-content-center align-items-center bgMainColor rounded-3 text-white'>01</span>
                                    <div className='mx-2'>
                                        <h5 className='m-0'>Hotel Booking</h5>
                                        <p className='m-0 mt-1'>Crown Plaza</p>
                                    </div>
                                </div>
                                <button className='icon-arrow-up bg-transparent rounded-3' />
                            </div>
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
            </div>


        </div>
    )
}