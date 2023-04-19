import {useState,useEffect,useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    callCart,
    editTicketRaffillionaire,
    getTicketsRaffillionaire,
    hideModalAction
} from "../../../redux-toolkit/actions";
import {useTranslation} from "react-i18next";
import {TicketCard} from "../../TicketCard";
import {LoadData} from "../../index";
import {useApi} from "../../../hooks/useApi";
import {getAllTickets} from "../../../redux-toolkit/actions/axiosCalls";
import io from "socket.io-client";
import {resetSelectedTicketsReducer} from "../../../redux-toolkit/reducer/selectedTicketsReducer";
import {t} from "i18next";
import Toastify from "toastify-js";

export const EditTicketModalForm = ({lineId,cartType,prevTicket,...props}) => {
    const { t }                                             = useTranslation();

    const dispatch = useDispatch();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const [filterType,setFilterType]                        = useState('all')
    const [isLoading,setIsLoading]                          = useState(true);
    const [isLoadData, setIsLoadData]                       = useState(false);
    const [allSelectedTickets,setAllSelectedTickets]        = useState([prevTicket])

    const didMount = useRef(false);
    const socket = io('https://treasuredeal.com:9090', {
        query: "id=" + user.id + "&user_type=User",
    });

    useEffect(()=>{
        const addListener = data => {
            console.log('selectLineRes', data.ticket)
            setAllSelectedTickets(prevState => prevState.includes(data.ticket) ? prevState : [...prevState,data.ticket])
        }
        const editListener = data => {
            console.log('editLineRes', data)
            setAllSelectedTickets(prevState => prevState.includes(data.ticket) ? prevState : [...prevState,data.ticket])
        }
        const deleteListener = data => {
            console.log('deleteLineRes', data)
            setAllSelectedTickets(prevState => prevState.filter(ticket=> ticket!==data.ticket))
        }
        const connectListener = data => {
            console.log('connect', 'connected to socket from web')
        }

        socket.once("connect", connectListener);
        socket.on("selectLineRes", addListener);
        socket.on("editLineRes", editListener);
        socket.on("deleteLineRes", deleteListener);
        return () => {
            socket.off("selectLineRes", addListener);
            socket.off("editLineRes", editListener);
            socket.off("deleteLineRes", deleteListener);
        }
    },[])

    const {
        data:ticketsData,
        isLoading:isTicketsLoading,
        reFetch:refetchTickets
    } = useApi(()=> getAllTickets(
        user.token,langVal,currency,cartType,filterType==='lucky'?'all':filterType,
        filterType==='lucky'?1:20,'',''
    ))
    useEffect(()=>{
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        refetchTickets()
    },[filterType])
    useEffect(()=>{
        if (ticketsData) {
            setIsLoading(false)
        }
    },[ticketsData])


    const socketAddTicket = ticket => {
        socket.emit('selectLine', {user_id:user.id,type:cartType,ticket:ticket})
    }
    const socketDeleteTicket = ticket => {
        socket.emit('deleteLine', {user_id:user.id,type:cartType,ticket:ticket})
    }
    const editTicket = async (ticket) => {
        if (allSelectedTickets.includes(ticket)) {
            Toastify({
                text: 'Ticket Already Selected',
                duration: 3000,
                gravity: "top",
                position: langVal === 'en' ? "left" : "right",
                style: {
                    background: "#F00",
                }
            }).showToast();
        }
        else {
            socketDeleteTicket(prevTicket)
            socketAddTicket(ticket)
            await dispatch(callCart(user.token,langVal,currency)).then(()=>dispatch(hideModalAction()))
        }
    }
    
    return (
        <div>
            <div className="td_filter_options">
                <div className='d-flex align-items-center justify-content-center mb-5'>
                    <button className={`btn-button mx-2 ${filterType === 'all' ? 'bgSecondColor' : 'bgGrayColor'}`} onClick={()=> setFilterType('all')}>
                        {t('All')}
                    </button>
                    <button className={`btn-button mx-2 ${filterType === 'odd' ? 'bgSecondColor' : 'bgGrayColor'}`} onClick={()=> setFilterType('odd')}>
                        {t('OOD')}
                    </button>
                    <button className={`btn-button mx-2 ${filterType === 'even' ? 'bgSecondColor' : 'bgGrayColor'}`} onClick={()=> setFilterType('even')}>
                        {t('EVEN')}
                    </button>
                    <button className={`btn-button mx-2 ${filterType === 'lucky' ? 'bgSecondColor' : 'bgGrayColor'}`} onClick={()=> setFilterType('lucky')}>
                        {t('MY LUCKY')}
                    </button>
                </div>
            </div>
            {(isTicketsLoading && isLoading) ? <div className='modal-height-view'>
                <LoadData />
            </div> : <div className="td_tickets">
                <div className="raffleillionaire">
                    <div
                        className={'d-flex align-items-center justify-content-center flex-wrap over-card-bundle raffillionaire-selected-tickets'}>
                        <div className='over-card-bundle d-flex flex-wrap'>
                            {ticketsData.tickets.map((item, i) => (
                                <TicketCard ticketMode={allSelectedTickets.includes(item.value) ? 'selected' : 'select'} isModal ticket={item.value} key={item.value}
                                            handleClick={() => editTicket(item.value)}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>}
            <button className={'btn-button bgMainColor d-table mb-4 mx-auto text-white'} disabled={isTicketsLoading} onClick={()=>refetchTickets()}>
                {isTicketsLoading
                    ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                    : <span>Refresh</span>
                }
            </button>
        </div>
    )
}