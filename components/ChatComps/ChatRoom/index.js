import Image from "next/image";
import { useSelector } from "react-redux";
import { useApi } from "../../../hooks/useApi";
import { getChatRoomUnseenMessages } from "../../../redux-toolkit/actions/axiosCalls";
import { useTranslation } from 'react-i18next';
import { useEffect } from "react";

export const ChatRoom = ({setRoom,selectedRoom,userTyping,room,onlineUsers,setOnlineUsers,...props}) => {
    const { t }                         = useTranslation();
    const user            = useSelector((state) => state.user.user);
    const currency        = useSelector((state) => state.currency.currency);
    const langVal         = useSelector((state) => state.language.language);
    const lastMessage     = useSelector((state) => state.lastMessage.lastMessage);

    const {
        data:unseenMessages,
        isLoading:isUnseenMessagesLoading,
        reFetch:refetchUnseenMessages
    } = useApi(()=> getChatRoomUnseenMessages(room.id,user.token,langVal,currency))

    useEffect(()=>{ if (selectedRoom.id===room.id) refetchUnseenMessages() },[selectedRoom])

    useEffect(()=>{
        if (room.members[0].is_online) {
            setOnlineUsers(oldArray => oldArray.includes(`${room.members[0].type.split('\\')[2]}_${room.members[0].id}`)
                ? [...oldArray.filter(id=> id !== `${room.members[0].type.split('\\')[2]}${room.members[0].id}`),`${room.members[0].type.split('\\')[2]}${room.members[0].id}`]
                : [...oldArray,`${room.members[0].type.split('\\')[2]}_${room.members[0].id}`]
            );
        }
    },[])

    return (
        <div
            {...props}
            onClick={setRoom}
            className={`td-chat-room ${selectedRoom.id===room.id && 'td-chat-room_active'} d-flex align-items-center border-bottom px-2 py-3 w-100`}>
            <div className='img-user position-relative'>
                <Image
                    src={room.members[0].logo||room.members[0].profile_pic}
                    className='rounded-circle border'
                    width={'60'}
                    height={'60'}
                    alt='user'
                />
                { (onlineUsers.includes(`${room.members[0].type.split('\\')[2]}_${room.members[0].id}`)) && <span className='active-in'/> }
            </div>
            <div className='px-2 flex-fill'>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                    <h6 className='m-0 fw-bold'>{ room.members[0].name }</h6>
                    <strong className='grayColor small-font-12'>{ lastMessage.find(last => last.roomId === room.id)?.createdAt }</strong>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <h6 className='text-overflow m-0 grayColor'>
                        {
                            (userTyping.roomId===room.id && userTyping.isTyping)
                                ? <strong className={'text-success'}>{t('user.profile.myChat.typing')}</strong>
                                : lastMessage.find(last => last.roomId === room.id)?.message
                        }
                        {/* {lastMessage.find(last => last.roomId === room.id)?.message} */}
                    </h6>
                    {isUnseenMessagesLoading
                        ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                        // ? <></>
                        : unseenMessages > 0 && selectedRoom.id!==room.id && <span className='icon-circle rounded-circle d-flex justify-content-center align-items-center bgMainColor text-white small-font-13'>{ unseenMessages }</span>
                    }
                </div>
            </div>
        </div>

    )
}