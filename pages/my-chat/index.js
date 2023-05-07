import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {getChatRoomMessages, getChatRooms} from "../../redux-toolkit/actions/axiosCalls";
import {useSelector} from "react-redux";
import {useApi} from "../../hooks/useApi";
import {LoadData} from "../../components";
import {ChatRoom} from "../../components/ChatComps/ChatRoom";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import io from "socket.io-client";
import {useRouter} from "next/router";
import {NewChat} from "../../components/ChatComps/NewChat";
import { v4 as uuidv4 } from "uuid";

export default function MyChat() {
    const user                          = useSelector((state) => state.user.user);
    const currency                      = useSelector((state) => state.currency.currency);
    const langVal                       = useSelector((state) => state.language.language);
    const chat                          = useSelector((state) => state.chat.chat);
    const { t }                         = useTranslation();
    const bottomRef                     = useRef(null);
    const [ allChat, setAllChat ]       = useState([]);

    const [selectedChatRoom,setSelectedChatRoom]    = useState({});
    const [showEmojis,setShowEmojis]                = useState(false);

    const socket = io('https://treasuredeal.com:9090', {
        transports  : ['websocket'],
        query: "id=" + user.id + "&user_type=User",
    });

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" })}, [allChat]);

    useEffect(()=>{
        // const connectListener = data => {
        //     console.log('connect', 'connected to socket from web', data)
        // }
        //
        // socket.once("connect", connectListener);
        if (chat.room.id !== 0) {
            setSelectedChatRoom({
                id: chat.room.id,
                members: chat.members,
                last_message_body: "new chat",
                last_message_created_dt: null
            })
        }
    },[])

    useEffect(()=>{
        socket.on('typingRes',(data)=>console.log('typing event data ',data))
        socket.on('stoppedTypingRes',(data)=>console.log('stopped typing event data ',data))
        socket.on('onlineRes',(data)=>console.log('onlineRes event data ',data))
        socket.on('stoppedOnlineRes',(data)=>console.log('stoppedOnlineRes event data ',data))
        socket.on('sendMessageRes',(data)=>console.log('sendMessageRes event data ',data));
        return ()=>{
            socket.off('typingRes')
            socket.off('stoppedTypingRes')
            socket.off('onlineRes')
            socket.off('stoppedOnlineRes')
            socket.off('sendMessageRes')
        }
    },[])

    const {
        data:chatRoomsData,
        isLoading:isChatRoomsDataLoading,
        reFetch:refetchChatRoomsData
    } = useApi(()=> getChatRooms(user.token,langVal,currency))

    const {
        data:roomMessages,
        isLoading:isRoomMessagesLoading,
        reFetch:refetchRoomMessages
    } = useApi(()=> getChatRoomMessages(null,user.token,langVal,currency),false)

    useEffect(()=>{
        if (selectedChatRoom.id) {
            console.log('enter chat')
            socket.emit('enterChat', {user_id:user.id,user_type:'User',room_id:selectedChatRoom.id});
            refetchRoomMessages(() => getChatRoomMessages(selectedChatRoom.id, user.token, langVal, currency))
        }
        return () => {
            if (selectedChatRoom.id) {
                console.log('exit chat')
               socket.emit('exitChat', {user_id:user.id,user_type:'User',room_id:selectedChatRoom.id});
            }
        }
    },[selectedChatRoom])
    
    useEffect(()=>{
        if (roomMessages) {
            setAllChat(roomMessages.messages.data.reverse())
        }
    },[roomMessages])

    //#region Typing functions
    const emit = (action, data) => {
        console.log(action, data)
    }

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
        // else if (!newText && message) {
        //     console.log("input has no value emit event");
        // }
        // setMessage(v)
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
                body        : message,
                created_dt  : strTime,
                is_sender   : 1,
                id          : uuidv4(),
                name        : '',
                type        : 'text',
                duration    : 0
            }
            setShowEmojis(false)
            setAllChat(current =>  [...current, newObj]);

            socket.emit('sendMessage', {sender_id:user.id,sender_type:'User',receiver_id:selectedChatRoom.members[0].id,receiver_type:selectedChatRoom.members[0].type.split('\\')[2],room_id:selectedChatRoom.id,type:'text',body:message});
            setMessage('');
        }

    }
    //#endregion

    if (isChatRoomsDataLoading) return <LoadData/>

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
                            {chat.room.id !== 0 && <NewChat selectedRoom={selectedChatRoom} setRoom={(room)=>setSelectedChatRoom(room)}/>}
                            {
                                chatRoomsData.rooms.map(room =>
                                <ChatRoom
                                    key={room.id}
                                    room={room}
                                    setRoom={()=>setSelectedChatRoom(room)}
                                    selectedRoom={selectedChatRoom}
                                />
                            )}
                        </div>
                    </div>
                    <div className='col-md-8 col-xs-12 p-0'>
                        <div className='bg-white'>
                            {
                                selectedChatRoom.id && 
                                <div className='head-chat d-flex justify-content-between align-items-center px-3 bg-white border-bottom border-start'>
                                    <div className='d-flex align-items-center w-100 bg-transparent'>
                                        <Image
                                            src={selectedChatRoom.members[0].logo||selectedChatRoom.members[0].profile_pic}
                                            className='rounded-circle'
                                            width={'40'}
                                            height={'40'}
                                            alt='user'
                                        />
                                        <div className='px-2'>
                                            <h6 className='m-0 fw-bold'>{selectedChatRoom.members[0].name}</h6>
                                            <strong className='grayColor small-font-12'>10:00 AM</strong>
                                        </div>
                                    </div>
                                    <div className="dropdown">
                                        <button className='icon-circle bg-transparent rounded-circle d-flex justify-content-center align-items-center' type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className='icon-more-vertical fs-5 grayColor'/>
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                            <button className='p-2 bg-transparent w-100'>
                                                {t('user.profile.myChat.deleteChat')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className='border-start position-relative'>
                                {
                                    !selectedChatRoom.id && 
                                    <div className='box-info-chat d-flex justify-content-center flex-column align-items-center bg-white w-100 h-100'>
                                        <i className='icon-chat mainColor fs-3'/>
                                        <h5 className='m-0 mt-3'>Click Any Chat</h5>
                                    </div>
                                }
                                <div className='height-view-scroll all-chat p-3'>
                                    {
                                        (selectedChatRoom.id && isRoomMessagesLoading) ? 
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
                                            <i className='icon-info mainColor fs-3'/>
                                            <h5 className='m-0 mt-3'>write new massage</h5>
                                        </div>
                                    }
                                </div>
                                {
                                    !isRoomMessagesLoading && 
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
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}