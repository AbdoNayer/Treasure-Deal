import {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {LoadData} from "../../../components";
import {useSelector} from "react-redux";
import {useApi} from "../../../hooks/useApi";
import {getTicketDetails} from "../../../redux-toolkit/actions/axiosCalls";
import BuyTicketsComp from "../../../components/BuyTicketsComp";
import { useRouter } from "next/router";
import io from "socket.io-client";

export default function Raffleillionaire() {
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);
    const langVal                                       = useSelector((state) => state.language.language);
    const { t }                                         = useTranslation();
    const [loadData,setLoadData]                        = useState(true)
    const router                                            = useRouter();

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    const socket = io('https://treasuredeal.com:9090', {
        transports      : ['websocket'],
        query: "id=" + user?.id + "&user_type=User",
    });


    const {
        data:typeDetails,
        isLoading:isTypeLoading,
        reFetch:refetchType
    } = useApi(()=> getTicketDetails(user.token,langVal,currency,'raffleillionaire'), user !== null)
    useEffect(()=>{
        if (typeDetails) {
            setLoadData(false)
        }
    },[typeDetails])

    if (isTypeLoading && loadData) return <LoadData/>

    if(!user) return null;
    return (
        <div>
            <BuyTicketsComp
                socket={socket}
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