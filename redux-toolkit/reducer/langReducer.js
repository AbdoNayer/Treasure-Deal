import { createSlice } from "@reduxjs/toolkit";

export const langSlice = createSlice({
    name: "language",
    initialState: { language : null },
    reducers: {
        langReducer: (state, action) => {
            state.language = action.payload;
        },
    },
});

export const { langReducer } = langSlice.actions;

export default langSlice.reducer;