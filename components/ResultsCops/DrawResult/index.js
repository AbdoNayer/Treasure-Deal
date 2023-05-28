import {LoadData, TicketCheckerResult} from "../../index";
import {InputSelect} from "../../Inputs/InputSelect";
import {PreviousDraws} from "../PreviousDraws";
import Link from "next/link";
import {PrizePolicyTable} from "../../PrizePolicyTable";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {InputText} from "../../Inputs/InputText";

export const DrawResult = ({
                           data,
                           dataLoading,
                           inVal,
                           updateDate,
                           resultType,
                           resultDescription,
                           ...props}) => {
    const { t }                                             = useTranslation();
    const [isActive,setIsActive]                            = useState(false)
    const [isChecked,setIsChecked]                          = useState(false)
    const [errorMessage,setErrorMessage]                    = useState('')
    const [checkedNumbers,setCheckedNumbers] = useState({
        '1':'',
        '2':'',
        '3':'',
        '4':'',
        '5':'',
        '6':'',
        '7':'',
    })
    useEffect(()=>{
        console.log(Object.values(checkedNumbers));
        console.log(Object.values(checkedNumbers).splice(0,5) )
        console.log(Object.values(checkedNumbers).splice(5,2) )
    },[checkedNumbers])

    const checkingState = (value,index) => {
        setCheckedNumbers(prevState => ({
            ...prevState,
            [`${index+1}`]:value
        }))
    }
    
    const findDuplicates = (arr) => {
        return arr.some((element, index) => {
            return arr.indexOf(element) !== index
        })
    }
    
    const toggle = () => {
        findDuplicates(Object.values(checkedNumbers).splice(5,2))
        if (Object.values(checkedNumbers).filter(item=> item.trim()).length < 7) {
                setErrorMessage(t('app.makeSNumbers'))
                return
        }
        if (findDuplicates(Object.values(checkedNumbers).splice(0,5))) {
            setErrorMessage(t('app.removeNumbers'))
            return
        }
        if (findDuplicates(Object.values(checkedNumbers).splice(5,2))) {
            setErrorMessage(t('app.removeDunumbers'))
            return
        }
        setIsChecked(true)
        setErrorMessage('')
    }

    return (
        <div className='result-millionaire'>

            <p>{resultDescription}</p>

            <div className='my-4'>
                <TicketCheckerResult drawDetails={data.draw} drawType={resultType} toggle={() => setIsActive(true)}/>
            </div>

            {isActive &&
                <div className='block-checked rounded-3'>
                    <div className='d-flex align-items-center justify-content-between bgMainColor p-4'>
                        <h5 className='m-0 fw-light flex-fill text-center text-white'>{t("result.millionaire.yTicketNumber")}</h5>
                        <button onClick={()=> {
                            setIsActive(false)
                            setIsChecked(false)
                        }} className='icon-x-circle bg-transparent text-white fs-4' />
                    </div>
                    <div className='block-checked-body old-shadow overflow-hidden py-5'>
                        <div className='lis-number d-flex align-items-center justify-content-center my-5'>
                            {
                                [...Array(7).keys()].map((item, i) => (
                                    <InputText key={i} value={checkedNumbers[i+1]} disabled={isChecked} onChange={e=> checkingState(e.target.value,i)} className={'td_checkerInput'} maxLength={2}/>
                                ))
                            }
                        </div>
                            {errorMessage && <h4 className={'text-danger text-center my-3'}>{errorMessage}</h4>}
                        <div className='d-flex align-items-center justify-content-center my-3'>
                            <button onClick={toggle} className='bgMainColor text-white btn-button mx-2'>{t("result.millionaire.check")}</button>
                            <button onClick={()=> {
                                setCheckedNumbers({
                                    '1':'',
                                    '2':'',
                                    '3':'',
                                    '4':'',
                                    '5':'',
                                    '6':'',
                                    '7':'',
                                })
                                setIsChecked(false)
                                setErrorMessage('')
                            }} className='bgSecondColor btn-button mx-2'>{t("result.millionaire.clear")}</button>
                        </div>
                    </div>
                </div>
            }

            {isChecked &&
                <div className='block-checked bgGrayColor old-shadow rounded-3 p-4'>
                    <div className='d-flex align-items-center justify-content-between'>
                        <span/>
                        <button onClick={()=>setIsChecked(false)} className='icon-x-circle bg-transparent fs-4' />
                    </div>
                    <div className='text-center'>
                        <h5 className='fw-light'>{t('app.draw')} {data.draw.date}</h5>
                        <div className='lis-number d-flex align-items-center justify-content-center my-5'>
                            {
                                Object.values(checkedNumbers).splice(0,5).map((item,i) =>
                                    <span key={i} className={data.draw.numbers5.includes(Object.values(checkedNumbers).splice(0,5)[i].trim()) ? 'bgMainColor text-white': ''}>{item}</span>
                                )
                            }
                            {
                                Object.values(checkedNumbers).splice(5,2).map((item,i) =>
                                    <span key={i} className={data.draw.numbers2.includes(Object.values(checkedNumbers).splice(5,2)[i].trim()) ? 'bgSecondColor': ''}>{item}</span>
                                )
                            }
                        </div>
                        <h5 className='fw-light'>You matched : {
                            Object.values(checkedNumbers).splice(0,5).filter(item => data.draw.numbers5.includes(item.trim())).length
                            + Object.values(checkedNumbers).splice(5,2).filter(item => data.draw.numbers2.includes(item.trim())).length
                        } Ball</h5>
                    </div>
                </div>
            }

            <div className='my-5'>
                {data.previous_draws_dates.length > 0 &&
                    <>
                        <h4 className='text-center fw-light my-4'>{t("result.millionaire.perviousResults")}</h4>
                        <div className="select-add select-full w-50 m-auto">
                            <InputSelect
                                onChange={updateDate}
                                options={data.previous_draws_dates.map(date=> ({label:date.draw_date,value:date.draw_date}))}
                                placeholder={t('app.chooseHere')}
                            />
                        </div>
                    </>
                }
            </div>

            <div className='row'>
                {dataLoading
                    ? <div className={'modal-height-view position-relative'}><LoadData/></div>
                    : data.previous_draws.length > 0
                        ? <PreviousDraws previousDraw={data.previous_draws} drawType={resultType} />
                        : null
                }
            </div>

            {/*{data.previous_draws.length > 6 &&*/}
            {/*    <Link href={'/'}*/}
            {/*          className='text-white m-auto my-5 btn-button bgMainColor d-flex align-items-center justify-content-center'>*/}
            {/*        Load More*/}
            {/*    </Link>*/}
            {/*}*/}

            {/*<div className='my-4'>*/}
            {/*    <BuyTicketsComp*/}
            {/*        drawType={resultType}*/}
            {/*        grandPrize={data.prize_matchings[0].prize}*/}
            {/*    />*/}
            {/*</div>*/}

            <div className='my-4'>
                <h4 className='text-center my-5'>{t("result.millionaire.prizePolicy")}</h4>
                <PrizePolicyTable prizes={data.prize_matchings} drawType={resultType}/>
            </div>

        </div>

    )
}