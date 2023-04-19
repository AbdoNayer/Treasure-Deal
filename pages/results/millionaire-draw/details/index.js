import React, {useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import {LoadData} from "../../../../components";
import {useRouter} from "next/router";
import {useApi} from "../../../../hooks/useApi";
import {getMillionaireDrawDetails} from "../../../../redux-toolkit/actions/axiosCalls";
import {useSelector} from "react-redux";
import {DrawResultDetails} from "../../../../components/ResultsCops/DrawResultDetails";

export default  function MillionaireDetails() {
    const router                                            = useRouter();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                               = useSelector((state) => state.currency.currency);
    const {draw_id} = router.query

    const {
        data,
        isLoading,
        reFetch
    } = useApi(()=>  getMillionaireDrawDetails(user.token,langVal,currency,draw_id),router.isReady)

    useEffect(()=>{
        if (draw_id) reFetch(()=>  getMillionaireDrawDetails(user.token,langVal,currency,draw_id))
    },[draw_id])

    if (isLoading) return <LoadData/>
    return (
        <div className="py-5 container">
            <DrawResultDetails
                detailsData={data}
                detailsDescription={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio. Fugit iste asperiores repellendus voluptate omnis iusto officiis nam praesentium. Add your vouchers more you can play more lotto at the time.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,'}
                detailsType={'mill'}
            />
        </div>
    )
}