import {useForm,Controller} from "react-hook-form";
import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from "react-i18next";
import { InputSelect } from "../../../components/Inputs/InputSelect";
import { InputText } from "../../../components/Inputs/InputText";
import {registerAuth, countries, showModalAction} from '../../../redux-toolkit/actions';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router';
import * as yup from 'yup';
import codeCountry from "../../../codeCountry.json";
import {ModalForm} from "../../../components/ModalForms/ModalForm";
import {useApi} from "../../../hooks/useApi";
import {getFreeLanceRequestData} from "../../../redux-toolkit/actions/axiosCalls";

export default function Register() {

    const { t }                         = useTranslation();
    const dispatch                      = useDispatch();
    const router                        = useRouter();
    const currency                      = useSelector((state) => state.currency.currency);
    const langVal                       = useSelector((state) => state.language.language);
    const nationalityOptions            = useSelector((state) => state.countries.countries);
    const [ isLoading,setIsLoading ]    = useState(false);
    const [ inInfluencer, setInInfluencer ]    = useState(false);
    const genderOptions = [
        {label: 'Male', value: 'Male'},
        {label: 'Female', value: 'Female'},
        {label: 'Other', value: 'Other'},
    ]
    const identificationOptions = [
        {label: 'Passport', value: 'passport'},
        {label: 'National Id', value: 'national-id'},
        {label: 'Driving License', value: 'driving-license'},
    ]

    const fetchData = () => { dispatch(countries(langVal)); }
    
    useEffect(() => { fetchData(); }, []);

    let registerSchema = yup.object().shape({
        first_name:yup.string().required(t('register.form_errors.first_name')),
        last_name:yup.string().required(t('register.form_errors.last_name')),
        country_code:yup.string().required(t('register.form_errors.country_code')),
        phone:yup.string()
            .required(t('register.form_errors.phone.required'))
            .matches(/^\d+$/,t('register.form_errors.phone.matches'))
            .min(9,t('register.form_errors.phone.min'))
            .max(10,t('register.form_errors.phone.max')),
        email:yup.string().required(t('register.form_errors.email.required'))
            .email(t('register.form_errors.email.email')),
        dob:yup.string().required(t('register.form_errors.dob')),
        gender:yup.string().required(t('register.form_errors.gender')),
        password:yup.string().required(t('register.form_errors.password.required'))
            .min(6,t('register.form_errors.password.min')),
        confirm_password:yup.string().required(t('register.form_errors.confirm_password.required'))
            .oneOf([yup.ref('password'), null],t('register.form_errors.confirm_password.matches')),
        nationality_id:yup.string().required(t('register.form_errors.nationality')),
        country_id:yup.string().required(t('register.form_errors.country')),
        // identification_type:yup.string(),
        // identification_value:yup.string(),
    });
    
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(registerSchema)
    });

    const watchIdentification = watch('identification_type');

    const openModal = modalType => {
        if (modalType==='terms') dispatch(showModalAction(<ModalForm title={t('app.termService')}>
            <p className="text-center mb-5">{t('app.termService')}</p>
        </ModalForm>))
        if (modalType==='privacy') dispatch(showModalAction(<ModalForm title={t('footer.Policy')}>
            <p className="text-center mb-5">{t('footer.Policy')}</p>
        </ModalForm>))
    }

    const submitHandler = data => {
        const regData = {
            ...data,
            identification_type : data.identification_value ? data.identification_type : null
        }
        setIsLoading(true)

        dispatch(registerAuth(regData, router, langVal, currency)).then(() => {
            setIsLoading(false);
        }).catch((err) => {
            setIsLoading(false);
        });

    }

    return (
        <div className="container auth">
            <form onSubmit={handleSubmit(submitHandler)} className="py-5 px-5">
                <h3 className='mb-5 fw-light'>{t('register.header')}</h3>
                <div className="row justify-content-between">
                    <div className="col-md-6 col-xs-12 mb-4">
                        <InputText 
                            label={t('register.labels.first_name')} 
                            {...register('first_name')} 
                            errorMessage={errors.first_name && errors.first_name.message}
                        />
                    </div>
                    <div className="col-md-6 col-xs-12 mb-4">
                        <InputText 
                            label={t('register.labels.last_name')} 
                            {...register('last_name')} 
                            errorMessage={errors.last_name && errors.last_name.message}
                        />
                    </div>
                    <div className='col-md-6 col-xs-12 mb-4'>
                        <label className='mb-2 fw-light'>{t('register.labels.phone')}</label>
                        <div className={'d-flex justify-content-center align-items-center'}>
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
                        {errors.country_code && <small className='text-danger'>{errors.country_code.message}</small>}
                        {errors.phone && <small className='text-danger'>{errors.phone.message}</small>}
                    </div>
                    <div className="col-md-6 col-xs-12 mb-4">
                        <InputText 
                            label={t('register.labels.email')} 
                            {...register('email')} 
                            errorMessage={errors.email && errors.email.message}
                        />
                    </div>
                    <div className="col-md-6 col-xs-12 mb-4">
                        <InputText 
                            label={t('register.labels.dob')} 
                            type={'date'} {...register('dob')} 
                            errorMessage={errors.dob && errors.dob.message}
                        />
                    </div>
                    <div className="col-md-6 col-xs-12 mb-4">
                        <label className='mb-2 fw-light'>{t('register.labels.gender')}</label>
                        <div className="select-add select-full">
                            <Controller
                                control={control}
                                defaultValue={''}
                                name='gender'
                                render={({ field, value, ref })=>
                                    <InputSelect
                                        inputRef={ref}
                                        value={genderOptions.find(c => c.value === value)}
                                        onChange={val => field.onChange(val.value)}
                                        options={genderOptions}
                                        // errorMessage={errors.gender && errors.gender.message}
                                        placeholder={t('register.placeholders.select')}
                                    />
                                }
                            />
                        </div>
                        {errors.gender && errors.gender.message && <small className='text-danger'>{errors.gender.message}</small>}
                    </div>
                    <div className="col-md-6 col-xs-12 mb-4">
                        <InputText 
                            label={t('register.labels.password')} 
                            passWordIcon 
                            type={'password'} 
                            {...register('password')} 
                            errorMessage={errors.password && errors.password.message}
                            />
                    </div>
                    <div className="col-md-6 col-xs-12 mb-4">
                        <InputText 
                            label={t('register.labels.confirm_password')} 
                            passWordIcon 
                            type={'password'} 
                            {...register('confirm_password')} 
                            errorMessage={errors.confirm_password && errors.confirm_password.message}
                        />
                    </div>
                    <div className="col-md-6 col-xs-12 mb-4">
                            <label className='mb-2 fw-light'>{t('register.labels.nationality')}</label>
                        <div className="select-add select-full">
                            {
                                nationalityOptions ?
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name='nationality_id'
                                    render={({ field, id, ref })=>
                                        <InputSelect
                                            inputRef={ref}
                                            value={nationalityOptions.find(c => c.id === id)}
                                            onChange={val => field.onChange(val.value)}
                                            options={nationalityOptions.map(item=>({label:item.name,value:item.id}))}
                                            // errorMessage={errors.nationality_id && errors.nationality_id.message}
                                            placeholder={t('register.placeholders.select')}
                                        />
                                    }
                                />
                                :
                                ''
                            }
                        </div>
                        {errors.nationality_id && errors.nationality_id.message && <small className='text-danger'>{errors.nationality_id.message}</small>}
                    </div>
                    <div className="col-md-6 col-xs-12 mb-4">
                            <label className='mb-2 fw-light'>{t('register.labels.country')}</label>
                        <div className="select-add select-full">
                            {
                                nationalityOptions ?
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name='country_id'
                                    render={({ field, id, ref })=>
                                        <InputSelect
                                            inputRef={ref}
                                            value={nationalityOptions.find(c => c.id === id)}
                                            onChange={val => field.onChange(val.value)}
                                            options={nationalityOptions.map(item=>({label:item.name,value:item.id}))}
                                            // errorMessage={errors.country_id && errors.country_id.message}
                                            placeholder={t('register.placeholders.select')}
                                        />
                                    }
                                />
                                :
                                ''
                            }
                        </div>
                        {errors.country_id && errors.country_id.message && <small className='text-danger'>{errors.country_id.message}</small>}
                    </div>
                    <div className="col-md-6 col-xs-12 mb-4">
                            <label className='mb-2 fw-light'>{t('register.labels.identification')}</label>
                            <div className="select-add select-full">
                                <Controller
                                    control={control}
                                    defaultValue={''}
                                    name='identification_type'
                                    render={({ field, value, ref })=>
                                        <InputSelect
                                            inputRef={ref}
                                            value={identificationOptions.find(c => c.value === value)}
                                            onChange={val => field.onChange(val.value)}
                                            options={identificationOptions}
                                            placeholder={t('register.placeholders.select')}
                                        />
                                    }
                                />
                            </div>
                    </div>
                    <div className="col-md-6 col-xs-12">
                        {watchIdentification && <div className="mt-4 pt-2"><InputText {...register('identification_value')}/></div>}
                    </div>
                    {/*<div className="col-md-12 my-3">*/}
                    {/*    <div className="row">*/}
                    {/*        <div className="col-md-6 col-xs-12 d-flex align-items-center">*/}
                    {/*            <div className="d-flex align-items-center">*/}
                    {/*                <label className="in-chick-box">*/}
                    {/*                    <input type="checkbox" name="" onChange={()=>setInInfluencer(!inInfluencer)}/>*/}
                    {/*                    <span className="checkmark m-0" />*/}
                    {/*                </label>*/}
                    {/*                <strong className='fw-light mx-2'>{t('app.influ')}</strong>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        {*/}
                    {/*            inInfluencer &&*/}
                    {/*            <div className="col-md-6 col-xs-12">*/}
                    {/*                <label className='mb-2 fw-light'>{t('user.TDServices')}</label>*/}
                    {/*                <div className="select-add select-full">*/}
                    {/*                    <Controller*/}
                    {/*                        control={control}*/}
                    {/*                        defaultValue={''}*/}
                    {/*                        name='identification_type'*/}
                    {/*                        render={({ field, value, ref })=>*/}
                    {/*                            <InputSelect*/}
                    {/*                                inputRef={ref}*/}
                    {/*                                value={identificationOptions.find(c => c.value === value)}*/}
                    {/*                                onChange={val => field.onChange(val.value)}*/}
                    {/*                                options={identificationOptions}*/}
                    {/*                                placeholder={t('register.placeholders.select')}*/}
                    {/*                            />*/}
                    {/*                        }*/}
                    {/*                    />*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        }*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                <div className="td_disclaimer text-center my-5">
                    {t('app.bySigningAgree')}
                    <span onClick={()=>openModal('terms')}> {t('app.termService')}</span>
                    <span onClick={()=>openModal('privacy')}> {t('footer.Policy')}</span>
                </div>
                { 
                    isLoading ?
                    <button className='btn-button bgMainColor text-white d-table m-auto my-4'>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                    </button>
                    : 
                    <button className='btn-button bgMainColor text-white d-table m-auto my-4' type={'submit'}>
                        <span>{t('register.register_button')}</span>
                    </button>
                }
            </form>
        </div>
  )
}
  