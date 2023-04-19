import { langReducer } from "../reducer/langReducer";
import Router from 'next/router'

export const chooseLang = (lang, i18n) => {
    return async(dispatch) => {

        dispatch(langReducer(lang));
        i18n.changeLanguage(lang);
        Router.reload(window.location.pathname);

        if(lang === 'ar'){
            document.documentElement.dir = 'rtl';
        }else{
            document.documentElement.dir = 'ltr';
        }

    }
};