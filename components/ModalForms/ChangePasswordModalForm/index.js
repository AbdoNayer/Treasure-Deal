import {InputText} from "../../Inputs/InputText";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {useState} from "react";
import {hideModalAction, registerAuth, updatePassword} from "../../../redux-toolkit/actions";
import Image from 'next/image';

export const ChangePasswordModalForm = ({props}) => {
    const inputState = useSelector((state) => state.inputState.state);
    const { t }                         = useTranslation();
    const dispatch                      = useDispatch();
    const langVal                       = useSelector((state) => state.language.language);
    const user = useSelector((state) => state.user.user);
    const [ isLoading,setIsLoading ]    = useState(false);
    const currency                               = useSelector((state) => state.currency.currency);

    //#region new password form
    let changePasswordSchema = yup.object().shape({
        password:yup.string().required(t('register.form_errors.password.required'))
            .min(6,t('register.form_errors.password.min')),
        confirm_password:yup.string().required(t('register.form_errors.confirm_password.required'))
            .oneOf([yup.ref('password'), null],t('register.form_errors.confirm_password.matches')),
    });
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(changePasswordSchema)
    });

    //#endregion

    const submitHandler = data => {
        setIsLoading(true)
        dispatch(updatePassword({password:data.password}, langVal, user.token, currency)).then(() => {
            setIsLoading(false);
        }).catch((err) => {
            setIsLoading(false);
        });
    }
    return (
        <div>
            {inputState === 'input-start' && <form onSubmit={handleSubmit(submitHandler)} className={'auth'}>
        <div className="col-12 mb-4">
            <InputText
                label={t('register.labels.password')}
                passWordIcon
                type={'password'}
                {...register('password')}
                errorMessage={errors.password && errors.password.message}
            />
        </div>
        <div className="col-12 mb-4">
            <InputText
                label={t('register.labels.confirm_password')}
                passWordIcon
                type={'password'}
                {...register('confirm_password')}
                errorMessage={errors.confirm_password && errors.confirm_password.message}
            />
        </div>
        <button className='btn-button bgMainColor text-white d-table m-auto my-4'>
            {isLoading
                ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                : <span>{t('register.register_button')}</span>
            }
        </button>
    </form>}
            {inputState === 'input-success' && <div className={'d-flex flex-column align-items-center my-2'}>
                <div className="success-image-wrapper">
                    <Image style={{ objectFit:"contain" }} width={150} height={150} className='my-3' src="/img/reset-password.png" alt="TD logo"/>
                </div>
                <p className="success-message fs-6 text-center">{t('verify_email.disclaimer_message')}</p>
            </div>}
        </div>
    )

}