import axios from "axios";
import CONST from "../consts";
import Toastify from 'toastify-js';

export const headerConfig = (lang,currency,token,multiPart=false) => {
    if (multiPart) {
        if (token) return {
            headers: {
                'Accept-Language'   : lang,
                'Authorization'     : 'Bearer' + ' ' + token,
                'currency'          : currency,
                "Content-Type"      : "multipart/form-data",
            }
        }
        else return  {
            headers: {
                'Accept-Language'   : lang,
                'currency'          : currency,
                "Content-Type"      : "multipart/form-data",
            }
        }
    }
    else {
        if (token) return {
            headers: {
                'Accept-Language'   : lang,
                'Authorization'     : 'Bearer' + ' ' + token,
                'currency'          : currency,
            }
        }
        else return  {
            headers: {
                'Accept-Language'   : lang,
                'currency'          : currency,
            }
        }
    }
}

//#region Orders
export const getOrdersCall = async ( order, type, page, token, lang, currency ) => {
        const res = await axios.get(`${CONST.url}orders?type=${type}&page=${page}&order_by=${order}`,
            headerConfig(lang,currency,token)
        )
    return res.data.data
};
//#endregion

//#region Bundles
export const getBundlesCall = async ( page, token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}my-bundles?page=${page}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region My Draws
export const getMyDrawsCall = async ( type, page, token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}my-draws?type=${type}&page=${page}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const getDrawDetailsCall = async ( token, lang, currency, drawId ) => {
    const res = await axios.get(`${CONST.url}my-draw-details?draw_id=${drawId}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region Lucky Numbers
export const getLuckyNumbers = async ( token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}lucky-numbers/my-numbers`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const deleteLuckyNumbers = async ( id, token, lang, currency ) => {
    const res = await axios.delete(`${CONST.url}lucky-numbers/delete-number?number_id=${id}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const updateLuckyNumbers = async ( data, token, lang, currency ) => {
    const res = await axios.post(`${CONST.url}lucky-numbers/edit-number?_method=put`,
        data,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region Millionaire Results
export const getResultsMillionaire = async ( token, lang, currency, date='' ) => {
    const res = await axios.get(`${CONST.url}results/millionaire?draw_date=${date}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const getMillionaireDrawDetails = async ( token, lang, currency, drawId ) => {
    const res = await axios.get(`${CONST.url}results/millionaire/draw/details?draw_id=${drawId}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region Raffellionaire Results
export const getResultsRaffellionaire = async ( token, lang, currency, date='' ) => {
    const res = await axios.get(`${CONST.url}results/raffleillionaire?draw_date=${date}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const getRaffellionaireDrawDetails = async ( token, lang, currency, drawId ) => {
    const res = await axios.get(`${CONST.url}results/raffleillionaire/draw/details?draw_id=${drawId}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region Merchants
export const getAllMerchants = async ( token, lang, currency, page=''
                                       ,catId='', subCatId='', mallId=''
                                       ,country_id='',city_id='',name=''
                                       ,near_by=false,lat='',lng='' ) => {
    const res = await axios.get(`${CONST.url}merchants?category_id=${catId}&page=${page}&mall_id=${mallId}&subcategory_id=${subCatId}
    &country_id=${country_id}&city_id=${city_id}&near_by=${near_by}&lat=${lat}&lng=${lng}&name=${name}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const getMerchantDetails = async ( token, lang, currency, merchantId='' ) => {
    const res = await axios.get(`${CONST.url}merchants/merchant-details?merchant_id=${merchantId}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const getMerchantServices = async ( token, lang, currency, merchantId='' ,voucherType='') => {
    const res = await axios.get(`${CONST.url}merchants/merchant-services?type=${voucherType}&merchant_id=${merchantId}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};


//#endregion

//#region Categories and Malls
export const getAllCategories = async ( token='', lang, currency, parentId='' ) => {
    const res = await axios.get(`${CONST.url}categories?parent_id=${parentId}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const getAllMalls = async ( token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}malls`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

//#endregion

//#region Redeem Calls
export const getAllRedeems = async ( page, token, lang, currency, merchantId='' ) => {
    const res = await axios.get(`${CONST.url}redeems/my-redeems?page=${page}&merchant_id=${merchantId}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const makeRedeem = async ( data, token, lang, currency ) => {
    const res = await axios.post(`${CONST.url}redeems/make-redeem`,
        data,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region Countries and Cities
export const getAllCountries = async ( token='', lang, currency ) => {
    const res = await axios.get(`${CONST.url}countries`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const getAllCities = async ( token='', lang, currency, countryId ) => {
    const res = await axios.get(`${CONST.url}cities?country_id=${countryId}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region Booking
export const checkDateAvailability = async ( token, lang, currency,availabilityData ) => {
    const res = await axios.get(`${CONST.url}booking/check-availability?merchant_id=${availabilityData.merchant_id}&date=${availabilityData.date}`
        ,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const getBookingHistory = async ( page, token, lang, currency, merchantId='' ) => {
    const res = await axios.get(`${CONST.url}booking/booking-history?page=${page}${merchantId && `&merchant_id=${merchantId}`}`
        ,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const getOrderDetails = async ( token, lang, currency, orderId='' ) => {
    const res = await axios.get(`${CONST.url}booking/booking-details?order_id=${orderId}`
        ,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const sendBookingRequest = async ( token, lang, currency, bookingData ) => {
    const res = await axios.post(`${CONST.url}booking/booking`,
        bookingData,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const editBookingRequest = async ( token, lang, currency, bookingData ) => {
    const res = await axios.post(`${CONST.url}booking/edit-booking?_method=put`,
        bookingData,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const cancelBookingRequest = async ( token, lang, currency, orderId ) => {
    const res = await axios.post(`${CONST.url}booking/cancel-booking?_method=patch`,
        {order_id:orderId},
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region Address
export const getMyAddresses = async ( token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}addresses/my-addresses`
        ,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const addNewAddresses = async ( token, lang, currency, addressData ) => {
    const res = await axios.post(`${CONST.url}addresses/add-address`,
        addressData,
        headerConfig(lang,currency,token)
    )
    return res.data
};

export const editAddresses = async ( token, lang, currency, addressData ) => {
    const res = await axios.post(`${CONST.url}addresses/edit-address?_method=put`,
        addressData,
        headerConfig(lang,currency,token)
    )
    return res.data
};

export const deleteAddresses = async ( token, lang, currency, addressId ) => {
    const res = await axios.delete(`${CONST.url}addresses/delete-address?address_id=${addressId}`,
        headerConfig(lang,currency,token)
    )
    return res.data
};
//#endregion

//#region FeedBack
export const submitRedeemFeedBack = async ( token, lang, currency, feedBackData ) => {
    const res = await axios.post(`${CONST.url}redeems/feedback`,
        feedBackData,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region Currencies
export const getCurrencies = async ( lang, currency ) => {
    const res = await axios.get(`${CONST.url}currencies`
        ,
        headerConfig(lang,currency)
    )
    return res.data.data
};
//#endregion

//#region Notification

//#region Delete NotificationComponent
export const deleteNotification = async ( lang, currency, token, id ) => {
    const res = await axios.delete(`${CONST.url}notifications/delete-notification?notification_id=${id}`,
        headerConfig(lang, currency, token)
    )
    return res.data.data
};
//#endregion

//#region Delete All NotificationComponent
export const deleteAllNotifications = async ( lang, currency, token ) => {
    const res = await axios.delete(`${CONST.url}notifications/delete-notifications`,
        headerConfig(lang, currency, token)
    )
    return res.data.data
    // Toastify({
    //     text: 'Done Remove All Item',
    //     duration: 3000,
    //     gravity: "top",
    //     position: langVal === 'en' ? "left" : "right",
    //     style: {
    //       background: "#007427",
    //     }
    // }).showToast();
};
//#endregion

//#region Count NotificationComponent
export const getCountNotification = async ( lang, currency, token ) => {
    const res = await axios.get(`${CONST.url}notifications/count-unread-notifications`,
        headerConfig(lang, currency, token)
    )
    return res.data.data
};
//#endregion

//#endregion

//#region Raffellionaire like Tickets
export const getBundleDetails = async ( token, lang, currency, type='' ) => {
    const res = await axios.get(`${CONST.url}raffleillionaire?type=${type}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const getAllTickets = async ( token, lang, currency, type, ticketOptions,count,startWith,endWith ) => {
    const res = await axios.get(`${CONST.url}raffleillionaire/tickets?option=${ticketOptions}&count=${count}&start_with=${startWith}&end_with=${endWith}&type=${type}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const getTicketDetails = async ( token, lang, currency, type ) => {
    const res = await axios.get(`${CONST.url}raffleillionaire/select-lines?&type=${type}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};





//#endregion

//#region Referral Check
export const checkReferralIdCall = async ( token, lang, currency, referralData ) => {
    const res = await axios.post(`${CONST.url}check-refferal`,
        referralData,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region Winners Steps
export const getParticipationSteps = async ( lang, currency, type ) => {
    const res = await axios.get(`${CONST.url}steps?type=${type}`
        ,
        headerConfig(lang,currency)
    )
    return res.data.data
};
//#endregion

//#region Winning Shows
export const getWinningShows = async ( token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}results/shows`
        ,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region FAQs
export const getFAQs = async ( lang, currency ) => {
    const res = await axios.get(`${CONST.url}faqs`
        ,
        headerConfig(lang,currency)
    )
    return res.data.data
};
//#endregion

//#region Become Partner
export const becomePartnerRequest = async ( partnerData, lang, currency ) => {
    const res = await axios.post(`${CONST.url}become-partner-request`,
        partnerData,
        headerConfig(lang,currency)
    )
    return res.data.data
};
//#endregion

//#region Infulencer
export const getFreeLanceRequestData = async ( token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}freelancer/new-freelance-request-data`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const newFreeLanceRequest = async ( freelancerData, token, lang, currency ) => {
    const res = await axios.post(`${CONST.url}freelancer/new-request`,
        freelancerData,
        headerConfig(lang,currency,token,true)
    )
    return res.data.data
};
//#endregion

//#region Chat
export const createChatRoom = async ( chatData, token, lang, currency ) => {
    const res = await axios.post(`${CONST.url}create-private-room`,
        chatData,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const getChatRooms = async ( token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}get-rooms`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const getChatRoomMessages = async ( roomId ,token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}get-room-messages/${roomId}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const getChatRoomUnseenMessages = async ( roomId ,token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}get-room-unseen-messages/${roomId}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const deleteChatRoomMessage = async ( messageId ,token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}delete-message-copy/${messageId}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};