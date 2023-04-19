import React, { useEffect } from 'react';
import i18n from '../../locales/i18n';
import { useDispatch, useSelector } from "react-redux";
import { langReducer } from "../../redux-toolkit/reducer/langReducer";
import { currencyReducer } from "../../redux-toolkit/reducer/currencyReducer";
import { useRouter } from "next/router";
import io from "socket.io-client";

export default function CheckedFound() {

    const langVal                       = useSelector((state) => state.language.language);
    const currency                      = useSelector((state) => state.currency.currency);
    const dispatch                      = useDispatch();
    const router                        = useRouter();

    // const socket = io('https://treasuredeal.com:9090', {
    //     query: "id=" + user.id + "&user_type=Merchant",
    // });

    const fetchData = () => {
        
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
        if (currency) dispatch(currencyReducer(currency))
        else dispatch(currencyReducer('AED'))
    }
    
    useEffect(() => { fetchData(); }, []);

    // useEffect(()=>{
    //     if (router.pathname !== '/become-partner') router.push('/become-partner')
    // },[router.pathname])

    // useEffect(()=>{
    //     if (user.id){
    //         socket.emit('online', {sender_id:user.id,sender_type:'Merchant'});
    //     }
    //     return () => {
    //         if (user.id) {
    //             socket.emit('stoppedOnline', {sender_id:user.id,sender_type:'Merchant'});
    //         }
    //     }
    // },[])

  }
  