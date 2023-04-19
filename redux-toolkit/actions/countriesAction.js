import axios from "axios";
import CONST from "../consts";
import { countriesReducer } from "../reducer/countriesReducer";
import { headerConfig } from "./axiosCalls";

export const countries = ( lang, currency ) => {
    return async(dispatch) => {
        await axios.get(`${CONST.url}countries`, headerConfig(lang,currency)).then( (response)=> {

            const dataUser = response.data.data.countries;
            dispatch(countriesReducer(dataUser))

        }).catch(err => {
            
            console.log('err', err.response.data.data.errors);

        });
    }
};
