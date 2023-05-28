import { combineReducers } from 'redux';
import userReducer from "../reducer/userReducer";
import langReducer from "../reducer/langReducer";
import countriesReducer from "../reducer/countriesReducer";
import uiReducer from "../reducer/uiReducer";
import inputStateReducer from "./inputStateReducer";
import millionVoucher from "./millionVoucherReducer";
import linesMillionair from "./linesMillionaireReducer";
import cartReducer from "./cartReducer";
import raffillionaireBundleReducer from "./raffillionaireBundleReducer";
import raffillionaireLinesReducer from "./raffillionaireLinesReducer";
import raffillionaireTicketsReducer from "./raffillionaireTicketsReducer";
import partnersReducer from "./partnersReducer";
import locationReducer from "./locationReducer";
import currencyReducer from "./currencyReducer";
import notificationsReducer from "./notificationsReducer";
import selectedTicketsReducer from "./selectedTicketsReducer";
import chatReducer from "../reducer/chatReducer";
import chatLastMessageReducer from "../reducer/chatLastMessageReducer";

export default combineReducers({
    user                    : userReducer,
    language                : langReducer,
    currency                : currencyReducer,
    countries               : countriesReducer,
    ui                      : uiReducer,
    inputState              : inputStateReducer,
    millionVoucher          : millionVoucher,
    linesMillionair         : linesMillionair,
    cart                    : cartReducer,
    location                : locationReducer,
    raffillionaireBundle    : raffillionaireBundleReducer,
    raffillionaireLines     : raffillionaireLinesReducer,
    raffillionaireTickets   : raffillionaireTicketsReducer,
    partners                : partnersReducer,
    selectedTickets         : selectedTicketsReducer,
    notifications           : notificationsReducer,
    lastMessage             : chatLastMessageReducer,
    chat                    : chatReducer,
});