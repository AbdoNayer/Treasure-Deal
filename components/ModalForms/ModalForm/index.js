import {useDispatch} from "react-redux";
import {hideModalAction} from "../../../redux-toolkit/actions";
import {useState} from "react";
import {useTranslation} from "react-i18next";

export const ModalForm = ({title,applyButton,applyText='',applyFunction,children,...props}) => {
    const dispatch = useDispatch();
    const { t }                                             = useTranslation();
    const [isLoading,setIsLoading] = useState(false)
    const handleClick = () => {
        setIsLoading(true)
        applyFunction().then(()=> setIsLoading(false))
    }
  return (
      <div {...props} className={'td-modal-form'}>
          <h5 className="p-4 bgSecondColor fw-light m-0">{title}</h5>
          <div className="td-modal-form-body">
              {children}
          </div>
          <div className="td-modal-form-footer p-4">
              <button className={'btn-button bgSecondColor d-table text-black'} onClick={()=>dispatch(hideModalAction())}>{t('modal_pop_up.close')}</button>
              {applyButton && <button disabled={isLoading} onClick={handleClick} className={'btn-button bgMainColor ms-2 d-table text-white'}>
                  {isLoading
                      ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                      : <>{applyText}</>
                  }
              </button>}
          </div>
      </div>
  )
}