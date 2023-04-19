import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    default_address: {
        id:'',
        is_default:'',
        type:"",
        building_name:"",
        street:"",
        apartment_number:"",
        floor:"",
        lat:"",
        lng:"",
        map_desc:"",
        additional_directions:"",
    },
    location:{
        lat:'',
        long:'',
    }
}

export const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        locationReducer: (state, action) => {
            state.location = {
                ...state.location,
                ...action.payload
            };
        },
        defaultAddressReducer: (state, action) => {
            state.default_address = {
                ...state.default_address,
                ...action.payload
            };
        },
        resetLocationReducer: () => initialState,
    },
});

export const { locationReducer,resetLocationReducer,defaultAddressReducer } = locationSlice.actions;

export default locationSlice.reducer;