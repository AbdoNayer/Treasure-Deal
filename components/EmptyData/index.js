import React from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function EmptyData({ data }) {

    const { t }                         = useTranslation();

    return (
        <div className='empty-data'>
            <Image 
                src={'/img/empty.png'}
                width={'150'} 
                height={'150'}
                alt='empty'
            />
            <h4 className='text-danger mt-4'>{t(data.text)}</h4>
        </div>
    )
}