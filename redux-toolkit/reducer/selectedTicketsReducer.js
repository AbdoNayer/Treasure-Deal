import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedTickets : {
        selected_tickets:[],
    }
}

export const selectedTickets = createSlice({
    name: "selectedTickets",
    initialState,
    reducers: {
        addSelectedTicketReducer: (state, action) => {
            state.selectedTickets.selected_tickets =
                [...state.selectedTickets.selected_tickets,action.payload]
        },
        removeSelectedTicketReducer: (state, action) => {
            state.selectedTickets.selected_tickets =
                state.selectedTickets.selected_tickets.filter(ticket=> ticket!==action.payload)
        },
        resetSelectedTicketsReducer: () => initialState
    },
});

export const { addSelectedTicketReducer,removeSelectedTicketReducer,resetSelectedTicketsReducer } = selectedTickets.actions;

export default selectedTickets.reducer;