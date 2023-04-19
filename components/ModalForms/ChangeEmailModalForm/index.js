import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {
    getProfileAuth,
    updateEmailCheckCode,
    updateEmailSendCode,
} from "../../../redux-toolkit/actions";
import {InputText} from "../../Inputs/InputText";
import {InputOtp} from "../../Inputs/InputOtp";
import Image from 'next/image';

export const ChangeEmailModalForm = (props) => {
    const { t } = useTranslation();
    const user = useSelector((state) => state.user.user);
    const inputState = useSelector((state) => state.inputState.state);
    const currency                               = useSelector((state) => state.currency.currency);
    const router = useRouter();
    const dispatch = useDispatch();
    const langVal = useSelector((state) => state.language.language);
    const [ isLoading,setIsLoading ]    = useState(false);

    //#region enter new email form
    let emailSchema = yup.object().shape({
        email:yup.string().required(t('register.form_errors.email.required'))
            .email(t('register.form_errors.email.email')),
    });
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(emailSchema),
    });
    const submitHandler = (data) => {
        setIsLoading(true)
        dispatch(updateEmailSendCode(data,langVal,user.token,currency)).then((e)=>{
            setIsLoading(false);
        }).catch(e=>setIsLoading(false))
    }
    //#endregion

    //#region new email otp
    const [otpCode,setOtpCode] = useState('')
    const verifyOtp = () => {
        const verData = { code : otpCode }
        dispatch(updateEmailCheckCode(verData, langVal, user.token,currency)).then(()=>{
            dispatch(getProfileAuth(langVal,user.token,currency))
        });
    }
    //#endregion
  return (
      <div>
          {inputState === 'input-start' && <form className={'auth'} onSubmit={handleSubmit(submitHandler)}>
              <InputText
                  label={t('register.labels.email')}
                  {...register('email')}
                  errorMessage={errors.email && errors.email.message}
              />
              <button className='btn-button bgMainColor text-white d-table m-auto my-4'>
                  {isLoading
                      ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                      : <span>{t('register.register_button')}</span>
                  }
              </button>
          </form>}
          {inputState === 'input-otp' && <div className={'d-flex flex-column align-items-center my-2'}>
              <div className={'mb-5 fs-5'}>{t('verify_email.title')}</div>
              <div className={'mb-5'}>
                  <InputOtp
                      otpCode={otpCode}
                      setOtpCode={setOtpCode}
                      submitOtpCode={verifyOtp}
                      showLoading
                  />
              </div>
          </div>}
          {inputState === 'input-success' && <div className={'d-flex flex-column align-items-center my-2'}>
              <div className="success-image-wrapper">
                  <Image style={{ objectFit:"contain" }} width={150} height={150} className='mb-3' src="/img/email.png" alt="TD logo"/>
              </div>
              <p className="success-message fs-6 text-center">{t('verify_email.disclaimer_message')}</p>
          </div>}
      </div>
  )
}