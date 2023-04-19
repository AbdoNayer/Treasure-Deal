import { createSlice } from "@reduxjs/toolkit";

export const countriesSlice = createSlice({
    name: "countries",
    initialState: { countries : [] },
    reducers: {
        countriesReducer: (state, action) => {
            state.countries = action.payload;
        },
    },
});

export const { countriesReducer } = countriesSlice.actions;

export default countriesSlice.reducer;