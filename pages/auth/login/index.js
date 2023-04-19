import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation} from "react-i18next";
import { InputSelect } from "../../../components/Inputs/InputSelect";
import { InputText } from "../../../components/Inputs/InputText";
import { loginAuth } from '../../../redux-toolkit/actions';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router';
import * as yup from "yup";
import Link from "next/link";
import codeCountry from "../../../codeCountry.json";
import Image from 'next/image';

export default function Login() {
    const { t }                                 = useTranslation();
    const dispatch                              = useDispatch();
    const router                                = useRouter();
    const currency                               = useSelector((state) => state.currency.currency);
    const langVal                               = useSelector((state) => state.language.language);
    const [ isLoading, setIsLoading ]           = useState(false);
    const [ isNumber, setIsNumber ]             = useState(false);


    let loginSchema = yup.object().shape({
        code:yup.string().when([],{
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
        }),
        password:yup.string().required(t('login.password_required'))
            .min(6,t('login.password_min_length')),
    })

    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(loginSchema)
    });

    const submitHandler = data => {

        const verData = {
            phone_or_email          : data.phone_or_email,
            country_code            : data.code,
            password                : data.password,
            device_id               : localStorage.getItem('deviceToken'),
            device_type             : 'web'
        }

        setIsLoading(true);

        dispatch(loginAuth(verData, router, langVal, currency)).then(() => {
            setIsLoading(false);
        }).catch((err) => {
            setIsLoading(false);
        });

    }

    const startsWithNumber = (str) => /^\d/.test(str);

    useEffect(()=>{
        const subscription = watch((value) => {
            if (startsWithNumber(value.phone_or_email)) setIsNumber(true)
            else setIsNumber(false)
        });
        return () => subscription.unsubscribe();
    },[watch])

    return (
        <div className='auth'>
            <div className='container'>

                <div className='row'>
                    <div className='col-md-6 col-xs-12'>
                        <div className='d-flex justify-content-center flex-column px-3 box-form'>
                            <form onSubmit={handleSubmit(submitHandler)}>
                                <div className='my-3'>
                                    <label className='mb-2 fw-light'>{t('login.email_or_phone_label')}</label>
                                    <div className={isNumber ? 'd-flex justify-content-center align-items-center' : "position-relative"}>
                                        {
                                            isNumber && <div className='select-add phone-select'>
                                                <Controller
                                                    control={control}
                                                    defaultValue={''}
                                                    name='code'
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
                                <div className='my-3'>
                                    <InputText 
                                        label={t('login.password_label')}
                                        passWordIcon
                                        type={'password'}
                                        {...register("password")}
                                        errorMessage={errors.password && errors.password.message}
                                    />
                                </div>

                                <div className=''>
                                    <div className='d-flex justify-content-between align-items-center my-4'>
                                        <Link href={'/auth/forget-password'}>
                                            <span className='mainColor fw-light'>{t('login.forgot_password')}</span>
                                        </Link>
                                        { 
                                            isLoading ?
                                            <button className='btn-button bgMainColor text-white'>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            </button>
                                            : 
                                            <button className='btn-button bgMainColor text-white' type={'submit'}>
                                                <span>{t('login.login_button')}</span>
                                            </button>
                                        }
                                    </div>
                                    <Link href={'/auth/register'}>
                                        <span className='fw-light text-dark'>{t('login.new_account')}</span>
                                    </Link>
                                </div>
                            </form>
                            <div className='continue-with my-3'>
                                <p className='position-relative text-center my-4 fw-light'>{t('login.continueWith')}</p>
                                <div className='contact-social d-flex justify-content-center align-items-center'>
                                    <button><Image style={{ objectFit : "contain" }} width={30} height={30} alt='google' src='/img/google.png' /></button>
                                    <button><Image style={{ objectFit : "contain" }} width={30} height={30} alt='apple' src='/img/apple.png' /></button>
                                    <button><Image style={{ objectFit : "contain" }} width={30} height={30} alt='facebook' src='/img/facebook.png' /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 col-xs-12 none-mobile'>
                        <div className='welcome-message overflow-hidden position-relative d-flex justify-content-center flex-column align-items-center p-4'>
                            <Image style={{ objectFit : "contain" }} width={130} height={130} className='my-3' src="/img/TD.png" alt="TD logo"/>
                            <p className='text-white text-center fw-light'>{t('login.form_message')}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
  )
}
  