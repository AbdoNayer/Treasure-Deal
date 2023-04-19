import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
    name: "modal",
    initialState: {
        isActive:false,
        content:null,
    },
    reducers:{
        showModalReducer:(state,action)=>{
            state.content = action.payload
            state.isActive = true
        },
        hideModalReducer:(state)=>{
            state.content = null
            state.isActive = false
        }
    }
})

export const { showModalReducer, hideModalReducer } = modalSlice.actions;

export default modalSlice.reducer;