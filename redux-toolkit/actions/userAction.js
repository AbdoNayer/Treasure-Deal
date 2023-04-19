import axios from "axios";
import CONST from "../consts";
import {loginReducer} from "../reducer/userReducer";
import Toastify from "toastify-js";
import {t} from "i18next";
import {setInputStateAction} from "./inputStateActions";
import {headerConfig} from "./axiosCalls";

export const getProfileAuth = ( lang, token, currency ) => {
    return async(dispatch) => {
        console.log('start')
        await axios.get(`${CONST.url}profile`,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

            const dataUser = response.data.data;
            dispatch(loginReducer(dataUser));

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

export const updateProfileAuth = ( data, router, lang, token, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}update-profile?_method=put`,
            data,
            {
                headers: {
                    'Accept-Language'   : lang,
                    "Content-Type"      : "multipart/form-data",
                    'Authorization'     : 'Bearer' + ' ' + token,
                    'currency'          : currency
                },
            }
        ).then( (response)=> {

            console.log('', response.data.msg)
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

export const updateEmailSendCode = ( data, lang, token, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}edit-email-send-code`,
            data,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

            Toastify({
                text: response.data.msg,
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                    background: "#007427",
                }
            }).showToast();

            dispatch(setInputStateAction('input-otp'))

        }).catch(err => {

            Toastify({
                text: err.response.data.data.errors.email,
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

export const updateEmailCheckCode = ( data, lang, token, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}edit-email-check-code`,
            data,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

            Toastify({
                text: response.data.msg,
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                    background: "#007427",
                }
            }).showToast();

            dispatch(setInputStateAction('input-success'))

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

export const updatePhoneSendCode = ( data, lang, token, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}edit-phone-send-code`,
            data,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

            Toastify({
                text: response.data.msg,
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                    background: "#007427",
                }
            }).showToast();

            dispatch(setInputStateAction('input-otp'))

        }).catch(err => {
            
            Toastify({
                text: err.response.data.data.errors.phone,
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

export const updatePhoneCheckCode = ( data, lang, token, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}edit-phone-check-code`,
            data,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

            Toastify({
                text: response.data.msg,
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                    background: "#007427",
                }
            }).showToast();

            dispatch(setInputStateAction('input-success'))

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

export const updatePassword = ( data, lang, token, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}update-password?_method=patch`,
            data,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

            Toastify({
                text: response.data.msg,
                duration: 3000,
                gravity: "top",
                position: lang === 'en' ? "left" : "right",
                style: {
                    background: "#007427",
                }
            }).showToast();

            dispatch(setInputStateAction('input-success'))

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