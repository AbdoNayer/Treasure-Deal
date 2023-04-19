import axios from "axios";
import CONST from "../consts";
import Toastify from "toastify-js";
import { t } from "i18next";
import { headerConfig } from "./axiosCalls";
import { notificationsReducer } from "../reducer/notificationsReducer";

export const getAllNotifications = ( lang, currency, token, type ) => {
    return async(dispatch) => {
        await axios.get(`${CONST.url}notifications/get-notifications?type=${type}`,
            headerConfig(lang, currency, token)
        ).then( (response)=> {

            const info = response.data.data.notifications;
            dispatch(notificationsReducer(info));

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