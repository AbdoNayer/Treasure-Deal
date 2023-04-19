import Image from "next/image";
import {useSelector} from "react-redux";
import {useApi} from "../../../hooks/useApi";
import {getChatRoomUnseenMessages} from "../../../redux-toolkit/actions/axiosCalls";

export const ChatRoom = ({setRoom,selectedRoom,room,...props}) => {
    const user            = useSelector((state) => state.user.user);
    const currency        = useSelector((state) => state.currency.currency);
    const langVal         = useSelector((state) => state.language.language);
    const {
        data:unseenMessages,
        isLoading:isUnseenMessagesLoading,
        reFetch:refetchUnseenMessages
    } = useApi(()=> getChatRoomUnseenMessages(room.id,user.token,langVal,currency))

    return (
        <div
            {...props}
            onClick={setRoom}
            className={`td-chat-room ${selectedRoom.id===room.id && 'td-chat-room_active'} d-flex align-items-center border-bottom px-2 py-3 w-100`}>
            <div className='img-user position-relative'>
                <Image
                    src={room.members[0].profile_pic}
                    className='rounded-circle'
                    width={'60'}
                    height={'60'}
                    alt='user'
                />
                {/*{ item.active && <span className='active-in'/> }*/}
            </div>
            <div className='px-2 flex-fill'>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                    <h6 className='m-0 fw-bold'>{ room.members[0].name }</h6>
                    <strong className='grayColor small-font-12'>{ room.last_message_created_dt }</strong>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <h6 className='text-overflow m-0 grayColor'>{ room.last_message_body }</h6>
                    {isUnseenMessagesLoading
                        ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                        // ? <></>
                        : unseenMessages > 0 && <span className='icon-circle rounded-circle d-flex justify-content-center align-items-center bgMainColor text-white small-font-13'>{ unseenMessages }</span>
                    }
                </div>
            </div>
        </div>

    )
}