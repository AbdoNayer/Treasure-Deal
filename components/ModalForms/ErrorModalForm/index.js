import {useDispatch} from "react-redux";
import {hideModalAction} from "../../../redux-toolkit/actions";

export const ErrorModalForm = ({title,message,buttonMessage='ok'}) => {
    const dispatch = useDispatch();
  return (
      <div className={'td-error-modal-form d-flex flex-column align-items-center'}>
          <div className="td-error-modal-form-logo text-center mb-2">
              <i className="icon-x-circle text-danger"></i>
          </div>
          <h4 className="td-error-modal-form-title my-2">{title}</h4>
          <p className="td-error-modal-form-message my-2">{message}</p>
          <button onClick={()=>dispatch(hideModalAction())}
              className="td-error-modal-form-button mt-4 btn-button bgBlueColor text-white d-flex align-items-center justify-content-center">
              {buttonMessage}
          </button>
      </div>
  )
}