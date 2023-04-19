import {LuckyNumbersCard} from "../../LuckyNumbersCard";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {editLineMillionaire, hideModalAction} from "../../../redux-toolkit/actions";
import {useRouter} from "next/router";

export const EditLuckyNumberModalForm = ({selectedLines,lineId}) => {
    const millionLinesInfo                                  = useSelector((state) => state.linesMillionair.millionLines);
    const dispatch                                          = useDispatch();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const router                                            = useRouter();
    const [editCounter,setEditCounter]                      = useState(0)
    const [favCounter,setFavCounter]                        = useState(0)
    const [selectedLucky,setSelectedLucky]                  = useState({luckynumber5:[],luckynumber2:[]})
    const [isLoading,setIsLoading]                          = useState(false);

    const updateLine = (lucky5,lucky2) => {
        setIsLoading(true)
        const editData = {
            line_id:JSON.stringify(lineId),
            numbers5:JSON.stringify(lucky5),
            numbers2:JSON.stringify(lucky2)
        }
        dispatch(editLineMillionaire(editData,user.token,router,langVal,currency)).then(()=>{
            setIsLoading(false)
            dispatch(hideModalAction())
        })
    }

    const handleRadioOnChange = (target) => {
        setSelectedLucky(millionLinesInfo.lucky_numbers.find(lucky => lucky.name === target));
        setFavCounter(favCounter+1)
    }

    return (
        <div className={'td-edit-lucky-nums-wrapper'}>
          <div className={'d-flex align-items-center justify-content-between row'}>
              <div className="col-md-6 col-xs-12">
                    {millionLinesInfo.lucky_numbers.length > 0 && <div className="td-edit-lucky-nums-wrapper-radio-select w-100">
                        <h6 className="fw-light text-center">Select saved lucky number</h6>
                        <div className="td-radio-wrapper">
                            {millionLinesInfo.lucky_numbers.map(lucky =>
                                <div key={lucky.id} className={'td-select-lucky-number d-flex align-items-center mb-3 me-1'}>
                                        <input 
                                            type={"radio"} id={lucky.name} 
                                            name={'lucky_nums'} 
                                            className={'me-2'}
                                            value={lucky.name} 
                                            onChange={e => handleRadioOnChange(e.target.value)}
                                        />
                                    <label htmlFor={lucky.name} className={'fs-6'}>{lucky.name}</label>
                                </div>
                            )}
                        </div>
                    </div>}
              </div>
              <div className={`${millionLinesInfo.lucky_numbers.length > 0 && 'col-md-6'} col-xs-12`}>
                    <LuckyNumbersCard
                        modalMode
                        favCounter={favCounter}
                        modalFavNums={[selectedLucky.luckynumber5,selectedLucky.luckynumber2]}
                        editCounter={editCounter}
                        callEditFunction={updateLine}
                        selectedLines={selectedLines}
                        className={'td-lucky-card my-4 m-auto'}
                    />
              </div>
          </div>
          <button className={'btn-button bgMainColor d-table mb-4 mx-auto text-white'} onClick={()=>setEditCounter(editCounter+1)}>
              {isLoading
                  ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                  : <span>Apply</span>
              }

          </button>
        </div>
  )
}