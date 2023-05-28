import axios from "axios";
import CONST from "../consts";

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

export const illusionBody = {
        "profile": {
            "password":"Tr!3@sUrEDe@L2023",
            "code":"TreasureDealQR",
            "tokenNumber":"0ccd04b3-3bf2-4680-a64e-6a894316a1d2"
        }
}

export const illusionDetailsBody = (hotelCode) => ({
    "Profile": {
        "password": "Tr!3@sUrEDe@L2023",
        "code": "TreasureDealQR",
        "tokenNumber": "0ccd04b3-3bf2-4680-a64e-6a894316a1d2"
    },
    "SearchCriteria": {
        // "StartDate": formatDate(startDate),
        // "EndDate": formatDate(endDate),
        // "StartDate": 20200920,
        // "EndDate": 20200924,
        "HotelCode": hotelCode
    }
})



const illusionHeaders = {
    // "Content-Type": "application/json",
    // "Cookie": "ApplicationGatewayAffinity=6bd22ba08ccf7c22c79b8b132e4808a0; ApplicationGatewayAffinityCORS=6bd22ba08ccf7c22c79b8b132e4808a0",
    // "Content-Length": 18739,
    "Access-Control-Allow-Origin": "*",
}

//#region Orders
export const getOrdersCall = async ( order, type, page, token, lang, currency ) => {
        const res = await axios.get(`${CONST.url}orders?type=${type}&page=${page}&order_by=${order}`,
            headerConfig(lang,currency,token)
        )
    return res.data.data
};
//#endregion

//#region My Earns
export const getMyEarns = async ( page, token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}my-earns?page=${page}`,
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
export const getResultsRaffellionaire = async ( token, lang, currency, date='',type ) => {
    const res = await axios.get(`${CONST.url}results/raffleillionaire?draw_date=${date}&type=${type}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const getRaffellionaireDrawDetails = async ( token, lang, currency, drawId, type ) => {
    const res = await axios.get(`${CONST.url}results/raffleillionaire/draw/details?draw_id=${drawId}&type=${type}`,
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

//#region Illusion Booking
// export const getIllusionHotels = async ( page, country='AE' ) => {
//     const res = (await axios.post(`${CONST.illusionUrl}hotellist?pageNumber=${page}&pageSize=4&countryCode=${country}`
//         ,illusionBody
//     ))
//     return res.data
// };
// export const getIllusionHotelDetails = async ( hotelCode ) => {
//     const res = (await axios.post(`${CONST.illusionUrl}details`
//         ,illusionDetailsBody(hotelCode)
//     ))
//     return res.data
// };
export const getIllusionHotelsNative = async ( page=1, country='AE' ) => {
    const url = `/api/handleHotels`;
    const method = 'POST';
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({'pageNumber':1,'pageSize':400,'countryCode':country}),
    }
    const res = await fetch(url,options)
    return await res.json()
};
export const getIllusionHotelDetailsNative = async ( hotelCode ) => {
    const url = `/api/handleHotelDetails`;
    const method = 'POST';
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({'hotelCode':hotelCode}),
    }
    const res = await fetch(url,options)
    return await res.json()
};
export const getIllusionHotelSearchDetailsNative = async ( hotelCode, startDate, endDate, nationality, roomConfiguration ) => {
    const url = `/api/handleHotelSearchDetails`;
    const method = 'POST';
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            'hotelCode':hotelCode,
            'startDate':startDate,
            'endDate':endDate,
            'nationality':nationality,
            'roomConfiguration':roomConfiguration
        }),
    }
    const res = await fetch(url,options)
    return await res.json()
};
export const sendIllusionHotelBooking = async ( token, lang, currency, bookingData ) => {
    const res = await axios.post(`${CONST.url}booking/illusion-booking`,
        bookingData,
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
export const getAllEventsCategories = async ( token='', lang, currency ) => {
    const res = await axios.get(`${CONST.url}events-categories`,
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

//#region Events Booking
export const sendEventBookingRequest = async ( token, lang, currency, bookingData ) => {
    const res = await axios.post(`${CONST.url}booking/event-booking`,
        bookingData,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const editEventBookingRequest = async ( token, lang, currency, bookingData ) => {
    const res = await axios.post(`${CONST.url}booking/event-booking`,
        bookingData,
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

export const getBookingHistory = async ( page, status, token, lang, currency, merchantId='' ) => {
    const res = await axios.get(`${CONST.url}booking/booking-history?page=${page}${status!=='all' ? `&status=${status}` : ''}${merchantId && `&merchant_id=${merchantId}`}`
        ,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const getBookingCalendar = async ( token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}booking/calendar`,
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

export const sendPropertyBookingRequest = async ( token, lang, currency, bookingData ) => {
    const res = await axios.post(`${CONST.url}booking/property-booking`,
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

//#region Help Center
export const contactUsMessage = async ( contactData ) => {
    const res = await axios.post(`${CONST.url}contact-us/send-message`,
        contactData,
        // headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region Help Center
export const contactUs = async ( contactData ) => {
    const res = await axios.get(`${CONST.url}contact-us`,
        contactData,
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

export const getFreeLancersInvitations = async ( page, token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}freelancer/freelancer-invitations?page=${page}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const inviteFreeLanceRequest = async ( freelancerData, token, lang, currency ) => {
    const res = await axios.post(`${CONST.url}freelancer/invite-freelancer`,
        freelancerData,
        headerConfig(lang,currency,token,true)
    )
    return res.data.data
};

export const deleteFreeLancersInvitation = async ( invitationId, token, lang, currency ) => {
    const res = await axios.delete(`${CONST.url}freelancer/delete-freelancer-invitation?id=${invitationId}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region Enquires
export const getEnquiresData = async ( page, token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}enquiries?page=${page}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const getEnquiryDetailsData = async ( enquiryId, token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}enquiries/details?id=${enquiryId}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const chaneEnquiryStatus = async ( enquiryData, token, lang, currency ) => {
    const res = await axios.post(`${CONST.url}enquiries/change-status`,
        enquiryData,
        headerConfig(lang,currency,token)
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
//#endregion

//#region Quizzes
export const getAllQuizzes = async ( token, lang, currency, page=1 ) => {
    const res = await axios.get(`${CONST.url}games/quizzes?page=${page}`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const startQuizApi = async ( token, lang, currency, quizId ) => {
    const res = await axios.post(`${CONST.url}games/quizzes/start?id=${quizId}`,{},
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
export const submitQuizAnswers = async ( token, lang, currency, quizId, quizBody ) => {
    const res = await axios.post(`${CONST.url}games/quizzes/send-answers?id=${quizId}`,
        quizBody,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region Slides
export const getSlides = async ( type ) => {
    const res = await axios.get(`${CONST.url}slides?type=${type}`,
        // headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion

//#region Treasure Settings
export const getTreasureSettings = async () => {
    const res = await axios.get(`${CONST.url}settings`,
        // headerConfig(lang,currency,token)
    )
    return res.data.data
};
//#endregion