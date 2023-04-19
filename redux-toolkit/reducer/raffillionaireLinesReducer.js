import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    raffillionaireLines : {
        lines_per_bundle: 1,
        max_bundles: 12,
        prize_date: "2023-03-28 15:12:50",
        date: "2023-03-28 15:12:50",
        description: "raff description english",
        brief: "raff brief english",
        terms: "raff terrms english",
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
        selected_lines:[
            {
                id: 0,
                cart_id: 0,
                type: "raffleillionaire",
                luckynumber5: [],
                luckynumber2: [],
                ticket: []
            }
        ],
        selected_tickets:[],
        others_selected_lines: []
    }
}

export const raffillionaireLinesSlice = createSlice({
    name: "raffillionaireLines",
    initialState,
    reducers: {
        raffillionaireLinesReducer: (state, action) => {
            state.raffillionaireLines = {
                ...state.raffillionaireLines,
                ...action.payload,
            }
        },
        addRaffillionaireSelectedTicketReducer: (state, action) => {
            state.raffillionaireLines.selected_tickets =
                [...state.raffillionaireLines.selected_tickets,action.payload]
        },
        removeRaffillionaireSelectedTicketReducer: (state, action) => {
            state.raffillionaireLines.selected_tickets =
                state.raffillionaireLines.selected_tickets.filter(ticket=> ticket!==action.payload)
        },
        resetRaffillionaireLinesReducer: () => initialState
    },
});

export const { raffillionaireLinesReducer,addRaffillionaireSelectedTicketReducer,removeRaffillionaireSelectedTicketReducer,resetRaffillionaireLinesReducer } = raffillionaireLinesSlice.actions;

export default raffillionaireLinesSlice.reducer;