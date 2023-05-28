import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {getChatRoomMessages, getChatRooms} from "../../redux-toolkit/actions/axiosCalls";
import {useDispatch, useSelector} from "react-redux";
import {useApi} from "../../hooks/useApi";
import {LoadData} from "../../components";
import {ChatRoom} from "../../components/ChatComps/ChatRoom";
import {useRouter} from "next/router";
import {NewChat} from "../../components/ChatComps/NewChat";
import {chatLastMessageReducer} from "../../redux-toolkit/reducer/chatLastMessageReducer";
import Image from 'next/image';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

export default function MyChat() {
    const user                          = useSelector((state) => state.user.user);
    const currency                      = useSelector((state) => state.currency.currency);
    const langVal                       = useSelector((state) => state.language.language);
    const chat                          = useSelector((state) => state.chat.chat);
    const lastMessage                   = useSelector((state) => state.lastMessage.lastMessage);
    const router                        = useRouter()
    const dispatch                      = useDispatch()
    const { t }                         = useTranslation();
    const bottomRef                     = useRef(null);
    const [ allChat, setAllChat ]       = useState([]);
    const [onlineUsers,setOnlineUsers]  = useState([])
    const [userTyping,setUserTyping]    = useState({ roomId : '', isTyping : false })

    const [selectedChatRoom,setSelectedChatRoom] = useState({})
    const [showEmojis,setShowEmojis] = useState(false)

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);
    
    const socket        = io('https://treasuredeal.com:9090', {
        transports      : ['websocket'],
        query           : "id=" + user ? user?.id : null + "&user_type=User",
    });

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" })}, [allChat]);

    useEffect(()=>{
        if (chat.room.id !== 0) {
            setSelectedChatRoom({
                id: chat.room.id,
                members: chat.members,
                last_message_body: "new chat",
                last_message_created_dt: null
            })
        }
    },[]);

    useEffect(()=>{

        const messageResListener = data => {
            const newObj = {
                body        : data.body,
                is_sender   : data.is_sender,
                room_id     : data.room_id,
                id          : uuidv4(),
                name        : '',
                type        : data.type,
                duration    : data.duration,
                created_dt  : data.created_dt
            }

            setAllChat(current =>  [...current, newObj]);
            dispatch(chatLastMessageReducer([...lastMessage.filter(message=> message.roomId !== data.room_id),{roomId:data.room_id,message:data.body,createdAt:data.created_dt}]))
        }
        const typingResListener = (data,state) => {
            if (state==='start') {
                setUserTyping({
                    roomId: data.room_id,
                    isTyping: true,
                })
            }
            else {
                setUserTyping({
                    roomId: data.room_id,
                    isTyping: false,
                })
            }
        }
        const onlineResListener = (data) => {
            setOnlineUsers(oldArray => oldArray.includes(`${data.sender_type}_${data.sender_id}`)
                ? [...oldArray.filter(id=> id !== `${data.sender_type}${data.sender_id}`),`${data.sender_type}${data.sender_id}`]
                : [...oldArray,`${data.sender_type}_${data.sender_id}`]
            );
        }
        const offlineResListener = (data) => {
            setOnlineUsers(oldArray => oldArray.includes(`${data.sender_type}_${data.sender_id}`)
                ? [...oldArray.filter(id=> id !== `${data.sender_type}_${data.sender_id}`)]
                : [...oldArray]
            );
        }

        socket.on('onlineRes',data => onlineResListener(data))
        socket.on('stoppedOnlineRes',data => offlineResListener(data))

        socket.on('typingRes', data => typingResListener(data,'start'))
        socket.on('stoppedTypingRes', data => typingResListener(data,'stop'))

        socket.on('sendMessageRes', data => { console.log('da', data); messageResListener(data)});
        
    },[socket])

    const {
        data:chatRoomsData,
        isLoading:isChatRoomsDataLoading,
        reFetch:refetchChatRoomsData
    } = useApi(()=> getChatRooms(user.token,langVal,currency), user !== null)
    
    useEffect(()=>{
        if (chatRoomsData) {
            dispatch(chatLastMessageReducer(
                chatRoomsData?.rooms.map(room => ({roomId:room.id,message:room.last_message_body,createdAt:room.last_message_created_dt}))
            ))
        }
    },[chatRoomsData])

    const {
        data:chatRoomMessagesData,
        isLoading:isChatRoomMessagesDataLoading,
        reFetch:refetchChatRoomMessagesData
    } = useApi(()=> getChatRoomMessages(null,user.token,langVal,currency),false)

    useEffect(()=>{
        if (selectedChatRoom.id) {
            socket.emit('enterChat', {user_id:user.id,user_type:'User',room_id:selectedChatRoom.id});
            refetchChatRoomMessagesData(() => getChatRoomMessages(selectedChatRoom.id, user.token, langVal, currency))
        }
        return () => {
            if (selectedChatRoom.id) {
                setUserTyping({
                    roomId: selectedChatRoom.id,
                    isTyping: false
                })
               socket.emit('exitChat', {user_id:user.id,user_type:'User',room_id:selectedChatRoom.id});
            }
        }
    },[selectedChatRoom])

    useEffect(()=>{
        if (allChat.length) {
            dispatch(chatLastMessageReducer(
                [
                        ...lastMessage.filter(message=> message.roomId !== selectedChatRoom.id)
                        ,{
                            roomId:selectedChatRoom.id,
                            message:allChat[allChat.length-1].body,
                            createdAt:allChat[allChat.length-1].created_dt}
                    ]
                )
            )
        }
    },[allChat])

    useEffect(()=>{
        if (chatRoomMessagesData) {
            setAllChat(chatRoomMessagesData.messages.data.reverse())
        }
    },[chatRoomMessagesData])

    const [message, setMessage] = useState('');
    const [isTyping,setIsTyping] = useState(false)
    let typingTimer;
    let doneTypingInterval = 1000;

    useEffect(() => {
        if (message && !isTyping) {
            socket.emit('stoppedTyping', {sender_id:user.id,sender_type:'User',receiver_id:selectedChatRoom.members[0].id,receiver_type:selectedChatRoom.members[0].type.split('\\')[2],room_id:selectedChatRoom.id});
        }
    }, [isTyping])

    const typingMessage = (v) => {
        const newText = v
        setMessage(newText);
        if (newText && (!message || !isTyping)) {
            socket.emit('typing', {sender_id:user.id,sender_type:'User',receiver_id:selectedChatRoom.members[0].id,receiver_type:selectedChatRoom.members[0].type.split('\\')[2],room_id:selectedChatRoom.id});
        }
        if (!isTyping){
            clearTimeout(typingTimer)
            setIsTyping(true)
        }
        
        clearTimeout(typingTimer);
    }

    const doneTyping = () => setIsTyping(prevState => prevState ? false : prevState)

    const keyUpFnc = (e) => {
        if (e.keyCode === 13) {
            onSent();
            return;
        }
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
    //#endregion

    const onSent = () => {
        if(message !== ''){
            let today               = new Date();
            let hours               = today.getHours();
            let minutes             = today.getMinutes();
            let AMPM                = hours >= 12 ? 'PM' : 'AM';
            hours                   = hours % 12;
            hours                   = hours ? hours : 12;
            minutes                 = minutes < 10 ? '0' + minutes : minutes;
            let strTime             = hours + ':' + minutes + ' ' + AMPM;

            const newObj = {
                body     : message,
                is_sender: 1,
                id       : uuidv4(),
                name     : '',
                type     : 'text',
                duration : 0,
                created_dt: strTime
            }
            dispatch(chatLastMessageReducer(
                [
                        ...lastMessage.filter(message=> message.roomId !== selectedChatRoom.id)
                        ,{roomId:selectedChatRoom.id,message,createdAt:strTime}
                ]
            ))
            socket.emit('sendMessage', {
                sender_id           : user.id,
                sender_type         : 'User',
                receiver_id         : selectedChatRoom.members[0].id,
                receiver_type       : selectedChatRoom.members[0].type.split('\\')[2],
                room_id             : selectedChatRoom.id,type:'text',
                body                : message
            })
            setShowEmojis(false)
            setAllChat(current =>  [...current, newObj]);
            setMessage('');
            socket.emit('stoppedTyping', {sender_id:user.id,sender_type:'User',receiver_id:selectedChatRoom.members[0].id,receiver_type:selectedChatRoom.members[0].type.split('\\')[2],room_id:selectedChatRoom.id});
        }

    }
    //#endregion

    if (isChatRoomsDataLoading) return <LoadData/>

    if(user === null) return null;

    return (
        <div className='chat'>
  
            <div className='container mw-100 p-0 m-0'>
                <div className='row p-0 m-0'>
                    <div className='col-md-4 col-xs-12 p-0'>
                        <div className='head-chat px-3 bg-white border-bottom'>
                            {/* <h6 className='m-0'>{t('app.myChat')}</h6> */}
                            {/*<button className='icon-circle rounded-circle d-flex justify-content-center align-items-center'>*/}
                            {/*    <i className='icon-search-interface-symbol grayColor'/>*/}
                            {/*</button>*/}
                            <div className='form-search position-relative mt-3'>
                                <input className='rounded-pill w-100 border small-font-13' placeholder={t('user.profile.myChat.searchChat')} />
                                <button className='icon-search grayColor fs-6 bg-transparent' />
                            </div>
                        </div>
                        <div className='over-section-pepole height-view-scroll bg-white'>
                            {
                                chat.room.id !== 0 && 
                                <NewChat
                                    userTyping={userTyping}
                                    onlineUsers={onlineUsers}
                                    selectedRoom={selectedChatRoom} 
                                    setRoom={(room)=>setSelectedChatRoom(room)}
                                />
                            }
                            {
                                chatRoomsData.rooms.length > 0 ?
                                    chatRoomsData.rooms.map(room =>
                                        <ChatRoom
                                            setOnlineUsers={setOnlineUsers}
                                            onlineUsers={onlineUsers}
                                            userTyping={userTyping}
                                            key={room.id}
                                            room={room}
                                            setRoom={()=>setSelectedChatRoom(room)}
                                            selectedRoom={selectedChatRoom}
                                        />
                                    )
                                :
                                <div className='text-center pt-5 mt-5'>
                                    <h5 className='text-danger'>{t('user.profile.myChat.noChatAv')}</h5>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='col-md-8 col-xs-12 p-0'>
                        <div className='bg-white'>
                            {selectedChatRoom.id && 
                            <div className='head-chat d-flex justify-content-between align-items-center px-3 bg-white border-bottom border-start'>
                                <div className='d-flex align-items-center w-100 bg-transparent'>
                                    <Image
                                        src={selectedChatRoom.members[0].logo||selectedChatRoom.members[0].profile_pic}
                                        className='rounded-circle border'
                                        width={'45'}
                                        height={'45'}
                                        alt='user'
                                    />
                                    <div className='px-2'>
                                        <h6 className='m-0 fw-bold'>{selectedChatRoom.members[0].name}</h6>
                                        {
                                            userTyping.isTyping
                                            ? <strong className='text-success small-font-12'>{t('user.profile.myChat.typing')}</strong>
                                            : (onlineUsers.includes(`${selectedChatRoom.members[0].type.split('\\')[2]}_${selectedChatRoom.members[0].id}`))
                                                    ? 
                                                    <div className='d-flex align-items-center mt-1'>
                                                        <span className='active-user'/>
                                                        <strong className='text-success small-font-12 mx-1'>{t('user.profile.myChat.online')}</strong>
                                                    </div>
                                                    : <strong className='grayColor small-font-12'>{t('user.profile.myChat.offline')}</strong>
                                        }
                                    </div>
                                </div>
                                <div className="dropdown">
                                    <button className='bg-transparent d-flex justify-content-center align-items-center' type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className='icon-list grayColor'/>
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        <button className='p-2 bg-transparent w-100'>
                                        {t('user.profile.myChat.deleteChat')}
                                        </button>
                                    </div>
                                </div>
                            </div>}
                            <div className='border-start position-relative'>
                                {!selectedChatRoom.id && 
                                <div className='box-info-chat d-flex justify-content-center flex-column align-items-center bg-white w-100 h-100'>
                                    <i className='icon-chat mainColor fs-3'/>
                                    <h5 className='m-0 mt-3'>{t('user.profile.myChat.clickChat')}</h5>
                                </div>}
                                <div className='height-view-scroll all-chat p-3'>
                                    {
                                    (selectedChatRoom.id && isChatRoomMessagesDataLoading)  
                                        ? 
                                        <LoadData/>
                                        :
                                        allChat.length > 0 ?
                                            allChat.map((chat, i)=> (
                                            <div ref={bottomRef} key={chat.id} className={`${chat.is_sender ? 'sender' : 'justify-content-end receive'} position-relative p-3 d-flex`}>
                                                <div className={`${chat.is_sender ? 'bg-white' : 'mainOpacity'} py-2 px-3 rounded-3`}>
                                                    <span className='grayColor d-block text-end small-font-12'>{ chat.created_dt }</span>
                                                    <h6 className='m-0 mt-2 fw-bold'>{ chat.body }</h6>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div className='creat-chat d-flex justify-content-center flex-column align-items-center w-100 h-100'>
                                            <i className='icon-chat mainColor fs-3'/>
                                            <h5 className='m-0 mt-3'>{t('user.profile.myChat.writeMassage')}</h5>
                                        </div>
                                    }
                                </div>
                                {
                                    !isChatRoomMessagesDataLoading && 
                                    <div className='d-flex justify-content-between align-items-center p-3 border-top position-relative'>
                                    <button className='bg-transparent' onClick={()=>setShowEmojis(!showEmojis)}>
                                        <i className='icon-happy fs-3'/>
                                    </button>
                                    {
                                        showEmojis &&
                                        <div className="td_emojipicker">
                                            <Picker
                                                data={data}
                                                onEmojiSelect={(emoji)=>setMessage(prevState => (prevState.concat(emoji.native)))}
                                                theme={'light'}
                                                previewPosition={null}
                                                exceptEmojis={['transgender_flag','rainbow-flag']}
                                            />
                                        </div>
                                    }
                                    <div className='flex-fill px-3'>
                                        <input
                                            onKeyUp={keyUpFnc}
                                            className='rounded-pill'
                                            value={message}
                                            onChange={(e) => typingMessage(e.target.value)}
                                        />
                                    </div>
                                    <button className='bg-transparent' onClick={onSent}>
                                        <i className='icon-send-message fs-3 mainColor'/>
                                    </button>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}