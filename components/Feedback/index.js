import React, {useEffect, useState} from 'react';
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import {StarRating} from "./StarRating";
import {submitRedeemFeedBack} from "../../redux-toolkit/actions/axiosCalls";
import {useDispatch, useSelector} from "react-redux";
import {hideModalAction} from "../../redux-toolkit/actions";

export default function FeedBack({redeemId,refetchRedeems,...props}) {
  
    const { t }                           = useTranslation();
    const user                            = useSelector((state) => state.user.user);
    const currency                    = useSelector((state) => state.currency.currency);
    const dispatch = useDispatch()
    const langVal                         = useSelector((state) => state.language.language);
    const [feedBackData,setFeedBackData]  = useState({
        overall:0,
        services:0,
        ambience:0,
        attracion:0
    })
    const [comment,setComment]            = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    const [isFeedBackLoading,setIsFeedBackLoading] = useState(false)

    useEffect(()=>{
        setErrorMessage('')
    },[feedBackData])
    const feedBacKContainsZeroRating = () => Object.values(feedBackData).some(value => value===0)
    const itemsRating = [
    {
        name : 'Overall',
        serviceName: 'overall',
    },
    {
        name : 'Services',
        serviceName: 'services',
    },
    {
        name : 'Ambience',
        serviceName: 'ambience',
    },
    {
        name : 'Attraction',
        serviceName: 'attracion',
    }
  ]
    const submitFeedBack = async () => {
        setIsFeedBackLoading(true)
        if (feedBacKContainsZeroRating()) {
            setErrorMessage('Select Rating before submitting')
            setIsFeedBackLoading(false)
            return
        }
        const data = {
            redeem_id:redeemId,
            ...feedBackData,
            comment:comment
        };
        await submitRedeemFeedBack(user.token,langVal,currency,data)
            .then(()=> {
                if (refetchRedeems){
                    refetchRedeems()
                    setIsFeedBackLoading(false)
                }
                dispatch(hideModalAction())
            })
            .catch(e=> {
                setErrorMessage(e.response.data.msg)
                setIsFeedBackLoading(false)
            })
    }

  return (
    <div className='feed-back'>

        <div className=''>
            <h5 className='fw-light text-start'>{t('booking.feedback.rateStars')}</h5>
            <p className='fw-light text-start'>Lorem ipsum uptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio.</p>
        </div>

        <div className=''>

            {
                itemsRating.map((item, i)=> (
                    <div key={i} className='d-flex align-items-center justify-content-between my-3'>
                        <h6 className='fw-light m-0'>{item.name}</h6>
                        <div className='stars'>
                            <StarRating serviceName={item.serviceName} setFeedBackData={setFeedBackData} />
                        </div>
                    </div>
                ))
            }

            <div className='comment pt-2'>
                <label className='fw-light text-start d-block mb-2 fs-6'>{t('booking.feedback.tellComments')}</label>
                <textarea onChange={event => setComment(event.target.value)}/>
                <button
                    className='btn-button bgMainColor text-white my-2 m-auto d-table'
                    onClick={submitFeedBack}
                >
                    {isFeedBackLoading
                        ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                        : <>{t('register.register_button')}</>
                    }

                </button>
                <div className={'text-center text-danger fs-5'}>{errorMessage}</div>
            </div>


        </div>


    </div>
  )
}