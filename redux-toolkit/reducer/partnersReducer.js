import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    invitations: [
        {
            id: 0,
            user_id: 0,
            email: '',
            name: ''
        }
    ]
}

export const partnerSlice = createSlice({
    name : "partners",
    initialState,
    reducers : {
        partnersReducer: (state, action) => {
            state.invitations = action.payload;
        },
        resetPartners: () => initialState,
    },
});

export const { partnersReducer, resetPartners } = partnerSlice.actions;

export default partnerSlice.reducer;