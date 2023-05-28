import Image from "next/image";
import {useSelector} from "react-redux";
import { useTranslation } from 'react-i18next';
import {useApi} from "../../../hooks/useApi";
import {getChatRoomUnseenMessages} from "../../../redux-toolkit/actions/axiosCalls";

export const NewChat = ({selectedRoom,setRoom,onlineUsers,userTyping,...props}) => {
    const chat                          = useSelector((state) => state.chat.chat);
    const lastMessage                   = useSelector((state) => state.lastMessage.lastMessage);
    const user                          = useSelector((state) => state.user.user);
    const currency                      = useSelector((state) => state.currency.currency);
    const langVal                       = useSelector((state) => state.language.language);
    const { t }                         = useTranslation();

    const {
        data:unseenMessages,
        isLoading:isUnseenMessagesLoading,
        reFetch:refetchUnseenMessages
    } = useApi(()=> getChatRoomUnseenMessages(chat.room.id,user.token,langVal,currency))


    return (
        <div
            {...props}
            onClick={()=>setRoom({
                id: chat.room.id,
                members: chat.members,
                last_message_body: "new chat",
                last_message_created_dt: null
            })}
            className={`td-chat-room ${selectedRoom.id===chat.room.id && 'td-chat-room_active'} d-flex align-items-center border-bottom px-2 py-3 w-100`}
        >
            <div className='img-user position-relative'>
                <Image
                    src={chat.members[0].logo||chat.members[0].profile_pic}
                    className='rounded-circle border'
                    width={'60'}
                    height={'60'}
                    alt='user'
                />
                { (onlineUsers.includes(`${chat.members[0].type.split('\\')[2]}_${chat.members[0].id}`)) && <span className='active-in'/> }
            </div>
            <div className='px-2 flex-fill'>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                    <h6 className='m-0 fw-bold'>{ chat.members[0].name }</h6>
                    <strong className='grayColor small-font-12'>{ lastMessage.find(last => last.roomId === chat.room.id)?.createdAt || t('user.profile.myChat.recent') }</strong>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <h6 className='text-overflow m-0 grayColor'>
                        {
                            (userTyping.roomId===chat.room.id && userTyping.isTyping)
                                ? <strong className={'text-success'}>Typing...</strong>
                                : lastMessage.find(last => last.roomId === chat.room.id)?.message || t('user.profile.myChat.newChat')
                        }
                    </h6>
                    {isUnseenMessagesLoading
                        ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                        // ? <></>
                        : unseenMessages > 0 && selectedRoom.id!==chat.room.id && <span className='icon-circle rounded-circle d-flex justify-content-center align-items-center bgMainColor text-white small-font-13'>{ unseenMessages }</span>
                    }
                </div>
            </div>
        </div>
    )
}