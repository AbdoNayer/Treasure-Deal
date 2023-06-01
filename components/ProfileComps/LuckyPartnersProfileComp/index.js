import {InputText} from "../../Inputs/InputText";
import {useDispatch, useSelector} from "react-redux";
import {useEffect,useState} from "react";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";
import {
    acceptPartnerInvite,
    deletePartner,
    getPartnerInvitations,
    getPartners,
    invitePartner,
    rejectPartnerInvite
} from "../../../redux-toolkit/actions";
import {PartnerInvitationRow} from "../../PartnerInvitationRow";
import {LoadData} from "../../index";
import {getChatRooms} from "../../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../../hooks/useApi";

export const LuckyPartnersProfileComp = ({...props}) => {
    const partnersInfo                                  = useSelector((state) => state.partners.invitations.invitations);
    const { t }                                         = useTranslation();
    const router                                        = useRouter();
    const langVal                                       = useSelector((state) => state.language.language);
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);
    const dispatch                                      = useDispatch();
    const [receivedInvites,setReceivedInvites]          = useState([])
    const [partnerEmail,setPartnerEmail]                = useState('')
    const [isSending,setIsSending]                      = useState(false)
    const [isLoading,setIsLoading]                      = useState(false)
    const [isGettingInvites,setIsGettingInvites]        = useState(true)

    useEffect(()=>{
        (async () => await getPartnerInvitations(user.token,langVal,currency))()
            .then(r=> {
                setReceivedInvites(r.invitations)
                setIsGettingInvites(false)
            })
            .catch(e=>{setIsGettingInvites(false)})
    },[])
    useEffect(()=>{
        setIsLoading(true)
        dispatch(getPartners(user.token,langVal,currency))
            .then(()=>setIsLoading(false))
            .catch((e)=>setIsLoading(false))
    },[]);
    const {
        data:chatRooms,
        isLoading:isChatRoomsLoading,
        reFetch:refetchChatRooms
    } = useApi(()=> getChatRooms(user.token,langVal,currency))
    const sendPartnerInvitation = (email) => {
        setIsSending(true)
        dispatch(invitePartner({email},user.token,langVal,currency))
            .then(()=>setIsSending(false))
            .catch((e)=>setIsSending(false))
    }

    const deletePartnerInvitation = async (id) => {
        await dispatch(deletePartner({invitation_id:id},user.token,langVal,currency))
        await dispatch(getPartners(user.token,langVal,currency))
    }

    const rejectPartnerInvitation = async (id) => {
        await dispatch(rejectPartnerInvite({invitation_id:id},user.token,langVal,currency))
            .then(r=>{
                setReceivedInvites(prevState => prevState.filter(invite => invite.id!==id))
            })
        await dispatch(getPartners(user.token,langVal,currency))
    }
    const acceptPartnerInvitation = async (id) => {
        await dispatch(acceptPartnerInvite({invitation_id:id},user.token,langVal,currency))
        await dispatch(getPartners(user.token,langVal,currency))
            .then(r=>{
                setReceivedInvites(prevState => prevState.filter(invite => invite.id!==id))
            })
    }

    if (isLoading||isChatRoomsLoading) return <div className={'modal-height-view position-relative'}><LoadData/></div>

    return (
      <div className={'td_lucky_partners py-5'}>
        <h5 className='fw-light'>{t('luckyProfile.addPartners')}</h5>
          <div className="row">
              <div className="col-md-5 my-4">
                    <InputText
                        label={'Enter Your Lucky Partner Email Id'}
                        placeholder={'Lucky Partner id'}
                        onChange={e=> setPartnerEmail(e.target.value)}
                    />
                    <button onClick={()=>sendPartnerInvitation(partnerEmail)} className={'btn-button bgMainColor text-white my-3'}>
                        {isSending
                            ? 
                            <span className={'fs-5 spinner-border spinner-border-sm text-white'}/>
                            : 
                            t('luckyProfile.sendInivitation')
                        }

                    </button>
              </div>
              <div className="col-md-7 my-4">
                  <div className="over-x">
                  <div className="td_lucky_partners_table">
                      <h4 className="td_table_title fw-light mb-4 px-3">
                            {t('luckyProfile.savedPartners')}
                      </h4>
                      <div className="row td_table_header text-center">
                          <div className="col-4">
                            <h6 className="fw-light">{t('favouritesProfile.name')}</h6>
                          </div>
                          <div className="col-4">
                            <h6 className="fw-light">{t('user.profile.header.email')}</h6>
                          </div>
                          <div className="col-4">
                            <h6 className="fw-light">{t('app.actions')}</h6>
                          </div>
                      </div>
                      {(isLoading||isGettingInvites)
                          ?  <div className='modal-height-view position-relative'>
                              <LoadData />
                          </div>
                          : <>
                              {receivedInvites.length> 0 && receivedInvites.map(invite =>
                                  <PartnerInvitationRow
                                      type={'new'}
                                      key={invite.id}
                                      invite={invite}
                                      acceptPartnerInvitation={acceptPartnerInvitation}
                                      rejectPartnerInvitation={rejectPartnerInvitation}
                                  />)}
                              {partnersInfo && partnersInfo.length
                                  ? partnersInfo.map(invite=>
                                      <PartnerInvitationRow
                                          chatRooms={chatRooms}
                                          type={'existing'}
                                          key={invite.id}
                                          invite={invite}
                                          deletePartnerInvitation={deletePartnerInvitation}
                                      />)
                                  : receivedInvites.length === 0 &&
                                  <div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center w-100'}>
                                      <h5 className="text-danger">{t('')}You dont have any partners saved</h5>
                                  </div>
                              }
                          </>
                      }
                  </div>
                  </div>
              </div>
          </div>
      </div>
  )
}