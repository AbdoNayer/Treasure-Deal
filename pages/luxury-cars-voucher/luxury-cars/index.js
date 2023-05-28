import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useApi} from "../../../hooks/useApi";
import {getTicketDetails} from "../../../redux-toolkit/actions/axiosCalls";
import {LoadData} from "../../../components";
import BuyTicketsComp from "../../../components/BuyTicketsComp";
import { useRouter } from "next/router";

export default  function LuxuryCars ({...props}) {
    const router                                            = useRouter();
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);
    const langVal                                       = useSelector((state) => state.language.language);
    const { t }                                         = useTranslation();
    const [loadData,setLoadData]                        = useState(true)

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    const {
        data:typeDetails,
        isLoading:isTypeLoading,
        reFetch:refetchType
    } = useApi(()=> getTicketDetails(user.token,langVal,currency,'luxury_cars'), user !== null)
    useEffect(()=>{
        if (typeDetails) {
            setLoadData(false)
        }
    },[typeDetails])

    if (isTypeLoading && loadData) return <LoadData/>

    if(user === null) return null;
    return (
        <div>
            <BuyTicketsComp
                selectedTickets={typeDetails.selected_lines.map(e=> e.ticket.join(''))}
                refetchType={refetchType}
                type={'luxury_cars'}
                typeName={'Luxury Cars'}
                typeDetails={typeDetails}
                backgroundImgClass={'BG-3'}
            />
        </div>
    )
}
