import Image from "next/image";
import {useSelector} from "react-redux";

export const NewChat = ({selectedRoom,setRoom,...props}) => {
    const chat                          = useSelector((state) => state.chat.chat);

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
                    src={chat.members[0].profile_pic}
                    className='rounded-circle'
                    width={'60'}
                    height={'60'}
                    alt='user'
                />
                {/*{ item.active && <span className='active-in'/> }*/}
            </div>
            <div className='px-2 flex-fill'>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                    <h6 className='m-0 fw-bold'>{ chat.members[0].name }</h6>
                    <strong className='grayColor small-font-12'>{ 'New Chat' }</strong>
                </div>
            </div>
        </div>
    )
}