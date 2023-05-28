import {useRouter} from "next/router";
import {useApi} from "../../../hooks/useApi";
import {getMerchantServices, getOrderDetails} from "../../../redux-toolkit/actions/axiosCalls";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {MainBookingComp} from "../../../components/BookingComps/MainBookingComp";
import React from "react";
import {LoadData} from "../../../components";

export default function EditReservation() {
    const { t }                                             = useTranslation();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const router                                            = useRouter();
    const {order_id} = router.query

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    //#region Merchant Services
    const {
        data:merchantServices,
        isLoading:isMerchantServicesLoading,
        reFetch: refetchMerchantServices
    } = useApi(()=> getMerchantServices(user.token,langVal,currency,orderDetailsData?.order.merchant_id,orderDetailsData?.order.voucher_type),false)
    //#endregion

    //#region Merchant Details
    const {
        data:orderDetailsData,
        isLoading:isOrderDetailsLoading,
        reFetch:refetchOrderDetails
    } = useApi(()=>  getOrderDetails(user.token,langVal,currency,order_id),false)

    useEffect(()=>{
        if (order_id) {
            refetchOrderDetails(() => getOrderDetails(user.token, langVal,currency, order_id))
        }
    },[order_id])

    useEffect(()=>{
        if (orderDetailsData) {
            refetchMerchantServices(() => getMerchantServices(user.token,langVal,currency,orderDetailsData.order.merchant_id,orderDetailsData.order.voucher_type))
        }
    },[orderDetailsData])
    //#endregion

    if (isOrderDetailsLoading) return <LoadData />

    if(user === null) return null;

    return (
        <div className={'container'}>
            {orderDetailsData.order && <MainBookingComp
                defaultOrder={orderDetailsData.order}
                merchantId={orderDetailsData.order.merchant_id}
                merchantServices={merchantServices}
                servicesLoading={isMerchantServicesLoading}
                voucherId={orderDetailsData.order.voucher.id}
                voucherType={orderDetailsData?.order.voucher_type}
            />}
        </div>
    )
}