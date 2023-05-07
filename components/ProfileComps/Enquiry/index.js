import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { showModalAction } from "../../../redux-toolkit/actions";
import { ModalForm } from "../../ModalForms/ModalForm";
import { EnquiryDetails } from "../../ModalForms/EnquiryDetails";
import {getEnquiresData} from "../../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../../hooks/useApi";
import LoadData from "../../LoadData";
import {useTable} from "../../../hooks/table-hook";
import {convertIndexToSerial} from "../../../redux-toolkit/consts";
import {Pagination} from "../../Pagination";

export const Enquiry = ({...props}) =>  {
    const langVal                                       = useSelector((state) => state.language.language);
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);

    const [currentFilter,setCurrentFilter]              = useState('')
    const dispatch                                      = useDispatch();
    const { t }                                         = useTranslation();

    const [currentPage,setCurrentPage] = useState(1)
    const {setObjs,filteredObjs,message} = useTable([])

    const {
        data:enquiresData,
        isLoading:isEnquiresDataLoading,
        reFetch:refetchEnquiresData
    } = useApi(()=> getEnquiresData(currentPage,user.token,langVal,currency))
    const [dataLoadComplete,setDataLoadComplete] = useState(!!enquiresData)

    useEffect(()=>{
        if (enquiresData){
            if (enquiresData.enquiries) {
                setObjs(enquiresData.enquiries)
                setDataLoadComplete(true)
            }
        }
    },[enquiresData])
    useEffect(()=>{
        refetchEnquiresData()
    },[currentPage])

    const clickView = (id) => {
        dispatch(showModalAction(
            <ModalForm title={t('user.profile.enquiry.title')}>
                <EnquiryDetails enquiryId={id} />
            </ModalForm>
        ))
    }

    if (!dataLoadComplete) return <div className={'modal-height-view position-relative'}><LoadData/></div>

    return (
        <div className="">
            <div className="td_orders_table my-5">
                
                <div className={'d-flex align-items-center justify-content-between px-3 mb-4'}>
                    <h4 className="td_orders_table_title fw-light">
                        {t('user.profile.enquiry.title')}
                    </h4>
                </div>

                {
                    filteredObjs.length > 0 ? 
                    <table className={'table text-center'}>
                        <thead>
                            <tr>
                                <th className={'fw-light'}>Si.No</th>
                                <th className={'fw-light'}>{t('user.profile.enquiry.compo.date')}</th>
                                <th className={'fw-light'}>{t('user.profile.enquiry.compo.package')}</th>
                                <th className={'fw-light'}>{t('user.profile.enquiry.compo.merchant')}</th>
                                <th className={'fw-light'}>{t('ordersProfile.status')}</th>
                                <th className={'fw-light'}>{t('favouritesProfile.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            filteredObjs.map((enquiry,idx) =>
                                <tr key={enquiry.id}>
                                    <td>{convertIndexToSerial(idx,currentPage,enquiresData?.pagination.per_page)}</td>
                                    <td>{enquiry.date}</td>
                                    <td>{enquiry.package}</td>
                                    <td>{enquiry.merchant.name}</td>
                                    <td className="text-warning">{enquiry.status_text}</td>
                                    <td>
                                        <button onClick={()=>clickView(enquiry.id)} className="text-primary bg-transparent">
                                            <i className="icon-eye mainColor fs-4"/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                :
                    <div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center'}>
                        <h4 className="text-danger">{t('user.profile.enquiry.NEnquiresYet')}</h4>
                    </div>
                }
                        
                <div className="td-pagination mt-3 d-flex justify-content-end">
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={enquiresData?.pagination.total_items||1}
                        pageSize={enquiresData?.pagination.per_page}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
    )
}