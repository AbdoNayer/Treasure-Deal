import axios from "axios";
import CONST from "../consts";
import { loginReducer, logoutReducer } from "../reducer/userReducer";
import Toastify from 'toastify-js';
import { t } from "i18next";
import {resetCartReducer} from "../reducer/cartReducer";
import {resetMillionVoucherReducer} from "../reducer/millionVoucherReducer";
import {resetMillionLinesReducer} from "../reducer/linesMillionaireReducer";
import {selectLinesMillionaire} from "./millionareAction";
import {resetRaffillionaireBundleReducer} from "../reducer/raffillionaireBundleReducer";
import {resetRaffillionaireLinesReducer} from "../reducer/raffillionaireLinesReducer";
import {resetRaffillionaireTicketsReducer} from "../reducer/raffillionaireTicketsReducer";
import {resetPartners} from "../reducer/partnersReducer";
import {defaultAddressReducer, resetLocationReducer} from "../reducer/locationReducer";
import {headerConfig} from "./axiosCalls";

export const loginAuth = ( data, router, lang,currency ) => {
    return async(dispatch) => {

        await axios.post(`${CONST.url}login`, data,headerConfig(lang,currency)).then( (response)=> {

            const dataUser = response.data.data.user;
            dispatch(loginReducer(dataUser));
            dispatch(defaultAddressReducer(response.data.data.user.default_address));
            router.push('/');

            Toastify({
                text: t('auth.donLogin'),
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                  background: "#007427",
                }
            }).showToast();

        }).catch(err => {

            Toastify({
                text: err.response.data.msg,
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

export const registerAuth = ( data, router, lang,currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}register`, data, headerConfig(lang,currency)).then( (response)=> {

            router.push({
                pathname    : '/auth/verify-code',
                query       : { userId: response.data.data.user.id },
            });

            Toastify({
                text: t('auth.donLogin'),
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                  background: "#007427",
                }
            }).showToast();

        }).catch(err => {

            Toastify({
                text: err.response.data.data.errors.phone || err.response.data.data.errors.email,
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

export const verifyAuth = ( data, router, lang,currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}verify-phone?_method=patch`, data,headerConfig(lang,currency)).then( (response)=> {

            const dataUser = response.data.data.user;
            dispatch(loginReducer(dataUser));
            dispatch(defaultAddressReducer(response.data.data.user.default_address));
            router.push('/');
            
            Toastify({
                text: t('auth.donLogin'),
                duration: 2000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                  background: "#007427",
                }
            }).showToast();

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

export const verifyAuthResend = ( data, lang,currency ) => {
    return async(dispatch) => {
        await axios.get(`${CONST.url}verify-phone-resend?user_id=${data.user_id}`, data,headerConfig(lang,currency)).then( (response)=> {

            Toastify({
                text: t("auth.sentCode"),
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                  background: "#007427",
                }
            }).showToast();

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

export const verifyAuthEmail = ( data, router, lang, currency, token ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}verify-email?_method=patch`, 
        data,
        headerConfig(lang,currency,token)).then( (response)=> {

            const dataUser = response.data.data.user;
            dispatch(loginReducer(dataUser));
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

export const verifyAuthEmailResend = ( lang, token, currency ) => {
    return async(dispatch) => {
        await axios.get(`${CONST.url}verify-email-resend`, headerConfig(lang,currency,token)).then( (response)=> {

            Toastify({
                text: t("auth.sentCode"),
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                  background: "#007427",
                }
            }).showToast();

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

export const forgotPasswordAuth = ( data, router, lang,currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}forgot-password`, data,headerConfig(lang,currency)).then( (response)=> {

            router.push({
                pathname    : '/auth/new-password',
                query       : data,
            });

            Toastify({
                text: t('auth.succPhone'),
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                  background: "#007427",
                }
            }).showToast();

        }).catch(err => {

            Toastify({
                text: err.response.data.msg,
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

export const resetPasswordAuth = ( data, router, lang, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}reset-password`, data,headerConfig(lang,currency)).then( (response)=> {

            router.push('/auth/login');

            Toastify({
                text: response.data.msg,
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                  background: "#007427",
                }
            }).showToast();

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

export const logOut = ( data, router, lang, currency ) => {
    return async(dispatch) => {
        await axios.delete(`${CONST.url}logout?device_id=${data.device_id}`, headerConfig(lang,currency,data.token)).then( (response)=> {

            router.push('/auth/login');
            dispatch(logoutReducer());
            dispatch(resetCartReducer());
            dispatch(resetMillionVoucherReducer());
            dispatch(resetMillionLinesReducer());
            dispatch(resetRaffillionaireBundleReducer())
            dispatch(resetRaffillionaireLinesReducer())
            dispatch(resetRaffillionaireTicketsReducer())
            dispatch(resetPartners())
            dispatch(resetLocationReducer())

            Toastify({
                text: t("auth.doneLogOut"),
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                  background: "#007427",
                }
            }).showToast();

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
