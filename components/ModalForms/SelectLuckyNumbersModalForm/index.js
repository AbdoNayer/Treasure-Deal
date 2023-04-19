import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {hideModalAction} from "../../../redux-toolkit/actions";

export const SelectLuckyNumbersModalForm = ({saveActiveNums,...props}) => {
    const millionLinesInfo                                  = useSelector((state) => state.linesMillionair.millionLines);
    const [isLoading,setIsLoading] = useState(false)
    const [selectedLucky,setSelectedLucky] = useState('')
    const { t }                                   = useTranslation();
    const dispatch                                = useDispatch();

    const filterLucky = () => {
        setIsLoading(true)
        const favouriteNumber =  millionLinesInfo.lucky_numbers.find(lucky => lucky.name === selectedLucky);
        saveActiveNums(favouriteNumber.luckynumber5,favouriteNumber.luckynumber2)
        setIsLoading(false)
        dispatch(hideModalAction())
    }

    return (
        <div>
          <div className='d-flex flex-wrap'>
              {millionLinesInfo.lucky_numbers.map((lucky,idx)=>
                  (
                      <div key={idx} className={'td-select-lucky-number d-flex align-items-center mb-3 me-3'}>
                        <input type={"radio"} id={lucky.name} name={'lucky_nums'} className={'me-2'} value={lucky.name} onChange={e=> setSelectedLucky(e.target.value)} />
                        <label htmlFor={lucky.name} className={'fs-6'}>{lucky.name}</label>
                      </div>
                  )
              )}
          </div>
          <button disabled={isLoading} className={'btn-button bgMainColor mx-auto text-white d-table mb-4'} onClick={filterLucky}>
              {isLoading
                  ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                  : <span>{t('millionaire.lotto.pop_ups.load_favourite.loadFavouriteButton')}</span>
              }
          </button>
        </div>
  )
}