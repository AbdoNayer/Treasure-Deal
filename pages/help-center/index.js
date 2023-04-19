import {useTranslation} from "react-i18next";
import {InputText} from "../../components/Inputs/InputText";
import {useApi} from "../../hooks/useApi";
import {getFAQs, getParticipationSteps} from "../../redux-toolkit/actions/axiosCalls";
import {useSelector} from "react-redux";
import {useEffect, useState, useRef} from "react";
import {FaqQuestion} from "../../components/FaqQuestion";
import {LoadData} from "../../components";
import {useTable} from "../../hooks/table-hook";
import {WinningSteps} from "../../components/WinningSteps";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function HelpCenter() {
    const { t }          = useTranslation();
    const currency       = useSelector((state) => state.currency.currency);
    const langVal        = useSelector((state) => state.language.language);
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
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(contactUsValidation),
    });
    const submitHandler = data => {
        console.log(data);
        // (async () => await addNewAddresses(user.token,langVal,currency,addressData))().then(r=> console.log(r))
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
                    <h1>Help Center</h1>
                    <p className='mt-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio. Fugit iste asperiores repellendus voluptate omnis iusto officiis nam praesentium. Add your vouchers more you can play more lotto at the time.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio. Fugit iste asperiores repellendus voluptate omnis iusto officiis nam praesentium. Add your vouchers more you can play more lotto at the time.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                </div>
                <div className='how-to-play py-4 my-4'>
                    <h3 className='text-center my-5'>How to participate</h3>
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
                        <h2>FAQ</h2>
                        <h5 className={'mt-4'}>Frequently asked questions</h5>
                        <InputText className={'w-50 mt-4'} placeholder={'Search'} onChange={createSearchHandler(obj=>obj.title)} />
                    </div>
                    {isFaqsLoading
                        ? <div className={'modal-height-view position-relative'}><LoadData/></div>
                        : <>
                            {filteredObjs.length > 0
                                ? <div className={'mx-auto w-75'}>
                                    {filteredObjs.map(faq => <FaqQuestion key={faq.id} title={faq.title} description={faq.description}/>)}
                                </div>
                                : <div>No Faqs Available</div>
                            }
                        </>
                    }

                </div>
                <hr />
                <div className="py-4">
                    <div className="pb-5">
                        <h3 className='text-center my-4'>Still Have Questions?</h3>
                        <p className='mt-4 text-center fs-5'>can't find the answer you are looking for? please chat with our friendly team</p>
                    </div>
                    <form onSubmit={handleSubmit(submitHandler)} className="row mt-4 w-75 m-auto">
                        <div className="col-4">
                            <InputText label={'Name'} {...register('name')} errorMessage={errors.name?.message}/>
                        </div>
                        <div className="col-4">
                            <InputText label={'phone'} {...register('phone')} errorMessage={errors.phone?.message}/>
                        </div>
                        <div className="col-4">
                            <InputText label={'Email'} {...register('email')} errorMessage={errors.email?.message}/>
                        </div>
                        <div className="col-12 my-3">
                            <InputText label={'Subject'} {...register('subject')} errorMessage={errors.subject?.message}/>
                        </div>
                        <div className="col-12">
                            <label className="fw-light mb-2">Message</label>
                            <textarea className={errors.message?.message && 'border-danger'} {...register('message')}/>
                            {errors.message?.message && <p className={'text-danger'}>{errors.message?.message}</p>}
                        </div>
                        <button className={'btn-button bgMainColor text-white m-auto mt-4'}>Submit</button>
                    </form>

                </div>
            </div>
        </div>
    )
}
