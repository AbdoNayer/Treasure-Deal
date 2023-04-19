import {setInputState} from "../reducer/inputStateReducer";

export const setInputStateAction = (data) => {
    return (dispatch) => {
        dispatch(setInputState(data))
    }
}