import {LoadData, TicketCheckerResult} from "../../index";
import {InputSelect} from "../../Inputs/InputSelect";
import {PreviousDraws} from "../PreviousDraws";
import Link from "next/link";
import {PrizePolicyTable} from "../../PrizePolicyTable";
import {useTranslation} from "react-i18next";

export const DrawResult = ({
                           data,
                           dataLoading,
                           inVal,
                           updateDate,
                           resultType,
                           resultDescription,
                           ...props}) => {
    const { t }                             = useTranslation();

    return (
        <div className='result-millionaire'>

            <p>{resultDescription}</p>

            <div className='my-4'>
                <TicketCheckerResult drawDetails={data.draw} drawType={resultType} inVal={inVal} />
            </div>

            {/*{*/}
            {/*    isActive ?*/}
            {/*    <div className='block-checked rounded-3'>*/}
            {/*        <div className='d-flex align-items-center justify-content-between bgMainColor p-4'>*/}
            {/*            <h5 className='m-0 fw-light flex-fill text-center text-white'>{t("result.millionaire.yTicketNumber")}</h5>*/}
            {/*            <button onClick={()=> setIsActive(false)} className='icon-x-circle bg-transparent text-white fs-4' />*/}
            {/*        </div>*/}
            {/*        <div className='block-checked-body old-shadow overflow-hidden py-5'>*/}
            {/*            <div className='lis-number d-flex align-items-center justify-content-center my-5'>*/}
            {/*                {*/}
            {/*                    lisNum2.map((item, i) => (*/}
            {/*                        <span key={i}>{item}</span>*/}
            {/*                    ))*/}
            {/*                }*/}
            {/*            </div>*/}
            {/*            <div className='d-flex align-items-center justify-content-center my-3'>*/}
            {/*                <button onClick={toggle} className='bgMainColor text-white btn-button mx-2'>{t("result.millionaire.check")}</button>*/}
            {/*                <button onClick={()=> setIsActive(false)} className='bgSecondColor btn-button mx-2'>{t("result.millionaire.clear")}</button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    :*/}
            {/*    null*/}
            {/*}*/}

            {/*{*/}
            {/*    isAct ?*/}
            {/*    <div className='block-checked bgGrayColor old-shadow rounded-3 p-4'>*/}
            {/*        <div className='d-flex align-items-center justify-content-between'>*/}
            {/*            <span/>*/}
            {/*            <button onClick={toggle} className='icon-x-circle bg-transparent fs-4' />*/}
            {/*        </div>*/}
            {/*        <div className='text-center'>*/}
            {/*            <h5 className='fw-light'>Draw 03-07-2022</h5>*/}
            {/*            <div className='lis-number d-flex align-items-center justify-content-center my-5'>*/}
            {/*                {*/}
            {/*                    lisNum2.map((item, i) => (*/}
            {/*                        <span key={i}>{item}</span>*/}
            {/*                    ))*/}
            {/*                }*/}
            {/*            </div>*/}
            {/*            <h5 className='fw-light'>You matched : 2 Ball</h5>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    :*/}
            {/*    null*/}
            {/*}*/}

            <div className='my-5'>
                {data.previous_draws_dates.length > 0 &&
                    <>
                        <h4 className='text-center fw-light my-4'>{t("result.millionaire.perviousResults")}</h4>
                        <div className="select-add w-50 m-auto">
                            <InputSelect
                                onChange={updateDate}
                                options={data.previous_draws_dates.map(date=> ({label:date.draw_date,value:date.draw_date}))}
                                placeholder={'Choose date here'}
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

            {data.previous_draws.length > 6 &&
                <Link href={'/'}
                      className='text-white m-auto my-5 btn-button bgMainColor d-flex align-items-center justify-content-center'>
                    Load More
                </Link>
            }

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