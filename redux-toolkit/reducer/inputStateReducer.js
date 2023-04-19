import { createSlice } from "@reduxjs/toolkit";

export const inputStateSlice = createSlice({
    name: "inputState",
    initialState: {state:'input-start'},
    reducers:{
        setInputState:(state,action)=>{
            state.state = action.payload
        },
    }
})

export const { setInputState } = inputStateSlice.actions;

export default inputStateSlice.reducer;