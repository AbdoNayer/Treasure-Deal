import {InputText} from "../../Inputs/InputText";
import {LuckyNumbersCard} from "../../LuckyNumbersCard";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {editLineMillionaire, hideModalAction, selectLinesMillionaire} from "../../../redux-toolkit/actions";
import {updateLuckyNumbers} from "../../../redux-toolkit/actions/axiosCalls";

export const UpdateFavoriteLuckyModalForm = ({selectedLines,lineId,name,...props}) => {
    const dispatch                                          = useDispatch();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const router                                            = useRouter();
    const [editCounter,setEditCounter]                      = useState(0)
    const [isLoading,setIsLoading]                          = useState(false);
    const [luckyName,setLuckyName]                          = useState(name)
    const currency                                          = useSelector((state) => state.currency.currency);


    const updateLine = (lucky5,lucky2) => {
        setIsLoading(true)
        const editData = {
            luckynumber5:JSON.stringify([...lucky5].sort((a,b)=>a-b)),
            luckynumber2:JSON.stringify([...lucky2].sort((a,b)=>a-b)),
            name:luckyName,
            number_id:lineId
        }
        updateLuckyNumbers(editData,user.token,langVal,currency).then(async ()=>{
            await dispatch(selectLinesMillionaire(user.token,langVal,currency))
            setIsLoading(false)
            dispatch(hideModalAction())
        })
        // dispatch(editLineMillionaire(editData,user.token,router,langVal,currency)).then(()=>{
        //     setIsLoading(false)
        //     dispatch(hideModalAction())
        // })
    }

    return (
        <div>
            <InputText
                label={'Lucky Number Name'}
                defaultValue={name}
                onChange={e=>setLuckyName(e.target.value)}
            />
            <LuckyNumbersCard
                modalMode
                editCounter={editCounter}
                callEditFunction={updateLine}
                selectedLines={selectedLines}
                className={'td-lucky-card my-4 m-auto'}
            />
            <button className={'btn-button bgMainColor d-table mb-4 mx-auto text-white'} onClick={()=>setEditCounter(editCounter+1)}>
                {isLoading
                    ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                    : <span>Apply</span>
                }
            </button>
        </div>
    )
}