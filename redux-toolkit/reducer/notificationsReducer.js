import { createSlice } from "@reduxjs/toolkit";

export const notificationsSlice = createSlice({
    name: "notifications",
    initialState: { notifications : [] },
    reducers: {
        notificationsReducer: (state, action) => {
            state.notifications = action.payload;
        },
    },
});

export const { notificationsReducer } = notificationsSlice.actions;

export default notificationsSlice.reducer;