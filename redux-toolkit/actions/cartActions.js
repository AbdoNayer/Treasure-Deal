import axios from "axios";
import CONST from "../consts";
import Toastify from "toastify-js";
import {t} from "i18next";
import {cartReducer, cartSubscriptions, resetCartReducer} from "../reducer/cartReducer";
import {logoutReducer} from "../reducer/userReducer";
import {resetMillionVoucherReducer} from "../reducer/millionVoucherReducer";
import {resetMillionLinesReducer} from "../reducer/linesMillionaireReducer";
import {resetRaffillionaireBundleReducer} from "../reducer/raffillionaireBundleReducer";
import {resetRaffillionaireLinesReducer} from "../reducer/raffillionaireLinesReducer";
import {resetRaffillionaireTicketsReducer} from "../reducer/raffillionaireTicketsReducer";
import {headerConfig} from "./axiosCalls";

export const callCart = ( token, lang, currency ) => {
    return async(dispatch) => {
        await axios.get(`${CONST.url}cart`,
            headerConfig(lang,currency,token)
        ).then( (response)=> {
            const info = response.data.data;
            dispatch(cartReducer(info))

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

export const payCart = ( data, token, router, lang, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}checkout`,
            data,
            headerConfig(lang,currency,token)
        ).then( (response)=> {
            dispatch(resetCartReducer());
            dispatch(resetMillionVoucherReducer());
            dispatch(resetMillionLinesReducer());
            dispatch(resetRaffillionaireBundleReducer());
            dispatch(resetRaffillionaireLinesReducer());
            dispatch(resetRaffillionaireTicketsReducer());
            router.push('/');
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

export const getSubscriptions = ( token, lang, currency ) => {
    return async(dispatch) => {
        await axios.get(`${CONST.url}subscriptions`,
            headerConfig(lang,currency,token)
        ).then( (response)=> {
            const info = response.data.data;
            dispatch(cartSubscriptions(info))

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

export const makeSubscription = ( data, token, lang, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}make-subscription`,
            data,
            headerConfig(lang,currency,token)
        ).then(async (response)=> {
            await dispatch(callCart(token,lang,currency))
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
