import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pagination } from "../../Pagination";
import { InputText } from "../../Inputs/InputText";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {
    deleteFreeLancersInvitation,
    getEnquiresData,
    getFreeLancersInvitations,
    inviteFreeLanceRequest
} from "../../../redux-toolkit/actions/axiosCalls";
import Toastify from "toastify-js";
import {t} from "i18next";
import {useTable} from "../../../hooks/table-hook";
import {useApi} from "../../../hooks/useApi";
import LoadData from "../../LoadData";
import {convertIndexToSerial} from "../../../redux-toolkit/consts";

export const InviteInfluencers = ({...props}) =>  {
    const langVal                                       = useSelector((state) => state.language.language);
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);
    const [currentPage, setCurrentPage]                 = useState(1);
    const {setObjs,filteredObjs,message}                = useTable([]);
    const [selectedId,setSelectedId] = useState('')
    const {
        data:freelancersInvitationsData,
        isLoading:isFreelancersInvitationsDataLoading,
        reFetch:refetchFreelancersInvitationsData
    } = useApi(()=> getFreeLancersInvitations(currentPage,user.token,langVal,currency))
    const [dataLoadComplete,setDataLoadComplete] = useState(!!freelancersInvitationsData)

    useEffect(()=>{
        if (freelancersInvitationsData){
            if (freelancersInvitationsData.invitations) {
                setObjs(freelancersInvitationsData.invitations)
                setDataLoadComplete(true)
            }
        }
    },[freelancersInvitationsData])
    useEffect(()=>{
        refetchFreelancersInvitationsData()
    },[currentPage])

    const [sendingInvite,setSendingInvite]              = useState(false)
    const { t }     = useTranslation();

    let inviteFreelancerSchema = yup.object().shape({
        name:yup.string().required(t('app.required')).min(3, t('app.AtLeastCharacters3')),
        email:yup.string().email('must be valid email, mail@domain.com').required(t('app.required')),
    })
    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
        mode:'onTouched',
        resolver: yupResolver(inviteFreelancerSchema)
    });
    const submitHandler = (data) => {
        setSendingInvite(true);
        console.log(data);
        (async () => await inviteFreeLanceRequest(data,user.token,langVal,currency))()
            .then(r=> {
                setSendingInvite(false)
                reset();
                refetchFreelancersInvitationsData();
                Toastify({
                    text: t('app.invituccessfully'),
                    duration: 3000,
                    gravity: "top",
                    position: langVal === 'en' ? "left" : "right",
                    style: {
                        background: "#007427",
                    }
                }).showToast();
            })
            .catch(e=> setSendingInvite(false))
    }

    const deleteInvitation = (id) => {
        setSelectedId(id);
        (async () => await deleteFreeLancersInvitation(id,user.token,langVal,currency))()
            .then(r=> {
                refetchFreelancersInvitationsData()
                setSelectedId('')
            })
            .catch(e=>setSelectedId(''))
    }

    if (!dataLoadComplete) return <div className={'modal-height-view position-relative'}><LoadData/></div>

    return (
        <div className="invite-influencers">
            
            <div className="my-3">
                <h4>{t('user.profile.influencers.title')}</h4>
                <p>{t('app.infoDis')}</p>
            </div>
            
            <form onSubmit={handleSubmit(submitHandler)} className="d-flex align-items-center mb-4 form">
                <div className='mx-2'>
                    <InputText
                        className='px-3 py-2'
                        label={t('register.labels.name')}
                        type={'text'}
                        {...register('name')}
                    />
                </div>
                <div className='mx-2'>
                    <InputText
                        className='px-3 py-2'
                        label={t('register.labels.email')}
                        type={'email'}
                        {...register('email')}
                    />
                </div>
                <button className="bgMainColor text-white rounded-2 align-self-end small-font-13">
                    {sendingInvite
                        ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                        : <>{t('app.sendInvitation')}</>
                    }
                </button>
                <div className={'d-flex flex-column align-self-end mx-2 text-danger'}>
                    <small>{errors?.name?.message}</small>
                    <small>{errors?.email?.message}</small>
                </div>
            </form>


            <div className="td_orders_table my-5">
                    <div className={'d-flex align-items-center justify-content-between px-3 mb-4'}>
                        <h4 className="td_orders_table_title fw-light">
                            {t('user.profile.influencers.titleCom')}
                        </h4>
                    </div>
                    {
                        filteredObjs.length > 0 ?
                            <div className="over-x">
<table className={'table text-center'}>
                                <thead>
                                    <tr>
                                        <th className={'fw-light'}>{t('app.SiNo')}</th>
                                        <th className={'fw-light'}>{t('register.labels.name')}</th>
                                        <th className={'fw-light'}>{t('register.labels.email')}</th>
                                        <th className={'fw-light'}>{t('favouritesProfile.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    filteredObjs.map((invitation,idx) =>
                                        <tr key={invitation.id}>
                                            <td>{convertIndexToSerial(idx,currentPage,freelancersInvitationsData?.pagination?.per_page)}</td>
                                            <td>{invitation.name}</td>
                                            <td>{invitation.email}</td>
                                            <td>
                                                <button className="text-primary bg-transparent" onClick={()=>deleteInvitation(invitation.id)}>
                                                    {invitation.id === selectedId
                                                        ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                                                        : <i className="icon-bin mainColor fs-4"/>
                                                    }

                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                            </div>
                        :
                        <div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center'}>
                            <h4 className="text-danger">{t('user.profile.influencers.invitationsYet')}</h4>
                        </div>
                    }
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={freelancersInvitationsData?.pagination?.total_items||filteredObjs.length}
                        pageSize={freelancersInvitationsData?.pagination?.per_page||6}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>

        </div>
    )
}