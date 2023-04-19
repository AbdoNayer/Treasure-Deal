import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {TicketCheckerResult, ItemResult, LoadData} from "../../../components";
import { InputSelect } from "../../../components/Inputs/InputSelect";
import Link from "next/link";
import {getResultsMillionaire} from "../../../redux-toolkit/actions/axiosCalls";
import {useSelector} from "react-redux";
import {useApi} from "../../../hooks/useApi";
import {PrizePolicyRow} from "../../../components/PrizePolicyRow";
import {PrizePolicyTable} from "../../../components/PrizePolicyTable";
import {PreviousDraws} from "../../../components/ResultsCops/PreviousDraws";
import {DrawResult} from "../../../components/ResultsCops/DrawResult";


export default  function ResultMillionaireVoucher () {

    const { t }                             = useTranslation();
    const [ isActive, setIsActive]          = useState(false);
    const [ isAct, setIsAct]                = useState(false);
    const currency                               = useSelector((state) => state.currency.currency);
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const [dateValue,setDateValue] = useState('')
    const {
        data,
        isLoading,
        error,
        reFetch
    } = useApi(()=> getResultsMillionaire(user.token,langVal,currency))
    const [dataLoadComplete,setDataLoadComplete] = useState(!!data)

    const toggle = () => {
        setIsActive(false)
        setIsAct(!isAct);
    }

    useEffect(()=>{
        if (data) setDataLoadComplete(true)
    },[data])

    useEffect(()=>{
        if (dateValue) {
            reFetch(()=>getResultsMillionaire(user.token,langVal,currency,dateValue))
        }
    },[dateValue])

    if (!dataLoadComplete) return <LoadData/>
    return (
        <div className="py-5 container">
            <DrawResult
                data={data}
                dataLoading={isLoading}
                inVal={val=>setIsActive(val)}
                updateDate={val=>setDateValue(val.value)}
                resultType={'mill'}
                resultDescription={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio. Fugit iste asperiores repellendus voluptate omnis iusto officiis nam praesentium. Add your vouchers more you can play more lotto at the time.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,'}
            />
        </div>
    )
}