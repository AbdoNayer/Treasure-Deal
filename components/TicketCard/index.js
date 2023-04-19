import { t } from "i18next";
import {useState} from "react";

export const TicketCard = ({handleClick,ticket,ticketValue,ticketId,ticketMode,isModal=false,...props}) => {
    const [isLoading,setIsLoading] = useState(false)
    const clickHandler = () =>{
        if (!handleClick) return
        setIsLoading(true)
        handleClick(ticket).then(()=>setIsLoading(false)).catch(e=> setIsLoading(false))
        // if (ticketMode==='delete') handleClick(ticketId).then(()=>setIsLoading(false)).catch(e=> setIsLoading(false))
        // if (ticketMode==='select') handleClick(ticket).then(()=>setIsLoading(false)).catch(e=> setIsLoading(false))
    }
  return (

      <div className={`card-bun text-center position-relative ${ticketMode==='delete' && 'active'} ${isModal && 'card-bun-modal'}`} onClick={clickHandler} {...props}>
          {isLoading && ticketMode==='select' &&
              <div className='is-over d-flex align-items-center justify-content-center w-100 h-100'>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
              </div>
          }
          {ticketMode==='selected' &&
              <div className='is-over d-flex align-items-center justify-content-center w-100 h-100'/>
          }
          {ticketMode==='delete' &&
              (isLoading
                  ? <button className="spinner-border spinner-border-sm text-white bg-transparent" role="status" aria-hidden="true" />
                  : <button disabled={isLoading} onClick={()=>clickHandler} className='icon-x' />
              )
          }
          <span> {t('raffleillionaire.TD')} </span>
          <span>{ticket}</span>
      </div>
  )
}