import React, { useState } from 'react';
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import Image from 'next/image';


export default  function TicketCheckerResult ({ inVal,drawDetails,drawType, value }) {

    const { t }                             = useTranslation();
    const [ isActive, setIsActive]          = useState(true);

    const toggle = () => {
        setIsActive(!isActive);
        inVal(isActive);
    }

    const updateBackground = () => {
        switch (drawType) {
            case 'mill':
                return 'BG-1';
            case 'raff':
                return 'BG-2';

        }
    }

    return (
        <div className={`bg-img checker-result p-5 rounded-3 ${updateBackground()}`}>
            <div className='row align-items-center'>
                <div className='col-md-2 col-xs-12'>
                    <div className=''>
                        <Image style={{ objectFit:"contain" }} width={90} height={90} src='/img/TD.png' />
                    </div>
                </div>
                <div className='col-md-7 col-xs-12'>
                    <div className='bgWhiteColor rounded-3 p-4 text-center w-75 m-auto'>
                        <h4 className='fw-light'>Draw {drawDetails.date}</h4>
                        <div className="lis-number d-flex justify-content-center align-items-center my-4">
                            {drawType==='mill'
                                ? <>
                                    {drawDetails.numbers5.map((item, i)=>(<span key={i}>{item}</span>))}
                                    {drawDetails.numbers2.map((item, i)=>(<span key={i}>{item}</span>))}
                                </>
                                : <div className={'fs-3 fw-bold'}>TD- {drawDetails.ticket}</div>
                            }
                        </div>
                        <div className='d-flex align-items-center justify-content-between'>
                            <h5 className='fw-light'>Draw Series:</h5>
                            <h5 className='fw-light'>{drawDetails.series}</h5>
                        </div>
                    </div>
                </div>
                <div className='col-md-3 col-xs-12'>
                    <button onClick={toggle} className='w-75 m-auto btn-button bgWhiteColor d-flex align-items-center justify-content-center'>{t("result.millionaire.ticketChecker")}</button>
                </div>
            </div>
        </div>
    )
}