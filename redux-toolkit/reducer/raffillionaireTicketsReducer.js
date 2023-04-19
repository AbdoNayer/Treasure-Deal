import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    raffillionaireTickets : {
        tickets: [
            {
                value: "123456",
                selected: false
            }
        ]
    }
}

export const raffillionaireTicketsSlice = createSlice({
    name: "raffillionaireTickets",
    initialState,
    reducers: {
        raffillionaireTicketsReducer: (state, action) => {
            state.raffillionaireTickets = action.payload;
        },
        resetRaffillionaireTicketsReducer: () => initialState
    },
});

export const { raffillionaireTicketsReducer,resetRaffillionaireTicketsReducer } = raffillionaireTicketsSlice.actions;

export default raffillionaireTicketsSlice.reducer;