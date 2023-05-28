import {LoadData} from "../../index";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useApi} from "../../../hooks/useApi";
import {getBookingHistory} from "../../../redux-toolkit/actions/axiosCalls";
import {BookingHistory} from "../../MerchantComps/BookingHistory";
import {useEffect, useState} from "react";
import {InputSelect} from "../../Inputs/InputSelect";

export const AllBookingHistory = ({...props}) => {
    const { t }                                         = useTranslation();
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const [currentPage,setCurrentPage] = useState(1)
    const [bookingFilter,setBookingFilter] = useState('all')
    const filterOptions = [
        {label:'all',value:'all'},
        {label:'new',value:'new'},
        {label:'accepted',value:'accepted'},
        {label:'rejected',value:'rejected'},
        {label:'canceled',value:'canceled'},
        {label:'finished',value:'finished'},
    ]
    //#region bookingHistory
    const [firstLoading,setFirstLoading] = useState(true)
    const {
        data:bookingHistory,
        isLoading:isBookingHistoryLoading,
        reFetch:refetchBookingHistory
    } = useApi(()=> getBookingHistory(currentPage,bookingFilter,user.token,langVal,currency))

    useEffect(()=>{
        refetchBookingHistory()
    },[currentPage,bookingFilter])
    useEffect(()=>{
        if (isBookingHistoryLoading===false){
            setFirstLoading(false)
        }
    },[isBookingHistoryLoading])
    //#endregion

    if (isBookingHistoryLoading && firstLoading) return <div className={'modal-height-view position-relative'}><LoadData/></div>

    return (
        <div className="result-items">
            <div className={'w-25 select-add select-full my-3'}>
                <InputSelect
                    className={''}
                    placeholder={'select filter...'}
                    onChange={e=> setBookingFilter(e.value)}
                    options={filterOptions}
                />
            </div>
            {bookingHistory.orders.length > 0
                ? <BookingHistory
                    allMerchants
                    refetchBooking={refetchBookingHistory}
                    bookingHistory={bookingHistory.orders}
                    currentPage={currentPage}
                    updatePage={page=>setCurrentPage(page)}
                    pagination={bookingHistory.pagination}
                />
                : <div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center'}>
                    <h4 className="text-danger">{t('ordersProfile.noOrders')}</h4>
                </div>
            }
        </div>
    )
}