import {useTranslation} from "react-i18next";
import {InputText} from "../../components/Inputs/InputText";
import {useApi} from "../../hooks/useApi";
import {contactUsMessage, getFAQs, getParticipationSteps} from "../../redux-toolkit/actions/axiosCalls";
import {useSelector} from "react-redux";
import {useEffect, useState, useRef} from "react";
import {FaqQuestion} from "../../components/FaqQuestion";
import {LoadData} from "../../components";
import {useTable} from "../../hooks/table-hook";
import {WinningSteps} from "../../components/WinningSteps";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import Toastify from "toastify-js";
import {t} from "i18next";

export default function HelpCenter() {
    const { t }          = useTranslation();
    const currency       = useSelector((state) => state.currency.currency);
    const langVal        = useSelector((state) => state.language.language);
    const [isSubmitting,setIsSubmitting] = useState(false)
    const [winningType,setWinningType] = useState('millionaire')
    const didMount                                          = useRef(false);

    const {filteredObjs,setObjs,createSearchHandler} = useTable([])

    //#region yup validation schema
    let contactUsValidation = yup.object().shape({
        name:yup.string().required('required'),
        phone:yup.string().required('required'),
        email:yup.string().email().required('required'),
        subject:yup.string().required('required'),
        message:yup.string().required('required'),
    });
    //#endregion
    //#region form function
    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(contactUsValidation),
    });
    const submitHandler = data => {
        setIsSubmitting(true);
        (async () => await contactUsMessage(data))()
            .then(r=> {
                setIsSubmitting(false)
                reset()
                Toastify({
                    text: 'Submitted Successfully',
                    duration: 3000,
                    gravity: "top",
                    position: langVal === 'en' ? "left" : "right",
                    style: {
                        background: "#007427",
                    }
                }).showToast();
            })
            .catch(e=> {
                // console.log(e)
                setIsSubmitting(false)
            })
    }
    //#endregion
    const {
        data:faqsData,
        isLoading:isFaqsLoading,
        reFetch:refetchFaqs
    } = useApi(()=> getFAQs(langVal,currency))

    const {
        data:winningStepsData,
        isLoading:winningStepsLoading,
        reFetch:refetchWinningSteps
    } = useApi(()=> getParticipationSteps(langVal,currency,winningType))


    useEffect(()=>{
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        refetchWinningSteps()
    },[winningType])
    useEffect(()=>{
        if (faqsData) {
            if (faqsData.faqs){
                setObjs(faqsData.faqs)
            }
        }
    },[faqsData])

    return (
        <div className={'winners py-4'}>
            <div className={'container'}>
                <div className="td_header">
                    <h1>{t('app.helpCenter')}</h1>
                    <p className='mt-4'>{t('app.infoDis')}</p>
                </div>
                <div className='how-to-play py-4 my-4'>
                    <h3 className='text-center my-5'>{t('app.howParticipate')}</h3>
                    <div className='row'>
                        <div className='col-md-6 col-xs-12'>
                            <div
                                onClick={()=>setWinningType('millionaire')}
                                className={`block-tab my-4 rounded-3 position-relative text-center m-auto ${winningType==='millionaire' && 'active'}`}
                            >
                                <span>1</span>
                                <h6>{t('app.theBundle')}</h6>
                            </div>
                        </div>
                        <div className='col-md-6 col-xs-12'>
                            <div
                                onClick={()=>setWinningType('raffleillionaire_and_other')}
                                className={`block-tab my-4 rounded-3 position-relative text-center m-auto ${winningType==='raffleillionaire_and_other' && 'active'}`}
                            >
                                <span>2</span>
                                <h6>{t('app.raffl&Oth')}</h6>
                            </div>
                        </div>
                    </div>
                    <div className='maps pt-5'>
                        {/* <Image style={{ width : '100%' }} src={'/img/maps.png'} quality='100' alt='img' width={100} height={800} /> */}
                        {/* <img src={'/img/maps.png'} /> */}
                        <div className={'row'}>
                            {winningStepsData?.steps.map((step,i) => <WinningSteps index={i} key={step.id} step={step} />)}
                        </div>
                    </div>
                </div>
                <hr />
                <div className="py-4 my-4 text-center">
                    <div className="mb-5">
                        <h2>{t('app.FAQ')}</h2>
                        <h5 className={'mt-4'}>{t('app.freQuestions')}</h5>
                        <InputText className={'w-50 mt-4'} placeholder={t('user.profile.myChat.searchChat')} onChange={createSearchHandler(obj=>obj.title)} />
                    </div>
                    {isFaqsLoading
                        ? <div className={'modal-height-view position-relative'}><LoadData/></div>
                        : <>
                            {filteredObjs.length > 0
                                ? <div className={'mx-auto w-75'}>
                                    {filteredObjs.map(faq => <FaqQuestion key={faq.id} title={faq.title} description={faq.description}/>)}
                                </div>
                                : 
                                <div className='main-body-mini d-flex justify-content-center align-items-center'>
                                    <h3 className='text-danger text-center m-0'>{t('app.noFaqsAvailable')}</h3>
                                </div>
                            }
                        </>
                    }

                </div>
                <hr />
                <div className="py-4">
                    <div className="pb-5">
                        <h3 className='text-center my-4'>{t('app.stillHaveQuestions')}</h3>
                        <p className='mt-4 text-center fs-5'>{t('app.infoQus')}</p>
                    </div>
                    <form onSubmit={handleSubmit(submitHandler)} className="row mt-4 w-75 m-auto">
                        <div className="col-md-4 col-xs-12 my-2">
                            <InputText placeholder={t('app.name')} {...register('name')} errorMessage={errors.name?.message}/>
                        </div>
                        <div className="col-md-4 col-xs-12 my-2">
                            <InputText placeholder={t('app.phone')} {...register('phone')} errorMessage={errors.phone?.message}/>
                        </div>
                        <div className="col-md-4 col-xs-12 my-2">
                            <InputText placeholder={t('app.email')} {...register('email')} errorMessage={errors.email?.message}/>
                        </div>
                        <div className="col-md-12 col-xs-12 my-2">
                            <InputText placeholder={t('app.subject')} {...register('subject')} errorMessage={errors.subject?.message}/>
                        </div>
                        <div className="col-md-12 col-xs-12 my-2">
                            <textarea placeholder={t('app.message')} className={errors.message?.message && 'border-danger'} {...register('message')}/>
                            {errors.message?.message && <p className={'text-danger'}>{errors.message?.message}</p>}
                        </div>
                        <button className={'btn-button bgMainColor text-white m-auto mt-4'}>
                            {isSubmitting
                                ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                                : <>{t('register.register_button')}</>
                            }
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}
