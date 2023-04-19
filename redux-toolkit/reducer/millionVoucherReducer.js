import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    millionVoucher : {
        max_bundles: 1,
        price_per_bundle: 10,
        vouchers_per_bundle: 5,
        lines_per_bundle: 2,
        date: "29 December 2022",
        description: "mill description english",
        brief: "mill brief english",
        terms: "mill terrms english",
        cart_data: {},
        qty: 1,
    }
}

export const millionVoucherSlice = createSlice({
    name: "millionVoucher",
    initialState,
    reducers: {
        millionVoucherReducer: (state, action) => {
            state.millionVoucher = {
                ...state.millionVoucher,
                ...action.payload
            };
        },
        addMillionVoucherBundleReducer: (state, action) => {
            state.millionVoucher.qty = action.payload;
        },
        resetMillionVoucherReducer: () => initialState
    },
});

export const { millionVoucherReducer,addMillionVoucherBundleReducer,resetMillionVoucherReducer } = millionVoucherSlice.actions;

export default millionVoucherSlice.reducer;