import Router from 'next/router'
import {allCurrenciesReducer, currencyReducer} from "../reducer/currencyReducer";

export const chooseCurrency = (currency) => {
    return async(dispatch) => {
        dispatch(currencyReducer(currency));
        Router.reload(window.location.pathname);
    }
};
export const addAllCurrencies = (currency) => {
    return async(dispatch) => {
        dispatch(allCurrenciesReducer(currency));
    }
};