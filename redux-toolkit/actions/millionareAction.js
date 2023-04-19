import axios from "axios";
import CONST from "../consts";
import Toastify from "toastify-js";
import {t} from "i18next";
import {
    addMillionVoucherBundleReducer,
    millionVoucherReducer,
    resetMillionVoucherReducer
} from "../reducer/millionVoucherReducer";
import {millionLinesReducer, resetMillionLinesReducer} from "../reducer/linesMillionaireReducer";
import {callCart} from "./cartActions";
import {headerConfig} from "./axiosCalls";

export const getMillionaire = ( token, lang, currency ) => {
    return async(dispatch) => {
        await axios.get(`${CONST.url}millionaire`,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

            const info = response.data.data;
            dispatch(millionVoucherReducer(info))

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

export const buyMillionaire = ( data ) => {
    return async(dispatch) => {
        await dispatch(addMillionVoucherBundleReducer(data))

        //     axios.post(`${CONST.url}millionaire/buy-bundles`,
        //     data,
        //     {
        //         headers: {
        //             'Accept-Language'   : lang,
        //             'Authorization'     : 'Bearer' + ' ' + token,
        //         },
        //     }
        // ).then( (response)=> {
        //
        //     dispatch(selectLinesMillionaire(token,lang)).then(()=>{
        //         router.push('/the-millionaire-voucher/millionaire-lotto');
        //     })
        //
        //
        // }).catch(err => {
        //
        //     Toastify({
        //         text: t("auth.warningMsg"),
        //         duration: 3000,
        //         gravity: "top",
        //         position: lang === 'en' ? "left" : "right",
        //         style: {
        //             background: "#F00",
        //         }
        //     }).showToast();
        //
        // });
    }
};

export const selectLinesMillionaire = ( token, lang, currency ) => {
    return async(dispatch) => {
        await axios.get(`${CONST.url}millionaire/select-lines`,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

            const info = response.data.data;
            dispatch(millionLinesReducer(info))

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

export const addBundleMillionaire = ( token, lang, router, currency, goBack=0 ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}millionaire/add-bundle`,
            {},
            headerConfig(lang,currency,token)
        ).then( (response)=> {

            dispatch(selectLinesMillionaire(token, lang, currency)).then(()=>{
                if (goBack===1) {
                    router.push('/the-millionaire-voucher/millionaire-lotto')
                }
            })

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

export const removeBundleMillionaire = ( token, lang, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}millionaire/remove-bundle`,
            {},
            headerConfig(lang,currency,token)
        ).then( (response)=> {

            dispatch(selectLinesMillionaire(token, lang, currency))

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

export const saveLuckyNumberMillionaire = ( data, token, lang, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}millionaire/save-lucky-number`,
            data,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

            dispatch(selectLinesMillionaire(token, lang, currency))

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

export const saveBundleMillionaire = ( data, router, token, lang, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}millionaire/save-lines`,
            data,
            headerConfig(lang,currency,token)
        ).then( (response)=> {
            dispatch(callCart(token,lang, currency))
            dispatch(selectLinesMillionaire(token,lang, currency))
                .then(()=> {
                    router.push('/shopping-cart').then(()=> {
                        dispatch(resetMillionVoucherReducer())
                        dispatch(resetMillionLinesReducer())
                    })
                })

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

export const deleteLineMillionaire = ( data, token, lang, currency ) => {
    return async(dispatch) => {
        await axios.delete(`${CONST.url}millionaire/delete-lines?cart_id=${data.cartId}`,
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
};

export const editLineMillionaire = ( data, token, router, lang, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}millionaire/edit-line?_method=patch`,
            data,
            headerConfig(lang,currency,token)
        ).then(async (response)=> {
            // router.reload()
            await dispatch(callCart(token, lang, currency))
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