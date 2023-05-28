import React, {useEffect} from 'react';
import Link from "next/link";
import { useSelector } from "react-redux";
import { useApi } from "../../hooks/useApi";
import { getCountNotification } from "../../redux-toolkit/actions/axiosCalls";

export default function TabsMobile() {

  const user                                          = useSelector((state) => state.user.user);
  const { currency, currencies }                      = useSelector((state) => state.currency);
  const langVal                                       = useSelector((state) => state.language.language);

  const { data: countNoty, reFetch: refetchNoty } = useApi(()=> getCountNotification(langVal, currency, user.token),false)

  useEffect(()=>{if (user){if(user.id){refetchNoty(()=> getCountNotification(langVal, currency, user.token))}} },[user])

  return (
    <div className='tab-mobile bx-shadow bg-white'>
      <Link href={'/'}>
          <span className='icon-home fs-4'></span>
      </Link>
      {
        user ?
          <Link href={'/my-account'}>
              <span className='icon-user fs-4'></span>
          </Link>
          :
          ''
      }
      {
        user ?
          <Link href={'/notifications'} className='count-num'>
              <span className='icon-bell fs-4'></span>
              {countNoty && countNoty.count !== 0 ? <strong>{countNoty.count}</strong> : null}
          </Link>
          :
          ''
      }
      {
        user ? 
          <Link href={'/my-chat'}>
              <span className='icon-chat-in fs-4'></span>
          </Link>
        :
        ''
      }
      {
        user ? 
          <Link href={'/shopping-cart'}>
              <span className='icon-shopping-cart fs-4'></span>
          </Link>
        :
        ''
      }
      {
        !user ? 
          <Link href={'/auth/login'}>
              <span className='icon-user fs-4'></span>
          </Link>
        :
        ""
      }
      {
        !user ? 
          <Link href={'/auth/register'}>
              <span className='icon-user-plus'></span>
          </Link>
        :
        ""
      }
    </div>
  )
}