import {locationReducer} from "../reducer/locationReducer";

export const getLocationAction = () => {
    return async (dispatch) => {
        if ("geolocation" in navigator) {
            await navigator.geolocation.getCurrentPosition(function(position) {
                const location = {
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                }
                dispatch(locationReducer(location))
            });
        }
    }
}
