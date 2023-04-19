import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chat: {
        "room": {
            "id": 0
        },
        "members": [
            {
                "id": 0,
                "type": "",
                "name": "",
                "profile_pic": "",
                "logo": ""
            }
        ],
        "messages": {
            "pagination": {
                "total_items": 0,
                "count_items": 0,
                "per_page": 0,
                "total_pages": 0,
                "current_page": 0,
                "next_page_url": "",
                "perv_page_url": ""
            },
            "data": []
        }
    }
}

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        chatReducer: (state, action) => {
            state.chat = action.payload;
        },
        resetChatReducer: () => initialState,
    },
});

export const { chatReducer,resetChatReducer } = chatSlice.actions;

export default chatSlice.reducer;