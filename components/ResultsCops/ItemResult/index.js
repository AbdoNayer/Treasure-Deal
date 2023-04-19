import React from 'react';
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import {useRouter} from "next/router";


export default  function TicketCheckerResult ({drawDetails,drawType}) {

    const { t }                            = useTranslation();
    const router                        = useRouter();

    return (
        <div className="item-result rounded-3 overflow-hidden my-3">
            <div className='bgMainColor p-4 text-center'>
                <h4 className='fw-light text-white'>Draw Date</h4>
                <h4 className='fw-light text-white'>{drawDetails.date}</h4>
            </div>
            <div className='bgGrayColor p-4 text-center checker-result'>
                <h4 className='fw-light'>{t("app.ticketNumbers")}</h4>
                <div className="lis-number d-flex justify-content-center align-items-center my-4">
                    {drawType==='mill'
                        ? <>
                            {drawDetails.numbers5.map((item, i)=>(<span key={i}>{item}</span>))}
                            {drawDetails.numbers2.map((item, i)=>(<span key={i}>{item}</span>))}
                        </>
                        : <div className={'fs-3 fw-bold'}>TD-{drawDetails.ticket}</div>

                    }
                </div>
                {drawType==='mill' && <>
                    <h4 className='fw-light'>{t("result.millionaire.totalWinners")}</h4>
                    <h5 className='mainColor'>{drawDetails.winners_count}</h5>
                </>}
                <Link href={{pathname: `${router.pathname}/details`, query:{draw_id: drawDetails.id}}} className='w-50 text-white m-auto btn-button bgMainColor d-flex align-items-center justify-content-center'>{t("result.millionaire.detailedResults")}</Link>
                {/*<Link href={`${router.pathname}/details?draw_id=${drawDetails.id}`} className='w-50 text-white m-auto btn-button bgMainColor d-flex align-items-center justify-content-center'>{t("result.millionaire.detailedResults")}</Link>*/}
            </div>
        </div>
    )
}