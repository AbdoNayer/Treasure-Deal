import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { countries, getProfileAuth, updateProfileAuth } from "../../../redux-toolkit/actions";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { InputText } from "../../../components/Inputs/InputText";
import { InputSelect } from "../../../components/Inputs/InputSelect";
import { LoadingPage } from "../../../components";
import ButtonMain from "../../../components/Inputs/ButtonMain";
import * as yup from "yup";
import Link from "next/link";
import Image from 'next/image';

export default function ProfileEdit() {

    const { t }                     = useTranslation();
    const user                      = useSelector((state) => state.user.user);
    const dispatch                  = useDispatch();
    const router                    = useRouter();
    const langVal                   = useSelector((state) => state.language.language);
    const nationalityOptions        = useSelector((state) => state.countries.countries);
    const currency                  = useSelector((state) => state.currency.currency);
    const objToOption               = (obj) => ({value: obj.value, label: obj.label});
    const objToOptionNameId         = (obj) => ({value: obj.id, label: obj.name});
    

    const [ isLoading, setIsLoading ]        = useState(false);
    const [ profileImg, setProfileImg ]      = useState(null);

    const genderOptions                 = [
        {label: 'Male', value: 'Male'},
        {label: 'Female', value: 'Female'},
        {label: 'Other', value: 'Other'},
    ]
    const identificationOptions         = [
        {label: 'Passport', value: 'passport'},
        {label: 'National Id', value: 'national-id'},
        {label: 'Driving License', value: 'driving-license'},
    ]

    const fetchData = () => {
        dispatch(countries(langVal));
    }

    useEffect(() => {
        fetchData();
        setValue('first_name',user.first_name||'')
        setValue('last_name',user.last_name||'')
        setValue('phone',user.phone||'')
        setValue('email',user.email||'')
        setValue('country_code',('+' + user.country_code)||'')
        setValue('gender',user.gender||'')
        setValue('nationality_id',user.nationality_id||'')
        setValue('country_id',user.country_id||'')
        setValue('dob',user.dob||'')
        setValue('identification_type',user.identification_type||'')
        setValue('identification_value',user.identification_value||'')
    }, []);

    let profileEditSchema = yup.object().shape({
        first_name:yup.string().required(t('register.form_errors.first_name')),
        last_name:yup.string().required(t('register.form_errors.last_name')),
        dob:yup.string().required(t('register.form_errors.dob')),
        gender:yup.string().required(t('register.form_errors.gender')),
        nationality_id:yup.string().required(t('register.form_errors.nationality')),
        country_id:yup.string().required(t('register.form_errors.country')),
    });

    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(profileEditSchema),
    });

    const watchIdentification = watch('identification_type');

    const submitHandler = data => {
        const updateData = {
            first_name                  : data.first_name,
            last_name                   : data.last_name,
            dob                         : data.dob,
            gender                      : data.gender,
            profile_pic                 : data.profile_pic[0],
            nationality_id              : data.nationality_id,
            identification_type         : data.identification_value ? data.identification_type : null,
            identification_value        : data.identification_value ? data.identification_value : null
        }
        setIsLoading(true)

        dispatch(updateProfileAuth(updateData, router, langVal, user.token,currency)).then(() => {
            setIsLoading(false);
            dispatch(getProfileAuth(langVal,user.token,currency))
        }).catch((err) => {
            setIsLoading(false);
        });

    }

    const input       = document.getElementById("selectAvatar");

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const uploadImage = async (event) => {
        const file                  = event.target.files[0];
        const base64                = await convertBase64(file);
        setProfileImg(base64);
    };

    input?.addEventListener("change", (e) => {
        uploadImage(e);
    });

    if(!user){
        return(
          <LoadingPage />
        )
    }

    //#endregion
    return(
        <div className="container mt-5">
            
            <h3 className='mb-4 fw-light'>{t("user.perDetails")}</h3>

            <div className='td_profile_wrapper mt-5 row'>

                <div className="col-md-4 col-xs-12">

                    <div className='td_img_details text-center'>

                        <div className='img-user-profile position-relative'>
                            <Image style={{ objectFit : "contain" }} quality='100' width={300} height={300} src={profileImg ? profileImg : user.profile_pic} alt="profile picture"/>
                            
                            <div className="choose-img dropdown mx-2">
                                <button className="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className='icon-edit-2'></i>
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <div className='main-drop'>
                                        <Link href={'/'} className='fw-light'> {t('user.TDLibrary')} </Link>
                                        <div className='input-system position-relative'>
                                            <input type="file" {...register("profile_pic")} id='selectAvatar' accept=".jpg, .jpeg, .png" className="hidden"/>
                                            <button className="bg-transparent fw-light"> {t('user.chooseFile')} </button>
                                        </div>
                                    </div>
                                </ul>
                            </div>
                        </div>

                        <div className="text-center">
                            <h3 className='mb-4 fw-normal'>{user.full_name}</h3>
                            <h5 className='mb-4 fw-light mainColor'>{'TD Id: 7845123'}</h5>
                            <h5 className='mb-4 fw-light'>{user.email}</h5>
                            <h5 className='mb-4 fw-light'>{'Last Login: 10.00 AM'}</h5>
                        </div>

                    </div>

                </div>

                <div className="col-md-8 cl-xs-12">
                    <div className="td_form_wrapper auth">
                        <form onSubmit={handleSubmit(submitHandler)} className="pt-2 pb-5">
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

                                <div className="col-md-6 col-xs-12 mb-4">
                                    <InputText
                                        label={t('register.labels.dob')}
                                        type={'date'} {...register('dob')}
                                        errorMessage={errors.dob && errors.dob.message}
                                    />
                                </div>
                                <div className="col-md-6 col-xs-12 mb-4">
                                    <div className="select-add">
                                        <label className='mb-2 fw-light'>{t('register.labels.gender')}</label>
                                        <Controller
                                            control={control}
                                            name='gender'
                                            render={({ field, value, ref })=>
                                                <InputSelect
                                                    inputRef={ref}
                                                    value={genderOptions.find(c => c.value === value)}
                                                    onChange={val => field.onChange(val.value)}
                                                    options={genderOptions}
                                                    errorMessage={errors.gender && errors.gender.message}
                                                    placeholder={t('register.placeholders.select')}
                                                    defaultValue={objToOption(genderOptions.find(gender=>gender.value === user.gender))}
                                                />
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12 mb-4">
                                    <div className="select-add">
                                        <label className='mb-2 fw-light'>{t('register.labels.nationality')}</label>
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
                                                            options={nationalityOptions.map(item=>(objToOptionNameId(item)))}
                                                            errorMessage={errors.nationality_id && errors.nationality_id.message}
                                                            placeholder={t('register.placeholders.select')}
                                                            defaultValue={objToOptionNameId(nationalityOptions.find(nat=>nat.id === user.nationality_id))}
                                                        />
                                                    }
                                                />
                                                :
                                                ''
                                        }
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12 mb-4">
                                    <div className="select-add">
                                        <label className='mb-2 fw-light'>{t('register.labels.country')}</label>
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
                                                            options={nationalityOptions.map(item=>(objToOptionNameId(item)))}
                                                            errorMessage={errors.country_id && errors.country_id.message}
                                                            placeholder={t('register.placeholders.select')}
                                                            defaultValue={objToOptionNameId(nationalityOptions.find(country=>country.id === user.country_id))}
                                                        />
                                                    }
                                                />
                                                :
                                                ''
                                        }
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12 mb-4">
                                    <div className="select-add">
                                        <label className='mb-2 fw-light'>{t('register.labels.identification')}</label>
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
                                                    defaultValue={user.identification_type && objToOption(identificationOptions.find(identification=> identification.value === user.identification_type))}
                                                />
                                            }
                                        />
                                    </div>
                                    {watchIdentification && <InputText {...register('identification_value')}/>}
                                </div>
                            </div>
                            <div className='td_button_wrapper'>
                                <ButtonMain>
                                    {isLoading
                                        ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                                        : <span>{t('register.register_button')}</span>
                                    }
                                </ButtonMain>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}