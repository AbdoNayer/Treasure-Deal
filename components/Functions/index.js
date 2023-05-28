import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { langReducer } from "../../redux-toolkit/reducer/langReducer";
import { useRouter } from "next/router";
import i18n from '../../locales/i18n';
import io from "socket.io-client";

export default function CheckedFound() {

    const langVal                     = useSelector((state) => state.language.language);
    const dispatch                    = useDispatch();
    const user                        = useSelector((state) => state.user.user);
    const router                      = useRouter()

    const fetchData = () => {
        
        if(user){
            window.onpopstate = () => router.push('/')
        }
        
        if (langVal) {
            if(langVal !== 'ar' || langVal === null){
                dispatch(langReducer(langVal));
                i18n.changeLanguage(langVal);
                document.documentElement.dir = 'ltr';
            }else{
                dispatch(langReducer(langVal));
                i18n.changeLanguage(langVal);
                document.documentElement.dir = 'rtl';
            }
        }else{
            dispatch(langReducer('en'));
            i18n.changeLanguage('en');
            document.documentElement.dir = 'ltr';
        }

    }
    
    useEffect(() => { fetchData(); }, []);

    useEffect(() => {

        if(user){
            if(user.id){

                const socket = io('https://treasuredeal.com:9090', {
                    transports  : ['websocket'],
                    query       : "id=" + user.id + "&user_type=User",
                });
                
                socket.on("connect", () => {
                    console.log('done connect soket');
                    socket.emit('online', {sender_id:user.id,sender_type:'User'});
                });
    
            }
        }
        

    }, []);

  }
  