import {DrawResult} from "../../../components/ResultsCops/DrawResult";
import {LoadData} from "../../../components";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useApi} from "../../../hooks/useApi";
import {getResultsRaffellionaire} from "../../../redux-toolkit/actions/axiosCalls";
import { useRouter } from "next/router";

export default function BrideGroomDraw ({...props}) {
    const router                                            = useRouter();
    const { t }                             = useTranslation();
    const [ isActive, setIsActive]          = useState(false);
    const [ isAct, setIsAct]                = useState(false);
    const user                              = useSelector((state) => state.user.user);
    const langVal                           = useSelector((state) => state.language.language);
    const currency                          = useSelector((state) => state.currency.currency);
    const [dateValue,setDateValue]          = useState('')

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    const {
        data,
        isLoading,
        error,
        reFetch
    } = useApi(()=> getResultsRaffellionaire(user.token,langVal,currency,'','bride_groom'), user !== null)
    const [dataLoadComplete,setDataLoadComplete] = useState(!!data)

    // const toggle = () => {
    //     setIsActive(false)
    //     setIsAct(!isAct);
    // }

    useEffect(()=>{
        if (data) setDataLoadComplete(true)
    },[data])

    useEffect(()=>{
        if (dateValue) {
            reFetch(()=>getResultsRaffellionaire(user.token,langVal,currency,dateValue,'bride_groom'))
        }
    },[dateValue])


    if (!dataLoadComplete) return <LoadData/>

    if(user === null) return null;
    return (
        <div className="py-5 container">
            <DrawResult
                data={data}
                dataLoading={isLoading}
                inVal={val=>setIsActive(val)}
                updateDate={val=>setDateValue(val.value)}
                resultType={'raff'}
                resultDescription={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio. Fugit iste asperiores repellendus voluptate omnis iusto officiis nam praesentium. Add your vouchers more you can play more lotto at the time.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,'}
            />
        </div>
    )
}