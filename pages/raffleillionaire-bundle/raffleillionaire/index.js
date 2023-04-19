import {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {LoadData} from "../../../components";
import {useSelector} from "react-redux";
import {useApi} from "../../../hooks/useApi";
import {getTicketDetails} from "../../../redux-toolkit/actions/axiosCalls";
import BuyTicketsComp from "../../../components/BuyTicketsComp";

export default function Raffleillionaire() {
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);
    const langVal                                       = useSelector((state) => state.language.language);
    const { t }                                         = useTranslation();
    const [loadData,setLoadData]                        = useState(true)
    const {
        data:typeDetails,
        isLoading:isTypeLoading,
        reFetch:refetchType
    } = useApi(()=> getTicketDetails(user.token,langVal,currency,'raffleillionaire'))
    useEffect(()=>{
        if (typeDetails) {
            setLoadData(false)
        }
    },[typeDetails])

    if (isTypeLoading && loadData) return <LoadData/>
    return (
        <div>
            <BuyTicketsComp
                selectedTickets={typeDetails.selected_lines.map(e=> e.ticket.join(''))}
                refetchType={refetchType}
                type={'raffleillionaire'}
                typeName={'Raffleillionaire'}
                typeDetails={typeDetails}
                backgroundImgClass={'BG-2'}
            />
        </div>
  )
}