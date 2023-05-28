import React from 'react';
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";

export default function BtnGoChat() {
  
  const { t }                         = useTranslation();
  const user                                        = useSelector((state) => state.user.user);

  return (
    <>
      {
        user && <Link href={'/my-chat'} className='up-to-page go-chat bgMainColor rounded-circle old-shadow'>
          <i className='icon-chat-in fs-4 text-white'></i>
        </Link>
      }
    </>
  )
}