import {useApi} from "../../../hooks/useApi";
import {
    addNewAddresses,
    deleteAddresses,
    editAddresses,
    getMyAddresses
} from "../../../redux-toolkit/actions/axiosCalls";
import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {LoadData} from "../../index";
import {AddressComp} from "./AddressComp";
import {InputText} from "../../Inputs/InputText";
import {Map} from "../../Map";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {getProfileAuth, updateProfileAuth} from "../../../redux-toolkit/actions";
import * as yup from "yup";
import Image from 'next/image';
import {useTranslation} from "react-i18next";

export const AddressBookProfileComp = ({...props}) => {

    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const location                                      = useSelector((state) => state.location.location);
    const currency                                      = useSelector((state) => state.currency.currency);
    const { t }     = useTranslation();

    const [showNewAddressForm,setShowNewAddressForm]    = useState(false)
    const [buildingType,setBuildingType]                = useState('apartment')
    const [addressLocation,setAddressLocation]          = useState()
    const [submitMode,setSubmitMode]                    = useState('');
    const [selectedAddress,setSelectedAddress]          = useState()
    const [mapDescription,setMapDescription]            = useState('')

    const {
        data:addressData,
        isLoading:isAddressLoading,
        reFetch:refetchAddress,
    } = useApi(()=> getMyAddresses(user.token,langVal,currency))


    let addressBook = yup.object().shape({
        building_name:yup.string().required('required'),
        street:yup.string().required('required'),
        apartment_number:yup.string().required('required'),
        floor:yup.string().required('required'),
        additional_directions:yup.string(),
    });
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(addressBook),
    });
    const submitHandler = data => {
        if (!addressLocation.lat || !addressLocation.lng) return
        const addressFormData = {
            type: buildingType,
            building_name: data.building_name,
            street: data.street,
            apartment_number: data.apartment_number,
            floor: data.floor,
            lat: addressLocation.lat,
            lng: addressLocation.lng,
            map_desc: mapDescription,
            additional_directions: data.additional_directions,
            is_default:addressData.addresses.length > 0 ? 0 : 1,
        };
        if(submitMode==='edit'){
            (async () => await editAddresses(user.token,langVal,currency, {...addressFormData,address_id: selectedAddress.id,}))()
                .then(()=> refetchAddress());
        }else{
            (async () => await addNewAddresses(user.token,langVal,currency,addressFormData))()
                .then(()=> refetchAddress());
        }
    }

    const handleDelete = async (addressId) => {
        await deleteAddresses(user.token,langVal,currency,addressId)
    }

    const handleEdit = (address) => {
        setSelectedAddress(address)
        setSubmitMode('edit')
        setShowNewAddressForm(true)
    }

    useEffect(()=>{
        console.log(selectedAddress);
    },[selectedAddress])


    useEffect(()=>{
        setShowNewAddressForm(false)
        setTimeout(()=>setShowNewAddressForm(true),500)
         if (submitMode==='add') {
            setValue('building_name','')
            setValue('street','')
            setValue('apartment_number','')
            setValue('floor','')
            setValue('additional_directions','')
            setBuildingType('')
        }
    },[submitMode])

    useEffect(()=>{
        if (selectedAddress) {
            if (submitMode==='edit') {
                setShowNewAddressForm(false)
                setTimeout(()=>setShowNewAddressForm(true),500)
                setValue('building_name',selectedAddress.building_name||'')
                setValue('street',selectedAddress.street||'')
                setValue('apartment_number',selectedAddress.apartment_number||'')
                setValue('floor',selectedAddress.floor||'')
                setValue('additional_directions',selectedAddress.additional_directions||'')
                setBuildingType(selectedAddress.type||'')
            }
        }
    },[selectedAddress])

    if (isAddressLoading) return <div className={'modal-height-view position-relative'}><LoadData/></div>

    return (
        <div className={'td_address_book_profile_comp'}>
            <div className="row">
                {addressData && addressData.addresses.map(add => <div className={'col-md-4 mb-4'} key={add.id}><AddressComp refetchAddresses={refetchAddress} handleEdit={handleEdit} handleDelete={handleDelete} address={add} /></div>)}
                <button className="td_add_new_address bg-transparent border-main rounded-2 col-md-4 mb-4 d-flex align-items-center justify-content-center flex-column"
                     onClick={()=> {
                         setSubmitMode('add')
                         setShowNewAddressForm(true)
                     }} >
                    <Image src={'/img/home-address.png'} width={'70'} height={'70'} alt='icon' className={'icon my-3'}/>
                    <p className="m-0 text-black">{t('booking.addAddress')}</p>
                </button>
            </div>
            {showNewAddressForm && <form className={'td_new_address_form mx-auto td_booking_form_new_address_wrapper w-75 mt-5'} onSubmit={handleSubmit(submitHandler)}>
                <div className="td_title mb-4 fs-5">{submitMode==='edit'? t('booking.editAddress') : t('booking.addAddress')}</div>
                <div className="td_bld_type d-flex align-items-center justify-content-between my-4">
                    <div
                        onClick={()=> setBuildingType('apartment')}
                        className={`d-flex align-items-center flex-column justify-content-center up-width ${buildingType==='apartment' && 'td_bld_selected'}`}>
                            <span className="icon-apartment fs-3 my-2" />
                            <p className="m-0">{t('booking.apartment')}</p>
                    </div>
                    <div
                        onClick={()=> setBuildingType('house')}
                        className={`d-flex align-items-center flex-column justify-content-center up-width ${buildingType==='house' && 'td_bld_selected'}`}>
                            <span className="icon-home-m fs-3 my-2" />
                            <p className="m-0">{t('booking.house')}</p>
                    </div>
                    <div
                        onClick={()=> setBuildingType('office')}
                        className={`d-flex align-items-center flex-column justify-content-center up-width ${buildingType==='office' && 'td_bld_selected'}`}>
                            <span className="icon-office fs-3 my-2" />
                            <p className="m-0">{t('booking.office')}</p>
                    </div>
                </div>
                <div className="td_new_address_details mb-3">
                    <div className="row">
                        <div className="col-6 mb-2">
                            <InputText label={'Building Name'} errorMessage={errors.building_name?.message} {...register('building_name')}/>
                        </div>
                        <div className="col-6 mb-2">
                            <InputText label={'Street'} errorMessage={errors.street?.message} {...register('street')}/>
                        </div>
                        <div className="col-6 mb-2">
                            <InputText label={'Apartment No.'} errorMessage={errors.apartment_number?.message} {...register('apartment_number')}/>
                        </div>
                        <div className="col-6 mb-2">
                            <InputText label={'Floor'}errorMessage={errors.floor?.message} {...register('floor')} />
                        </div>
                    </div>
                </div>
                <div className="td_new_address_map">
                    <div className="map_title d-flex align-items-center mb-2 fs-5">
                        <span className={'me-2 icon-map-pin'}/>
                        <div>select from map</div>
                    </div>
                    <div className="td_map_wrapper">
                        <Map
                            setMapDescription={setMapDescription}
                            setAddressLocation={setAddressLocation}
                            defaultCenter={submitMode==='edit' ? {lat: parseFloat(selectedAddress.lat),lng: parseFloat(selectedAddress.lng)} : (location.lat ? {lat:location.lat,lng:location.long} : undefined)}
                            defaultMarkerPosition={submitMode==='edit' ? {lat: selectedAddress.lat,lng: selectedAddress.lng} : (location.lat ? {lat:location.lat,lng:location.long} : undefined)}
                        />
                    </div>
                </div>
                <div className={'d-flex justify-content-center mt-3 mb-3'}>
                    <button className={'w-auto btn-button bgMainColor text-white px-4'}>{submitMode==='edit'?'Update Address':'Confirm Address'}</button>
                </div>
            </form>}
        </div>
    )
}