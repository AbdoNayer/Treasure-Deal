import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        id: '',
        first_name: '',
        last_name: '',
        full_name: '',
        email: '',
        email_verified: false,
        phone_verified: false,
        country_code: 0,
        phone: 0,
        full_phone: 0,
        profile_pic: '',
        horoscope_image: '',
        locale: 'en',
        dob: '',
        gender: 'Male',
        wallet_balance: 0,
        my_coins: 0,
        nationality_id: '',
        nationality_name: 'UAE',
        country_id: '',
        country_name: 'UAE',
        identification_type: '',
        identification_value: '',
        token: '',
        default_address: {
            id: '',
            is_default: '',
            type: '',
            building_name: '',
            street: '',
            apartment_number: '',
            floor: '',
            lat: '',
            lng: '',
            map_desc: '',
            additional_directions: ''
        }
    }
}

export const userSlice = createSlice({
    name : "user",
    initialState : { user : null },
    reducers : {
        loginReducer: (state, action) => {
            state.user = action.payload;
        },
        logoutReducer: (state) => {
            state.user = null;
        },
    },
});

export const { loginReducer, logoutReducer } = userSlice.actions;

export default userSlice.reducer;