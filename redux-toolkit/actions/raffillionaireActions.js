import axios from "axios";
import CONST from "../consts";
import Toastify from "toastify-js";
import {t} from "i18next";
import {addRaffillionaireBundleReducer, raffillionaireBundleReducer} from "../reducer/raffillionaireBundleReducer";
import {raffillionaireLinesReducer} from "../reducer/raffillionaireLinesReducer";
import {raffillionaireTicketsReducer} from "../reducer/raffillionaireTicketsReducer";
import {callCart} from "./cartActions";
import {headerConfig} from "./axiosCalls";

export const getRaffillionaire = ( token, lang, currency ) => {
    return async(dispatch) => {
        await axios.get(`${CONST.url}raffleillionaire`,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

            const info = response.data.data;
            dispatch(raffillionaireBundleReducer(info))

        }).catch(err => {

            Toastify({
                text: t("auth.warningMsg"),
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                    background: "#F00",
                }
            }).showToast();

        });
    }
};

export const buyRaffillionaire = ( data ) => {
    return async(dispatch) => {
        await dispatch(addRaffillionaireBundleReducer(data))
    }
};

export const selectLinesRaffillionaire = ( token, lang, currency ) => {
    return async(dispatch) => {
        await axios.get(`${CONST.url}raffleillionaire/select-lines`,
            headerConfig(lang,currency,token)
        ).then( (response)=> {
            const info = response.data.data;
            dispatch(raffillionaireLinesReducer(info))

        }).catch(err => {
            console.log(err);
            Toastify({
                text: t("auth.warningMsg"),
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                    background: "#F00",
                }
            }).showToast();

        });
    }
};

export const getTicketsRaffillionaire = ( token, lang, currency, option='all', count='63',filterType='',filterValue='' ) => {
    return async(dispatch) => {
        await axios.get(`${CONST.url}raffleillionaire/tickets?option=${option}&count=${count}&${filterType}=${filterValue}`,
            headerConfig(lang,currency,token)
        ).then(async (response)=> {

            const info = response.data.data;
            await dispatch(raffillionaireTicketsReducer(info))

        }).catch(err => {

            Toastify({
                text: t("auth.warningMsg"),
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                    background: "#F00",
                }
            }).showToast();

        });
    }
};

export const addTicketRaffillionaire = ( data, token, lang, currency, router, goBack=0 ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}raffleillionaire/select-line`,
            data,
            headerConfig(lang,currency,token)
        ).then( (response)=> {
            dispatch(callCart(token,lang, currency))
            dispatch(selectLinesRaffillionaire(token, lang, currency))
            //     if (goBack===1) {
            //         router.push('/raffleillionaire-bundle/raffleillionaire')
            //     }
            // })
            // dispatch(selectLinesMillionaire(token, lang))

        }).catch(err => {

            Toastify({
                text: t("auth.warningMsg"),
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                    background: "#F00",
                }
            }).showToast();

        });
    }
}

export const editTicketRaffillionaire = ( data, token, lang, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}raffleillionaire/edit-line`,
            data,
            headerConfig(lang,currency,token)
        ).then(async (response)=> {
            // console.log(response)
            await dispatch(callCart(token,lang, currency))
            // await dispatch(selectLinesRaffillionaire(token, lang))
            //     if (goBack===1) {
            //         router.push('/raffleillionaire-bundle/raffleillionaire')
            //     }
            // })
            // dispatch(selectLinesMillionaire(token, lang))

        }).catch(err => {

            Toastify({
                text: t("auth.warningMsg"),
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                    background: "#F00",
                }
            }).showToast();

        });
    }
}

export const addPartnerRaffillionaire = ( data, token, lang, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}raffleillionaire/save-lucky-partners`,
            data,
            headerConfig(lang,currency,token)
        ).then(async (response)=> {
            await dispatch(callCart(token,lang, currency))

        }).catch(err => {

            Toastify({
                text: t("auth.warningMsg"),
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                    background: "#F00",
                }
            }).showToast();

        });
    }
}

export const deleteTicketRaffillionaire = ( data, token, lang, currency) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}raffleillionaire/delete-line`,
            data,
            headerConfig(lang,currency,token)
        ).then(async (response)=> {
            await dispatch(callCart(token,lang, currency))
            // dispatch(selectLinesRaffillionaire(token,lang))

        }).catch(err => {

            Toastify({
                text: t("auth.warningMsg"),
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                    background: "#F00",
                }
            }).showToast();

        });
    }
}