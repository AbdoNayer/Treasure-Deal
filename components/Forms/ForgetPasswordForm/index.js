import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {InputSelect} from "../../Inputs/InputSelect";
import {InputText} from "../../Inputs/InputText";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {forgotPasswordAuth} from "../../../redux-toolkit/actions";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import * as yup from "yup";
import codeCountry from "../../../codeCountry.json";

export const ForgetPasswordForm = () => {
    const langVal                               = useSelector((state) => state.language.language);
    const currency                               = useSelector((state) => state.currency.currency);
    const { t }                                 = useTranslation();
    const [ isLoading, setIsLoading ]           = useState(false);
    const dispatch                              = useDispatch();
    const router                                = useRouter();


    let forgetPassword = yup.object().shape({
        country_code:yup.string().when([],{
            is: ()=> isNumber,
            then: yup.string().required(t("login.country_selector_required_error_message")),
            otherwise: yup.string().notRequired()
        }),
        phone_or_email: yup.string().when([],{
            is:()=> isNumber,
            then: yup.string()
                .matches(/^\d+$/,t('login.phone_email_error_messages.numbers_only'))
                .required(t('login.phone_email_error_messages.phone_required'))
                .min(9,t('login.phone_email_error_messages.phone_min_length'))
                .max(10,t('login.phone_email_error_messages.phone_max_length')),
            otherwise: yup.string()
                .required(t('login.phone_email_error_messages.email_required'))
                .email(t('login.phone_email_error_messages.email_format'))
        })
    })

    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(forgetPassword)
    });

    
    const [ isNumber, setIsNumber ] = useState(false);
    const startsWithNumber = (str) => /^\d/.test(str);
    useEffect(()=>{
        const subscription = watch((value) => {
            if (startsWithNumber(value.phone_or_email)) setIsNumber(true)
            else setIsNumber(false)
        });
        return () => subscription.unsubscribe();
    },[watch])

    const submitHandler = data => {

        setIsLoading(true);

        const verData = {
            phone_or_email          : data.phone_or_email,
            country_code            : isNumber ? data.country_code : null,
        }

        dispatch(forgotPasswordAuth(verData, router, langVal, currency)).then(() => {
            setIsLoading(false);
        }).catch((err) => {
            setIsLoading(false);
        });

    }

    return (
        <div className={'auth'}>
            <form className={'text-start'} onSubmit={handleSubmit(submitHandler)}>
                <div className='my-3 mt-5 mx-3'>
                    <label className='mb-2 fw-light'>{t('forget_password.email_or_phone_label')}</label>
                    <div className={isNumber ? 'd-flex justify-content-center align-items-center' : "position-relative"}>
                        {
                            isNumber && <div className='select-add phone-select'>
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name='country_code'
                                    render={({field,value,ref}) =>
                                        <InputSelect
                                            {...field}
                                            placeholder={t('login.country_selector_placeholder')}
                                            error={errors.country_code || errors.phone_or_email}
                                            inputRef={ref}
                                            value={codeCountry.find(c => c.value === value)}
                                            onChange={val => field.onChange(val.value)}
                                            withInput
                                            options={codeCountry.map(item=>({label:item.value,value:item.value}))}
                                        />
                                    }
                                />
                            </div>
                        }
                        <div className='flex-fill'>
                            <InputText
                                withSelect={isNumber}
                                {...register("phone_or_email")}
                                hasError={errors.phone_or_email || errors.country_code}
                            />
                        </div>
                    </div>
                    {
                        (errors.phone_or_email||errors.country_code) &&
                        <div>
                            {isNumber && <small className='text-danger'>{errors.country_code && errors.country_code.message}</small>}
                            <small className='text-danger'>{errors.phone_or_email && errors.phone_or_email.message}</small>
                        </div>
                    }
                </div>
                { 
                    isLoading ?
                    <button className='btn-button bgMainColor text-white d-table m-auto my-5'>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </button>
                    : 
                    <button className='btn-button bgMainColor text-white d-table m-auto my-5' type={'submit'}>
                        <span>{t('forget_password.next')}</span>
                    </button>
                }
            </form>
        </div>
    )
}