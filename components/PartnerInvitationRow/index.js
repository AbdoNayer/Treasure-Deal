import {useState} from "react";
import {createChatRoom} from "../../redux-toolkit/actions/axiosCalls";
import {chatReducer} from "../../redux-toolkit/reducer/chatReducer";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";

export const PartnerInvitationRow = ({invite,deletePartnerInvitation,acceptPartnerInvitation,rejectPartnerInvitation,chatRooms,type,...props}) => {
    const langVal                                       = useSelector((state) => state.language.language);
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);
    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch()
    const router                                        = useRouter()
    const [isDeleting,setIsDeleting]                    = useState(false)
    const [isAccepting,setIsAccepting]                  = useState(false)
    const [isRejecting,setIsRejecting]                  = useState(false)
    const [isChatLoading,setIsChatLoading]              = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        deletePartnerInvitation(invite)
            .then(()=>setIsDeleting(false))
            .catch((e)=>setIsDeleting(false))
    }

    const handleReject = async () => {
        setIsRejecting(true)
        rejectPartnerInvitation(invite.id)
            .then(()=>setIsRejecting(false))
            .catch((e)=>setIsRejecting(false))
    }

    const handleAccept = async () => {
        setIsAccepting(true)
        acceptPartnerInvitation(invite.id)
            .then(()=>setIsAccepting(false))
            .catch((e)=>setIsAccepting(false))
    }

    const createChat = () => {
        if (isChatLoading) return
        if (chatRooms?.rooms.find(item => (item.members[0].id === invite.user_id && item.members[0].type.split("\\")[2]==='User'))) {
            router.push(`/my-chat`)
        }
        else {
            setIsChatLoading(true)
            const dataObject={
                memberable_id:invite.user_id,
                memberable_type:"User"
            };
            (async ()=> await createChatRoom(dataObject,user.token,langVal,currency))()
                .then(r=> {
                    console.log(r)
                    dispatch(chatReducer(r))
                    router.push(`/my-chat`)
                    setIsChatLoading(false)
                })
                .catch(e=> {
                    setIsChatLoading(false)
                })
        }
    }
    return (
        <div {...props} className={'row td_table_invitation text-center'}>
            <div className="col-4">
                <h6 className="fw-light">{invite.name}</h6>
            </div>
            <div className="col-4">
                <h6 className="fw-light">{invite.email}</h6>
            </div>
            {type === 'new'
                ? <div className={'col-4 d-flex align-items-center justify-content-around'}>
                    <button className={'btn-button w-auto px-3 bgMainColor text-white'} onClick={handleAccept}>
                        {isAccepting
                            ? <span className={'fs-5 spinner-border spinner-border-sm text-white'}/>
                            : <span>{t('app.accept')}</span>
                        }
                    </button>
                    <button className={'btn-button w-auto px-3 bgSecondColor'} onClick={handleReject}>
                        {isRejecting
                            ? <span className={'fs-5 spinner-border spinner-border-sm text-black'}/>
                            : <span>{t('app.reject')}</span>
                        }
                    </button>
                </div>
                : <div className="col-4 d-flex align-items-center justify-content-center">
                    <span className={isChatLoading ? 'fs-5 me-3 spinner-border spinner-border-sm mainColor' : 'icon-chat-in me-3 mainColor cursor-pointer'} onClick={createChat}/>
                    <div onClick={handleDelete} className={'cursor-pointer'}>
                        {isDeleting
                            ? <span className={'fs-5 spinner-border spinner-border-sm mainColor'}/>
                            : <span className="icon-bin mainColor fs-5"/>
                        }
                    </div>
                </div>
            }
        </div>
    )
}