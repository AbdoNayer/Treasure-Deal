import {useTranslation} from "react-i18next";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useState} from "react";
import {InputOtp} from "../../Inputs/InputOtp";
import {InputText} from "../../Inputs/InputText";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {resetPasswordAuth} from "../../../redux-toolkit/actions";

export const ResetPasswordForm = ({ inData }) => {

    const { t }                             = useTranslation();
    const [ isLoading,setIsLoading ]        = useState(false);
    const [ otpCode,setOtpCode ]            = useState('');
    const dispatch                          = useDispatch();
    const router                            = useRouter();
    const currency                               = useSelector((state) => state.currency.currency);
    const langVal                           = useSelector((state) => state.language.language);

    //#region form validation schema
    let resetPassword = yup.object().shape({
        password:yup.string().required(t('register.form_errors.password.required'))
            .min(6,t('register.form_errors.password.min')),
        confirm_password:yup.string().required(t('register.form_errors.confirm_password.required'))
            .oneOf([yup.ref('password'), null],t('register.form_errors.confirm_password.matches')),
    })
    //#endregion

    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(resetPassword)
    });

    const submitHandler = data => {
        
        setIsLoading(true);

        const resetData = {
            country_code        : inData.country_code ? inData.country_code : null,
            phone_or_email      : inData.phone_or_email,
            code                : otpCode,
            password            : data.password,
        }

        dispatch(resetPasswordAuth(resetData, router, langVal, currency)).then(() => {
            setIsLoading(false);
        }).catch((err) => {
            setIsLoading(false);
        });

    }

    return (
        <div className={'auth'}>
            <form className={'text-start'} onSubmit={handleSubmit(submitHandler)}>
                <label className="text-center mt-4 mb-4 w-100 fw-light">{t('reset_password.labels.otp')}</label>
                <InputOtp
                    setOtpCode={setOtpCode}
                    otpCode={otpCode}
                />
                <div className="mx-5 mb-4 mt-4">
                    <InputText
                        label={t('reset_password.labels.new_password')}
                        passWordIcon
                        type={'password'}
                        {...register('password')}
                        errorMessage={errors.password && errors.password.message}
                    />
                </div>
                <div className="mx-5 mb-4 mt-4">
                    <InputText
                        label={t('reset_password.labels.confirm_new_password')}
                        passWordIcon
                        type={'password'}
                        {...register('confirm_password')}
                        errorMessage={errors.confirm_password && errors.confirm_password.message}
                    />
                </div>
                { 
                    isLoading ?
                    <button className='btn-button bgMainColor text-white d-table m-auto my-5'>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </button>
                    : 
                    <button className='btn-button bgMainColor text-white d-table m-auto my-5' type={'submit'}>
                        <span>{t('reset_password.reset')}</span>
                    </button>
                }
            </form>

        </div>
    )

}