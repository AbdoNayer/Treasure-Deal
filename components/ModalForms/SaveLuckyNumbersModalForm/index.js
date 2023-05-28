import {InputText} from "../../Inputs/InputText";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {hideModalAction, saveLuckyNumberMillionaire} from "../../../redux-toolkit/actions";
import {useEffect, useState} from "react";

export const SaveLuckyNumbersModalForm = ({luckynumber5,luckynumber2,...props}) => {
  const { t }                                   = useTranslation();
  const dispatch                                = useDispatch();
  const user                                    = useSelector((state) => state.user.user);
  const langVal                                 = useSelector((state) => state.language.language);
  const currency                                          = useSelector((state) => state.currency.currency);
  const [inputValue,setInputValue] = useState('')
  const [errorMessage,setErrorMessage] = useState('')
  const [isLoading,setIsLoading] = useState(false)

  const saveLuckyNumber = () => {
  setIsLoading(true);
    if (inputValue!=='') {
      dispatch(saveLuckyNumberMillionaire({
        luckynumber5: JSON.stringify(luckynumber5),
        luckynumber2: JSON.stringify(luckynumber2),
        name:inputValue
      },user.token,langVal,currency))
          .then(()=> {
              setIsLoading(false)
              dispatch(hideModalAction())
          })
    } else {
      setErrorMessage('Please Enter name')
      setIsLoading(false)
    }
  }
  return (
      <div>
          <label>{t('millionaire.lotto.pop_ups.save_favorite.saveFavouriteLabel')}</label>
        <div className="d-flex align-items-center mb-5 mt-3">
            <InputText
              placeholder={t('millionaire.lotto.pop_ups.save_favorite.saveFavouritePlaceholder')}
              onChange={e=> setInputValue(e.target.value)}
              errorMessage={errorMessage}
            />
            <button disabled={isLoading} className={'btn-button bgMainColor text-white d-table mx-3'} onClick={saveLuckyNumber}>
                {isLoading
                    ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                    : <span>{t('millionaire.lotto.pop_ups.save_favorite.saveFavouriteButton')}</span>
                }
            </button>
        </div>
      </div>
  )
}