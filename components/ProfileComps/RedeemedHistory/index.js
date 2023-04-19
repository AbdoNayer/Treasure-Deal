import Link from "next/link";
import Image from 'next/image';
import {useTranslation} from "react-i18next";
import {useApi} from "../../../hooks/useApi";
import {getAllRedeems} from "../../../redux-toolkit/actions/axiosCalls";
import {useDispatch, useSelector} from "react-redux";
import {RedeemedVouchers} from "../../MerchantComps/RedeemedVouchers";
import {showModalAction} from "../../../redux-toolkit/actions";
import {ModalForm} from "../../ModalForms/ModalForm";
import {LoadData} from "../../index";
import {useEffect, useState} from "react";
import {Feedback} from "../../../components";


export const RedeemedHistory = () => {
    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch();
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const [currentPage,setCurrentPage] = useState(1)

    //#region Redeems
    const {
        data:redeemsData,
        isLoading:redeemsLoading,
        reFetch:refetchRedeems
    } = useApi(()=> getAllRedeems(currentPage,user.token,langVal,currency))
    //#endregion
    useEffect(()=>{
        refetchRedeems()
    },[currentPage])
    const openModal = (type) => {
        if(type === 'terms'){
            dispatch(showModalAction(
                <ModalForm title={t('booking.details.terms')}>
                    <div className={'text-center mb-4'}>
                        {t('millionaire.voucher.brief')}
                    </div>
                </ModalForm>
            ));
        }else if(type==='feedback'){
            dispatch(showModalAction( <ModalForm title={'FeedBack'}>
                <Feedback />
            </ModalForm> ))
        }
    }

    if (redeemsLoading) return <div className={'modal-height-view position-relative'}><LoadData/></div>
    return (
    <div className="result-items">
        {redeemsData.redeems.length > 0
            ? <RedeemedVouchers openModal={openModal} redeems={redeemsData.redeems} currentPage={currentPage} updatePage={page=>setCurrentPage(page)} pagination={redeemsData.pagination} refetchRedeems={refetchRedeems}/>
            : <div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center'}>
                <h4 className="text-danger">{t('ordersProfile.noOrders')}</h4>
            </div>
        }
    </div>
  )
}