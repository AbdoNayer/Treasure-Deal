import { createSlice } from "@reduxjs/toolkit";

export const currencySlice = createSlice({
    name: "currency",
    initialState: { currency : null, currencies: ['1','2','3'] },
    reducers: {
        currencyReducer: (state, action) => {
            state.currency = action.payload;
        },
        allCurrenciesReducer: (state,action) => {
            state.currencies = action.payload
        }
    },
});

export const { currencyReducer,allCurrenciesReducer } = currencySlice.actions;

export default currencySlice.reducer;