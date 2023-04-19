import {useDispatch, useSelector} from "react-redux";
import {TicketCard} from "../../TicketCard";
import {useEffect, useState} from "react";
import {InputSelect} from "../../Inputs/InputSelect";
import {addPartnerRaffillionaire, getPartners, hideModalAction} from "../../../redux-toolkit/actions";
import {useTranslation} from "react-i18next";

export const AddLuckyPartnerModalForm = ({tickets,singleTicket,selectedLuckyPartners,...props}) => {
    const { t }                                             = useTranslation();
    const raffillionaireLines                               = useSelector((state) => state.raffillionaireLines.raffillionaireLines);
    const [selectedTicketCartId,setSelectedTicketCartId] = useState( singleTicket ? singleTicket.cart_id : '')
    const [selectedPartners,setSelectedPartners] = useState([])
    const dispatch                                      = useDispatch();
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const user                                          = useSelector((state) => state.user.user);
    const partnersInfo                                  = useSelector((state) => state.partners.invitations.invitations);
    const [isPartnersLoading,setIsPartnersLoading] = useState(false)
    const [isAdding,setIsAdding] = useState(false)
    useEffect(()=>{
        setIsPartnersLoading(true)
        dispatch(getPartners(user.token,langVal,currency))
            .then(()=>setIsPartnersLoading(false))
            .catch((e)=>setIsPartnersLoading(false))
    },[]);

    const addPartnerToBundle = () => {
        const data = {
            cart_id:JSON.stringify(selectedTicketCartId),
            invitations:JSON.stringify(selectedPartners)
        }
        setIsAdding(true)
        dispatch(addPartnerRaffillionaire(data,user.token,langVal,currency))
            .then(()=> {
                setIsAdding(false)
                dispatch(hideModalAction())
            })
            .catch((e)=>setIsAdding(false))
    }

    return (
        <div>
            <div className="raffleillionaire mb-3">
                <div className='over-card-bundle d-flex flex-wrap'>
                    {tickets && tickets.map(ticket =>
                        <div className="mx-2 d-flex align-items-center">
                            <label className="check-box" key={ticket}>
                                <input type="radio" name="radio"
                                    onChange={e=>
                                        setSelectedTicketCartId(
                                            raffillionaireLines.selected_lines.find(line=> line.ticket.join('') === e.target.value).cart_id
                                        )
                                } value={ticket}/>
                                <span className="checkmark"/>
                            </label>
                            <TicketCard ticketMode={'select'} ticket={ticket} key={ticket}/>
                        </div>
                    )}
                </div>
            </div>
            <p className="fw-light my-4">{t('raffleillionaire.addPartner')}</p>
            <div className="select-active">
                <InputSelect
                    multi
                    options={partnersInfo?.map(inv=> ({label:inv.name,value:inv.id}))}
                    onChange={e=> setSelectedPartners(e.map(v=> v.value))}
                    isLoading={isPartnersLoading}
                    defaultValue={selectedLuckyPartners ? selectedLuckyPartners.map(partner=> ({label:partnersInfo.find(info=> info.id===partner.id).name,value:partner.id})) : 'Select'}
                />
            </div>
            <button className='btn-button bgMainColor text-white d-table m-auto my-4' onClick={addPartnerToBundle}>
                {isAdding
                    ? <span className={'fs-5 spinner-border spinner-border-sm text-white'}/>
                    : <span>{t('millionaire.lotto.pop_ups.load_favourite.loadFavouriteButton')}</span>
                }

            </button>
        </div>
    )
}