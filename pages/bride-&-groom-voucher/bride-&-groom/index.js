import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {getTicketDetails} from "../../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../../hooks/useApi";
import {LoadData} from "../../../components";
import BuyTicketsComp from "../../../components/BuyTicketsComp";
import {useEffect, useState} from "react";

export default  function BrideGroom ({...props}) {
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);
    const langVal                                       = useSelector((state) => state.language.language);
    const { t }                                         = useTranslation();
    const [loadData,setLoadData]                        = useState(true)
    const {
        data:typeDetails,
        isLoading:isTypeLoading,
        reFetch:refetchType
    } = useApi(()=> getTicketDetails(user.token,langVal,currency,'bride_groom'))
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
                type={'bride_groom'}
                typeName={'Bride & Groom'}
                typeDetails={typeDetails}
                backgroundImgClass={'BG-6'}
            />
        </div>
    )
}