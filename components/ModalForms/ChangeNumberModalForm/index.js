import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {InputSelect} from "../../Inputs/InputSelect";
import codeCountry from "../../../codeCountry.json";
import {InputText} from "../../Inputs/InputText";
import {useTranslation} from "react-i18next";
import {getProfileAuth, hideModalAction, updatePhoneCheckCode, updatePhoneSendCode} from "../../../redux-toolkit/actions";
import {InputOtp} from "../../Inputs/InputOtp";
import Image from 'next/image';

export const ChangeNumberModalForm = (props) => {
  const inputState = useSelector((state) => state.inputState.state);
  const { t } = useTranslation();
  const user = useSelector((state) => state.user.user);
  const currency                               = useSelector((state) => state.currency.currency);
  const router = useRouter();
  const dispatch = useDispatch();
  const langVal = useSelector((state) => state.language.language);
  const [ isLoading,setIsLoading ]    = useState(false);

  //#region enter new number form
  let numberSchema = yup.object().shape({
    country_code:yup.string().required(t('register.form_errors.country_code')),
    phone:yup.string()
        .required(t('register.form_errors.phone.required'))
        .matches(/^\d+$/,t('register.form_errors.phone.matches'))
        .min(9,t('register.form_errors.phone.min'))
        .max(10,t('register.form_errors.phone.max')),
  });
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    mode:'onTouched',
    resolver: yupResolver(numberSchema),
  });
  const submitHandler = (data) => {
    setIsLoading(true)
    dispatch(updatePhoneSendCode(data,langVal,user.token,currency)).then(()=>{
      setIsLoading(false);
    }).catch(e=>setIsLoading(false))
  }
  //#endregion

  //#region new number otp
  const [otpCode,setOtpCode] = useState('')
  const verifyOtp = () => {
    const verData = { code : otpCode }
    dispatch(updatePhoneCheckCode(verData, langVal, user.token,currency)).then(()=>{
      dispatch(getProfileAuth(langVal, user.token,currency))
    });
  }
  //#endregion

  return (
      <div>
        {
          inputState === 'input-start' && 
          <form className={'auth'} onSubmit={handleSubmit(submitHandler)}>

            <div className="mb-2">
                <label className='mb-2 fw-light'>{t('register.labels.phone')}</label>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="select-add phone-select">
                    <Controller
                        control={control}
                        defaultValue={''}
                        name='country_code'
                        render={({ field, value, ref })=>
                            <InputSelect
                                error={(errors.phone && errors.phone.message) || (errors.country_code && errors.country_code.message)}
                                inputRef={ref}
                                value={codeCountry.find(c => c.value === value)}
                                onChange={val => field.onChange(val.value)}
                                placeholder={t('register.placeholders.select')}
                                withInput
                                options={codeCountry.map(item=>({label:item.value,value:item.value}))}
                            />
                        }
                    />
                  </div>
                  <div className="flex-fill">
                    <InputText
                        withSelect {...register('phone')}
                        hasError={(errors.phone && errors.phone.message) || (errors.country_code && errors.country_code.message)}
                    />
                  </div>
                </div>
                {errors.country_code && <small className='text-danger mx-2'>{errors.country_code.message}</small>}
                {errors.phone && <small className='text-danger'>{errors.phone.message}</small>}
            </div>
            
            <button className='btn-button bgMainColor text-white d-table m-auto my-4'>
              {isLoading
                  ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                  : <span>{t('register.register_button')}</span>
              }
            </button>

          </form>
        }
        {
          inputState === 'input-otp' && 
          <div className={'d-flex flex-column align-items-center my-2'}>
              <h5 className={'mb-5'}>{t('verify_number.title')}</h5>
              <div className={'mb-5'}>
                <InputOtp
                  otpCode={otpCode}
                  setOtpCode={setOtpCode}
                  submitOtpCode={verifyOtp}
                  showLoading
                />
              </div>
          </div>
        }
        {
          inputState === 'input-success' && 
          <div className={'d-flex flex-column align-items-center my-2'}>
            <div className="success-image-wrapper">
              <Image style={{ objectFit:"contain" }} width={150} height={150} className='mb-3' src="/img/smartphone.png" alt="TD logo"/>
            </div>
            <p className="success-message fs6 text-center">{t('verify_number.disclaimer_message')}</p>
          </div>
        }
      </div>
  )
}