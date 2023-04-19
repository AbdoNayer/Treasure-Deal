import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartState:{
        carts: [
            {
                lines_per_bundle: 2,
                max_bundles: 12,
                cart_data: {
                    id: 1,
                    entry_type: "OneTime",
                    type: "millionaire",
                    draw_times: "4",
                    can_checkout: false,
                    qty: 1,
                    subscription_discount_per: 0,
                    subscription_id: 0,
                    subscription_months: 0,
                    discount_amount: 15,
                    sub_amount: "0"
                },
                lines: [
                    {
                        id: 1,
                        type: "",
                        luckynumber5: [],
                        luckynumber2: [],
                        setno: 1,
                        ticket: []
                    }
                ]
            }
        ],
        subscriptions:[{
            id: 0,
            months: 0,
            discount_per: 0,
            draw_times: 0
        }],
        total_qty: '0',
        total_amount: '0',
        vat_percentage: '5%',
        final_total: '0',
        total_discount: "0.00",
        total_sub_amount: "0.00"
    }
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        cartReducer: (state, action) => {
            state.cartState = {
                ...state.cartState,
                ...action.payload
            };
        },
        cartSubscriptions : (state,action) => {
          state.cartState.subscriptions = {
              ...state.cartState.subscriptions,
              ...action.payload
          }
        },
        resetCartReducer: () => initialState,
    },
});

export const { cartReducer,cartSubscriptions,resetCartReducer } = cartSlice.actions;

export default cartSlice.reducer;