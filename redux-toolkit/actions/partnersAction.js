import axios from "axios";
import CONST from "../consts";
import Toastify from "toastify-js";
import {t} from "i18next";
import {partnersReducer} from "../reducer/partnersReducer";
import {headerConfig} from "./axiosCalls";

export const getPartners = ( token, lang, currency ) => {
    return async(dispatch) => {
        await axios.get(`${CONST.url}lucky-partners/get-accepted-invitations`,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

            const info = response.data.data;
            dispatch(partnersReducer(info))

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

export const getPartnerInvitations = async ( token, lang, currency ) => {
    const res = await axios.get(`${CONST.url}lucky-partners/get-received-invitations`,
        headerConfig(lang,currency,token)
    )
    return res.data.data
};

export const invitePartner = ( data, token, lang, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}lucky-partners/send-invitation`,
            data,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

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

export const acceptPartnerInvite = ( data, token, lang, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}lucky-partners/accept-invitation?_method=patch`,
            data,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

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

export const rejectPartnerInvite = ( data, token, lang, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}lucky-partners/reject-invitation?_method=patch`,
            data,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

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

export const deletePartner = ( data, token, lang, currency ) => {
    return async(dispatch) => {
        await axios.post(`${CONST.url}lucky-partners/delete-invitation?_method=patch`,
            data,
            headerConfig(lang,currency,token)
        ).then( (response)=> {

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

