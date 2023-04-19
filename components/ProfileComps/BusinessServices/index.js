import {useDispatch, useSelector} from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { InputSelect } from "../../Inputs/InputSelect";
import { InputText } from "../../Inputs/InputText";
import { showModalAction } from "../../../redux-toolkit/actions";
import { ModalForm } from "../../ModalForms/ModalForm";
import Image from 'next/image';
import {getFreeLanceRequestData, newFreeLanceRequest} from "../../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../../hooks/useApi";
import {LoadData} from "../../index";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {MediaUploader} from "../../MediaUploaders/MediaUploader";
import {IMAGE_FORMATS} from "../../../redux-toolkit/consts";

export const BusinessServices = ({...props}) =>  {
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);
    const dispatch                                      = useDispatch();
    const { t }                                         = useTranslation();

    const {
        data:freelanceDataTypes,
        isLoading:isFreelanceDataTypesLoading,
        reFetch:refetchFreelanceDataTypes
    } = useApi(()=> getFreeLanceRequestData(user.token,langVal,currency))


    const [selectedChannels,setSelectedChannels] = useState([])
    const [haveOffers,setHaveOffers] = useState(true);
    const [coverImage,setCoverImage] = useState(null)
    const [coverErrorMessage,setCoverErrorMessage] = useState('')
    const [portfolioImages,setPortfolioImages] = useState([])
    const [portfolioErrorMessage,setPortfolioErrorMessage] = useState('')
    const [submitRequestLoading,setSubmitRequestLoading] = useState(false)



    let channelsSchema = {
        channel: yup.mixed().notOneOf([null,''], "channel required").required('channel required'),
        follwers: yup.string().required("follwers required"),
        link: yup.string().url('link format: https://domain.com').required("link required"),
    }
    let infulencerSchema = yup.object().shape({
        channels: yup.array().of(yup.object().shape(channelsSchema)),
        business_service_type_id: yup.mixed().notOneOf([null,''], "business service type required").required('business service type required'),
        about: yup.string().required('about is required'),
        target_audience: yup.string().required('target audience required'),
        audience_gender: yup.mixed().notOneOf([null,''], "business service type required").required('business service type required'),
        country_id: yup.mixed().notOneOf([null,''], "business service type required").required('business service type required'),
        audience_age_groups: yup.mixed().notOneOf([null,''], "business service type required").required('business service type required'),
        basicPackagePrice: yup.string().required('package price is required'),
        basicPackageHeading: yup.string().required('package heading is required'),
        basicPackageDescription: yup.string().required('package description is required'),
        basicPackageDeliveryTime: yup.string().required('package delivery time is required'),
        standardPackagePrice: yup.string().when([],{
            is: () => haveOffers,
            then: yup.string().required('package price is required'),
            otherwise: yup.string().notRequired()
        }),
        standardPackageHeading: yup.string().when([],{
            is: () => haveOffers,
            then: yup.string().required('package heading is required'),
            otherwise: yup.string().notRequired()
        }),
        standardPackageDescription: yup.string().when([],{
            is: () => haveOffers,
            then: yup.string().required('package description is required'),
            otherwise: yup.string().notRequired()
        }),
        standardPackageDeliveryTime: yup.string().when([],{
            is: () => haveOffers,
            then: yup.string().required('package delivery time is required'),
            otherwise: yup.string().notRequired()
        }),
        premiumPackagePrice: yup.string().when([],{
            is: () => haveOffers,
            then: yup.string().required('package price is required'),
            otherwise: yup.string().notRequired()
        }),
        premiumPackageHeading: yup.string().when([],{
            is: () => haveOffers,
            then: yup.string().required('package heading is required'),
            otherwise: yup.string().notRequired()
        }),
        premiumPackageDescription: yup.string().when([],{
            is: () => haveOffers,
            then: yup.string().required('package description is required'),
            otherwise: yup.string().notRequired()
        }),
        premiumPackageDeliveryTime: yup.string().when([],{
            is: () => haveOffers,
            then: yup.string().required('package delivery time is required'),
            otherwise: yup.string().notRequired()
        }),
    })

    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(infulencerSchema)
    });
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "channels", // unique name for your Field Array
        rules: {minLength:1,maxLength:5}
    });

    const genderOptions = [
        {label: 'Male', value: 'male'},
        {label: 'Female', value: 'female'},
        {label: 'Both', value: 'both'},
    ];

    const clickView = () => {
        dispatch(showModalAction(
            <ModalForm title={t('app.confirmation')}>
                <div className="text-center">
                    <Image
                        src={'/img/approve.png'}
                        style={{ objectFit : "contain" }}
                        width={'150'}
                        height={'150'}
                        alt='approve'
                    />
                    <p className="my-4">Thank you for your submission! Your profile will under looking for our admin team. Profile will be activated as soon as possible</p>
                </div>
            </ModalForm>
        ))
    }

    const submitHandler = (data) => {
        const newDataObject = {
            cover:coverImage,
            images:portfolioImages.map(image=> image.file),
            channels:data.channels,
            about:data.about,
            target_audience:data.target_audience,
            business_service_type_id:data.business_service_type_id.value,
            country_id:data.country_id.value,
            audience_gender:data.audience_gender.value,
            audience_age_groups:[data.audience_age_groups.value],
            packages:{
                basic:{
                    price:data.basicPackagePrice,
                    heading:data.basicPackageHeading,
                    description:data.basicPackageDescription,
                    delivery_time:data.basicPackageDeliveryTime,
                },
                standard:haveOffers ? {
                    price:data.standardPackagePrice,
                    heading:data.standardPackageHeading,
                    description:data.standardPackageDescription,
                    delivery_time:data.standardPackageDeliveryTime,
                } : undefined,
                premium:haveOffers ? {
                    price:data.premiumPackagePrice,
                    heading:data.premiumPackageHeading,
                    description:data.premiumPackageDescription,
                    delivery_time:data.premiumPackageDeliveryTime,
                } : undefined,
            }
        }
        if (coverImage===null) {
            setCoverErrorMessage('Cover Image Required')
            return
        }
        if (portfolioImages.length < 1) {
            setPortfolioErrorMessage('Portfolio Images Required')
            return
        }

        setSubmitRequestLoading(true);
        (async () => await newFreeLanceRequest(newDataObject,user.token,langVal,currency))()
            .then(r=> {
                setSubmitRequestLoading(false)
                clickView()
            })
            .catch(e=> setSubmitRequestLoading(false));
    }

    const addNewField = ()=>{
        if (freelanceDataTypes){
            if (freelanceDataTypes.channels.length > fields.length) {
                append({}, {focusName:'channelName'})
            }
            else {
                alert('cant add more channels')
            }
        }
    }

    if (isFreelanceDataTypesLoading) return <div className={'modal-height-view position-relative'}><LoadData/></div>
    return (
        <form onSubmit={handleSubmit(submitHandler)} className="py-4">

            <div className="mb-5 text-center w-75 m-auto">
                <h4>{t('user.profile.referral.title')}</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio. Fugit iste asperiores repellendus voluptate omnis iusto officiis nam praesentium. Add your vouchers more you can play more lotto at the</p>
            </div>


            <div className="w-75 m-auto">

                <div className="select-add mb-3">
                    <label className='mb-2 fw-light'>Business Services</label>
                    <div className="select-add">
                        <Controller
                            control={control}
                            defaultValue={''}
                            name={`business_service_type_id`}
                            render={({field,value,ref}) =>
                                <InputSelect
                                    {...field}
                                    placeholder={'select'}
                                    // error={errors?.test[index]?.channelName.message}
                                    errorMessage={errors && errors.business_service_type_id?.message}
                                    inputRef={ref}
                                    // value={freelanceDataTypes.business_services_types.find(c => c.id === value)}
                                    // onChange={val => field.onChange(val.value)}
                                    isLoading={isFreelanceDataTypesLoading}
                                    options={freelanceDataTypes.business_services_types.map(type=> ({label:type.name,value:type.id}))}
                                />
                            }
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 col-xs-12">
                        <label className='mb-2 fw-light'>About Me</label>
                        <div className="select-add">
                            <textarea {...register('about')}/>
                            {errors && errors.about?.message && <small className={'text-danger'}>{errors.about.message}</small>}
                        </div>
                    </div>
                    <div className="col-md-12 col-xs-12 my-3">
                        <label className="fw-light">My Channels</label>
                        {fields.length<1 && addNewField()}
                        {fields.map((fieldObj, index) => (
                            <div key={fieldObj.id} className="row my-3">
                                <div className="col-md-4 col-xs-12">
                                    <div className="select-add">
                                        <Controller
                                            control={control}
                                            defaultValue={''}
                                            name={`channels.${index}.channel`}
                                            render={({field,value,ref}) =>
                                                <InputSelect
                                                    {...field}
                                                    // placeholder={t('login.country_selector_placeholder')}
                                                    // error={errors?.channels[index]?.channel.message}
                                                    errorMessage={errors && errors.channels && errors.channels.length > 0 && errors.channels[index]?.channel?.message}
                                                    inputRef={ref}
                                                    value={freelanceDataTypes.channels.find(c => c.value === value)}
                                                    onChange={val => {
                                                        field.onChange(val.value)
                                                        if (selectedChannels[index]) {
                                                            setSelectedChannels( prevState => [...prevState.filter(element => element !== selectedChannels[index]),val.value])
                                                        } else setSelectedChannels(prevState => [...prevState,val.value] )
                                                    }}
                                                    isLoading={isFreelanceDataTypesLoading}
                                                    options={freelanceDataTypes.channels.filter(element => !selectedChannels.includes(element.value)).map(type=> ({label:type.name,value:type.value}))}
                                                />
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 col-xs-12">
                                    <InputText
                                        {...register(`channels.${index}.follwers`)}
                                        placeholder={'follwers'}
                                        errorMessage={errors && errors.channels && errors.channels.length > 0 && errors.channels[index]?.follwers?.message}
                                    />
                                </div>
                                <div className="col-md-4 col-xs-12">
                                    <InputText
                                        {...register(`channels.${index}.link`)}
                                        placeholder={'link'}
                                        errorMessage={errors && errors.channels && errors.channels.length > 0 && errors.channels[index]?.link?.message}
                                    />
                                </div>
                            </div>
                        ))}
                        <button type={'button'} disabled={!(freelanceDataTypes.channels.length > fields.length)} className="w-auto btn-button bgMainColor text-white px-4 d-flex align-items-center justify-content-center m-auto my-4" onClick={addNewField}>
                            <i className="icon-plus fs-4"/>
                            <span>Add More Channels</span>
                        </button>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6 col-xs-12">
                        <div className="select-add mb-3">
                            <Controller
                                control={control}
                                defaultValue={''}
                                name={`audience_gender`}
                                render={({field,value,ref}) =>
                                    <InputSelect
                                        {...field}
                                        label={'Audience Gender'}
                                        placeholder={'select'}
                                        // error={errors?.channels[index]?.channel.message}
                                        errorMessage={errors && errors.audience_gender?.message}
                                        inputRef={ref}
                                        // value={freelanceDataTypes.business_services_types.find(c => c.id === value)}
                                        // onChange={val => field.onChange(val.value)}
                                        options={genderOptions}
                                    />
                                }
                            />
                        </div>
                    </div>
                    <div className="col-md-6 col-xs-12">
                        <div className="select-add mb-3">
                            <Controller
                                control={control}
                                defaultValue={''}
                                name={`country_id`}
                                render={({field,value,ref}) =>
                                    <InputSelect
                                        {...field}
                                        label={'Audience Country'}
                                        placeholder={'select'}
                                        // error={errors?.channels[index]?.channel.message}
                                        errorMessage={errors && errors.country_id?.message}
                                        inputRef={ref}
                                        // value={freelanceDataTypes.business_services_types.find(c => c.id === value)}
                                        // onChange={val => field.onChange(val.value)}
                                        isLoading={isFreelanceDataTypesLoading}
                                        options={freelanceDataTypes.countries.map(type=> ({label:type.name,value:type.id}))}
                                    />
                                }
                            />
                        </div>
                    </div>
                    <div className="col-md-6 col-xs-12">
                        <div className="select-add mb-3">
                            <Controller
                                control={control}
                                defaultValue={''}
                                name={`audience_age_groups`}
                                render={({field,value,ref}) =>
                                    <InputSelect
                                        {...field}
                                        label={'Audience Age Groups'}
                                        placeholder={'select'}
                                        // error={errors?.channels[index]?.channel.message}
                                        errorMessage={errors && errors.audience_age_groups?.message}
                                        inputRef={ref}
                                        // value={freelanceDataTypes.business_services_types.find(c => c.id === value)}
                                        // onChange={val => field.onChange(val.value)}
                                        isLoading={isFreelanceDataTypesLoading}
                                        options={freelanceDataTypes.audience_age_groups.map(type=> ({label:type.group,value:type.id}))}
                                    />
                                }
                            />
                        </div>
                    </div>
                    <div className="col-md-6 col-xs-12">
                        <InputText
                            label={'Target Audience'}
                            {...register('target_audience')}
                            placeholder={'ex. Fashion'}
                            errorMessage={errors &&  errors.target_audience?.message}
                        />
                    </div>
                    <div className="col-md-6 col-xs-12 mt-2">
                        <label className='mb-2 fw-light'>Cover Images</label>
                        <MediaUploader
                            showUploadMessage={false}
                            updateImage={(file)=> {
                                setCoverImage(file)
                                setCoverErrorMessage('')
                            }}
                            // updateImage={(file)=> setNewAmenity(prevState=> ({...prevState, image:file}))}
                            files={[{type:"image" ,maxSize: 450*1024, formats: IMAGE_FORMATS}]}
                            maxSize={450*1024}
                            initialUrl={[]}
                            updateBackendUrl={''}
                        />
                        {coverErrorMessage && <small className={'text-danger'}>{coverErrorMessage}</small>}
                    </div>
                    <div className="col-md-6 col-xs-12 mt-2">
                        <label className='mb-2 fw-light'>Portfolio Images</label>
                        <MediaUploader
                            showUploadMessage={false}
                            isMultiple
                            updateImage={(files)=> {
                                setPortfolioImages(files)
                                setPortfolioErrorMessage('')
                                // setAmenityImage(file)
                                // setAmenityImageErrorMessage('')
                            }}
                            files={[{type:"image" ,maxSize: 450*1024, formats: IMAGE_FORMATS}]}
                            maxSize={450*1024}
                            initialUrl={[]}
                            updateBackendUrl={''}
                        />
                        {portfolioErrorMessage && <small className={'text-danger'}>{portfolioErrorMessage}</small>}
                    </div>
                </div>

                <div className="">

                    <div className="d-flex align-items-center justify-content-between">
                        <h6 className="m-0">My Packages</h6>
                        {/*<div className="form-check p-0 form-switch d-flex align-items-center">*/}
                        {/*    <label className="form-check-label small-font-13 mx-2" for="flexSwitchCheckDefault">Offers packages</label>*/}
                        {/*    <InputToggle*/}
                        {/*        isChecked={haveOffers}*/}
                        {/*        onChange={e=> setHaveOffers(!haveOffers)}*/}
                        {/*    />*/}
                        {/*    /!*<input class="form-check-input m-0" type="checkbox" id="flexSwitchCheckDefault" onChange={e=> console.log(e.target.value)} />*!/*/}
                        {/*</div>*/}
                    </div>
                    <div className="row">
                        <div className={`${haveOffers ? 'col-md-4' : 'col-md-6 mx-auto'} col-xs-12 p-1`}>
                            <div className="border my-4 p-3">
                                <h6 className='mb-4 fw-light'>Package <span className="mainColor fw-bold">( Basic )</span></h6>
                                <div className="mb-3">
                                    <InputText
                                        className='small-font-13'
                                        placeholder='Price'
                                        {...register('basicPackagePrice')}
                                        errorMessage={errors && errors.basicPackagePrice?.message}
                                    />
                                </div>
                                <div className="mb-3">
                                    <InputText
                                        className='small-font-13'
                                        placeholder='Heading'
                                        {...register('basicPackageHeading')}
                                        errorMessage={errors && errors.basicPackageHeading?.message}
                                    />
                                </div>
                                <div className="mb-3">
                                    <div className="select-add">
                                        <textarea
                                            className='small-font-13'
                                            placeholder="Description"
                                            {...register('basicPackageDescription')}
                                        />
                                        {errors && errors.basicPackageDescription?.message && <small className={'text-danger'}>{errors.basicPackageDescription.message}</small>}
                                    </div>
                                </div>
                                <div className="select-add">
                                    {/*<label className='mb-2 fw-light small-font-13'>Delivery Time</label>*/}
                                    <InputText
                                        placeholder={'Delivery Time'}
                                        className='small-font-13'
                                        {...register('basicPackageDeliveryTime')}
                                        errorMessage={errors && errors.basicPackageDeliveryTime?.message}
                                    />
                                </div>
                            </div>
                        </div>

                        {haveOffers && <>
                            <div className="col-md-4 col-xs-12 p-1">
                                <div className="border my-4 p-3">
                                    <h6 className='mb-4 fw-light'>Package <span className="mainColor fw-bold">( Standard )</span></h6>
                                    <div className="mb-3">
                                        <InputText
                                            {...register('standardPackagePrice')}
                                            errorMessage={errors && errors.standardPackagePrice?.message}
                                            className='small-font-13' placeholder='Price' />
                                    </div>
                                    <div className="mb-3">
                                        <InputText
                                            {...register('standardPackageHeading')}
                                            errorMessage={errors && errors.standardPackageHeading?.message}
                                            className='small-font-13' placeholder='Heading' />
                                    </div>
                                    <div className="mb-3">
                                        <div className="select-add">
                                            <textarea
                                                {...register('standardPackageDescription')}
                                                className='small-font-13' placeholder="Description"/>
                                            {errors && errors.standardPackageDescription?.message && <small className={'text-danger'}>{errors.standardPackageDescription.message}</small>}
                                        </div>
                                    </div>
                                    <div className="select-add ">
                                        {/*<label className='mb-2 fw-light small-font-13'>Delivery Time</label>*/}
                                        {/*<InputSelect*/}
                                        {/*    value={deliveryOptions.find(c => c.value)}*/}
                                        {/*    options={deliveryOptions}*/}
                                        {/*    placeholder={'select'}*/}
                                        {/*/>*/}
                                        <InputText
                                            placeholder={'Delivery Time'}
                                            className='small-font-13'
                                            {...register('standardPackageDeliveryTime')}
                                            errorMessage={errors && errors.standardPackageDeliveryTime?.message}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 col-xs-12 p-1">
                                <div className="border my-4 p-3">
                                    <h6 className='mb-4 fw-light'>Package <span className="mainColor fw-bold">( Premium )</span></h6>
                                    <div className="mb-3">
                                        <InputText
                                            {...register('premiumPackagePrice')}
                                            errorMessage={errors && errors.premiumPackagePrice?.message}
                                            className='small-font-13' placeholder='Price' />
                                    </div>
                                    <div className="mb-3">
                                        <InputText
                                            {...register('premiumPackageHeading')}
                                            errorMessage={errors && errors.premiumPackageHeading?.message}
                                            className='small-font-13' placeholder='Heading' />
                                    </div>
                                    <div className="mb-3">
                                        <div className="select-add">
                                            <textarea
                                                {...register('premiumPackageDescription')}
                                                className='small-font-13' placeholder="Description"/>
                                            {errors && errors.premiumPackageDescription?.message && <small className={'text-danger'}>{errors.premiumPackageDescription.message}</small>}
                                        </div>
                                    </div>
                                    <div className="select-add ">
                                        <InputText
                                            placeholder={'Delivery Time'}
                                            className='small-font-13'
                                            {...register('premiumPackageDeliveryTime')}
                                            errorMessage={errors && errors.premiumPackageDeliveryTime?.message}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>}
                    </div>

                    <div className={'d-flex justify-content-center mt-3 mb-3'}>
                        {/*<button className={'w-auto btn-button bgSecondColor text-white px-4 mx-2'}>{t('register.register_button_Cancel')}</button>*/}
                        <button type={'submit'} disabled={submitRequestLoading} className={'w-auto btn-button bgMainColor text-white px-4 mx-2'}>
                            {submitRequestLoading
                                ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                                : <>{t('register.register_button')}</>
                            }
                        </button>
                    </div>

                </div>

            </div>
            
        </form>
    )
}