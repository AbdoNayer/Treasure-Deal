import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {ShareWrapper} from "../ShareWrapper";

export const BundleWrapper = ({data,cart}) => {
    const { t }                             = useTranslation();
    const [textToCopy,setTextToCopy] = useState();
    const [showCopyText,setShowCopyText] = useState(false);
    const [showShare,setShowShare] = useState(false)
    const copyData = (data) => {
        if (data){
            navigator.clipboard.writeText(data).then(r => {
                setTextToCopy(data)
                setShowCopyText(true)
            });
        }
    }
    useEffect(()=>{
        setTimeout(()=>setShowCopyText(false), 4000)
    },[textToCopy])
    useEffect(()=>{
        console.log(data);
        console.log(cart);
    },[])
    return (
        <div className="">
            <div className="up-view-table my-4">
                <div className="d-flex align-items-center table-in-view position-relative p-3">
                    <div className="text-center flex-fill head-title">
                        <h6 className="fw-light">{t('draw.ticketType')}</h6>
                        <div className="d-flex align-items-center justify-content-center">
                            <h6 className="fw-light">{cart.cart_type_text}</h6>
                        </div>
                    </div>
                    <div className="text-center flex-fill head-title">
                        <h6 className="fw-light">{t('draw.drawSeries')}</h6>
                        <div className="d-flex align-items-center justify-content-center">
                            <h6 className="fw-light">{data.draw.series}</h6>
                        </div>
                    </div>
                    <div className="text-center flex-fill head-title">
                        <h6 className="fw-light">{t('draw.drawDate')}</h6>
                        <div className="d-flex align-items-center justify-content-center">
                            <h6 className="fw-light">{data.draw.date}</h6>
                        </div>
                    </div>
                    <div className="text-center flex-fill head-title">
                        <h6 className="fw-light">{t('draw.winnings')}</h6>
                        <div className="d-flex align-items-center justify-content-between last-view">
                            <h6 className="fw-light flex-fill">{t('draw.results')}</h6>
                            <h6 className="fw-light flex-fill">{t('draw.prizeValue')}</h6>
                        </div>
                    </div>

                </div>

                <div className="">    
                    <div className="position-relative pb-4 over-x">
                        {cart.lines.map((line,idx) => <div key={line.id} className="fleCol d-flex align-items-center justify-content-between pb-3">
                            <div className="block-item d-flex align-items-center position-relative px-4 py-2 flex-70">
                                <span className="fw-light">#{idx+1}</span>
                                <div className='lis-number d-flex align-items-center justify-content-center mx-1'>
                                    {data.draw.type === 'millionaire'
                                        ? <>
                                            {line.luckynumber5.map(num => <span key={num} className={`mx-1 ${data.draw.numbers5.includes(String(num)) && 'text-white bgMainColor'}`}>{num}</span>)}
                                            {line.luckynumber2.map(num => <span key={num} className={`mx-1 ${data.draw.numbers2.includes(String(num)) && 'text-white bgSecondColor'}`}>{num}</span>)}
                                        </>
                                        : <div className={'fw-bold fs-5'}>
                                            TD- {line.ticket}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="d-flex align-items-center flex-30">
                                <h6 className="fw-light mainColor px-4">{line.status_text}</h6>
                                <h6 className="fw-light px-4">{line.prize > 0 && 'AED'} {line.prize}</h6>
                            </div>
                        </div>)}

                        {data.draw.type==='millionaire' && <div className="fleCol d-flex align-items-center justify-content-between pb-3">
                            <div
                                className="block-item d-flex align-items-center position-relative px-4 py-2 flex-70">
                                <div className="d-flex align-items-center">
                                    <h5 className="fw-light m-0">{t('draw.raffleID')}</h5>
                                    <h5 className="fw-light mainColor mx-2 m-0">9160245876</h5>
                                </div>
                            </div>
                            <div className="d-flex align-items-center flex-30">
                                <h6 className="fw-light mainColor px-4">{t('draw.win')}</h6>
                                <h6 className="fw-light px-4">AED 5,000.00</h6>
                            </div>
                        </div>}

                        <div className="px-4">
                            <div className="bgGrayColor fleCol p-3 rounded-3 d-flex align-items-center justify-content-between">
                                <div />
                                <div className="d-flex align-items-center">
                                    {showCopyText && <span className={'me-3'}>{t('app.copied')}</span>}
                                    <h6 className="fw-light m-0">{t('draw.refferalCode')}</h6>
                                    <div className="d-flex align-items-center position-relative">
                                        <div className="copy-click" onClick={()=>copyData('ALAND12461')}>
                                            <span>ALAND12461</span>
                                            <i className="icon-copy ms-3 mainColor"/>
                                        </div>
                                        <i className="icon-share-f mainColor" onClick={()=>setShowShare(!showShare)}/>
                                        {showShare && <ShareWrapper email facebook messenger twitter whatsApp url={'google.com'}/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}