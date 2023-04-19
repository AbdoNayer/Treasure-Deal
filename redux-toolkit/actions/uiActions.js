import {hideModalReducer, showModalReducer} from "../reducer/uiReducer";

export const showModalAction = (data) => {
    return (dispatch) => {
        dispatch(showModalReducer(data))
    }
}
export const hideModalAction = () => {
    return (dispatch) => {
        dispatch(hideModalReducer())
    }
}