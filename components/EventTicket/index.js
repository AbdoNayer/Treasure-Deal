import {InputSelect} from "../Inputs/InputSelect";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";

export const EventTicket = ({ticket,selectedTickets,setSelectedTickets,...props}) => {
    const { t }              = useTranslation();
    const currency                                      = useSelector((state) => state.currency.currency);
    const [showTicketDetails,setShowTicketDetails]      = useState(false)
    const [ticketAmount,setTicketAmount]                = useState(0)
    const [errorMessage,setErrorMessage]                = useState('')
    const count = [
        '1', '2', '3'
    ]
    const selectTicketHandler = () => {
        if (ticketAmount === 0) {
            setErrorMessage(t('app.selectTicketsFirst'))
        }
        else {
            setSelectedTickets(prevState =>
                prevState.find(obj => obj.id === ticket.id)
                    ? prevState.filter(obj => obj.id !== ticket.id)
                    : [...prevState,{id:ticket.id,qty:ticketAmount,price:ticket.price}]
            )
        }
    }
    useEffect(()=>{
        if (ticketAmount > 0) setErrorMessage('')
    },[ticketAmount])

    return (
        <div className='rounded-3 my-3' {...props}>
            <div onClick={()=> setShowTicketDetails(!showTicketDetails)}
                 className={`${selectedTickets.find(obj => obj.id === ticket.id) ? 'bgMainColor text-white' : 'bgSecondColor'} head-it-block p-3 d-flex justify-content-between align-items-center`}>
                <h6>{ticket.title} - {currency + ' ' + ticket.price}</h6>
                <i className={`${showTicketDetails ? 'rotate' : ''} icon-chevron-down fs-2`}/>
            </div>
            {
                showTicketDetails ?
                    <div className='p-3 border border-top-0'>
                        <div className='bg-white'>
                            <p className='small-font-13'>{ticket.description}</p>
                            <h6 className='my-4'>{currency + ' ' + ticket.price} Each</h6>
                        </div>
                        <div className='d-flex justify-content-between align-items-center'>
                            <button
                                className={`${selectedTickets.find(obj => obj.id === ticket.id) ? 'bgMainColor text-white' : 'bgSecondColor text-black'} btn-button w-auto px-4 border-5`}
                                onClick={selectTicketHandler}>
                                {selectedTickets.find(obj => obj.id === ticket.id) ? t('app.remove') : t('hotel.form.select')}
                            </button>
                            <div className='select-active text-center'>
                                <span className='small-font-12'>{t('app.numberTickets')}</span>
                                <InputSelect
                                    isDisabled={selectedTickets.find(obj => obj.id === ticket.id)}
                                    className='m-auto d-table'
                                    onChange={e => setTicketAmount(e.value)}
                                    defaultValue={ticketAmount? ({label:ticketAmount,value:ticketAmount}) :undefined}
                                    options={count.map(count => ({
                                        label   : count,
                                        value   : count
                                    }))}
                                />
                            </div>
                        </div>
                        {errorMessage && <h6 className={'text-danger'}>{errorMessage}</h6>}
                    </div>
                    :
                    null
            }
        </div>
    )
}