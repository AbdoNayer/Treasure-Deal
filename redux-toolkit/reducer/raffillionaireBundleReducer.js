import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    raffillionaireBundle : {
        max_bundles: 5,
        price_per_bundle: '300.00',
        vouchers_per_bundle: 30,
        lines_per_bundle: 1,
        date: "29 December 2022",
        description: "raff description english",
        brief: "raff brief english",
        terms: "raff terrms english",
        cart_data: {},
        qty: 1,
    }
}

export const raffillionaireBundleSlice = createSlice({
    name: "raffillionaireBundle",
    initialState,
    reducers: {
        raffillionaireBundleReducer: (state, action) => {
            state.raffillionaireBundle = {
                ...state.raffillionaireBundle,
                ...action.payload
            };
        },
        addRaffillionaireBundleReducer: (state, action) => {
            state.raffillionaireBundle.qty = action.payload;
        },
        resetRaffillionaireBundleReducer: () => initialState
    },
});

export const { raffillionaireBundleReducer,addRaffillionaireBundleReducer,resetRaffillionaireBundleReducer } = raffillionaireBundleSlice.actions;

export default raffillionaireBundleSlice.reducer;