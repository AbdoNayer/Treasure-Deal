import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lastMessage: [
        {
            "roomId": '',
            "message": '',
            "createdAt": '',
        }
    ]
}

export const chatLastMessageSlice = createSlice({
    name: "lastMessage",
    initialState,
    reducers: {
        chatLastMessageReducer: (state, action) => {
            state.lastMessage = action.payload;
        },
        resetChatLastMessageReducer: () => initialState,
    },
});

export const { chatLastMessageReducer,resetChatLastMessageReducer } = chatLastMessageSlice.actions;

export default chatLastMessageSlice.reducer;