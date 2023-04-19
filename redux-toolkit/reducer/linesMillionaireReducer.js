import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    millionLines : {
        lines_per_bundle: 1,
        max_bundles: 12,
        prize_date: "2023-03-28 15:12:50",
        prize_value: 1000,
        lucky_numbers: [],
        cart_data: {
            id: 0,
            entry_type: "",
            type: "",
            draws: "",
            qty: 1,
            total_draws: "",
            total_lines: "",
            subscription: 0,
            auto_renew: 0,
            discount_per: "00.00",
            discount_amount: "0.00",
            amount: "0.00",
        },
        selected_lines:[]
    }
}

export const millionLinesSlice = createSlice({
    name: "millionLines",
    initialState,
    reducers: {
        millionLinesReducer: (state, action) => {
            state.millionLines = action.payload;
        },
        resetMillionLinesReducer: () => initialState
    },
});

export const { millionLinesReducer,resetMillionLinesReducer } = millionLinesSlice.actions;

export default millionLinesSlice.reducer;