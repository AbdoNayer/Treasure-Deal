import { useTranslation } from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import { ModalForm } from "../../../components/ModalForms/ModalForm";
import {InputText} from "../../Inputs/InputText";
import { showModalAction } from '../../../redux-toolkit/actions';
import Image from "next/image";
import {BookingHistoryItem} from "../BookingHistoryItem";
import {cancelBookingRequest} from "../../../redux-toolkit/actions/axiosCalls";
import {useEffect} from "react";
import {Pagination} from "../../Pagination";

export const BookingHistory = ({bookingHistory,allMerchants=false,refetchBooking,pagination,updatePage,currentPage,...props}) => {
    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch();
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    useEffect(()=>{
        if (!allMerchants) {
            refetchBooking();
        }
    },[])
    const handleCancelBooking = async (orderId) => {
        await cancelBookingRequest(user.token,langVal,currency,orderId)
            .then(r=>refetchBooking())
            .catch(e=> console.log(e))
    }

    return (
        <div className={'details'}>
            <div className="result-items">
                {bookingHistory.map(order => <BookingHistoryItem handleCancelBooking={handleCancelBooking} key={order.id} order={order}/>)}
            </div>
            <div className="td-pagination mt-3 d-flex justify-content-end">
                {pagination && <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={pagination.total_items}
                    pageSize={pagination.per_page}
                    onPageChange={updatePage}
                />}
            </div>
        </div>
    )
}