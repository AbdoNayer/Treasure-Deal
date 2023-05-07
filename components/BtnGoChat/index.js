import React from 'react';
import Link from "next/link";
import { useTranslation } from 'react-i18next';

export default function BtnGoChat() {
  
  const { t }                         = useTranslation();

  return (
    <Link href={'/my-chat'} className='up-to-page go-chat bgMainColor rounded-circle old-shadow'>
        <i className='icon-chat-in fs-4 text-white'></i>
    </Link>
  )
}