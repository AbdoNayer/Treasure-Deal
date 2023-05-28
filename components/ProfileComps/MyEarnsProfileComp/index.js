import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {getMyEarns} from "../../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../../hooks/useApi";
import {useTable} from "../../../hooks/table-hook";
import {LoadData} from "../../index";
import {Pagination} from "../../Pagination";

export const MyEarnsProfileComp = ({...props}) => {
    const { t }                                         = useTranslation();
    const [currentPage, setCurrentPage]                 = useState(1);
    const langVal                                       = useSelector((state) => state.language.language);
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);

    const {
        data:earnsData,
        isLoading:isEarnsDataLoading,
        reFetch:refetchEarnsData
    } = useApi(()=> getMyEarns(currentPage,user.token,langVal,currency))
    const {setObjs,filteredObjs} = useTable([])
    const [dataLoadComplete,setDataLoadComplete] = useState(!!earnsData)
    let PageSize = earnsData ? earnsData.pagination.per_page : 5;

    useEffect(()=>{
        console.log(earnsData);
        if (earnsData) {
            setObjs(earnsData.earns)
            setDataLoadComplete(true)
        }
    },[earnsData])

    useEffect(()=>{
        refetchEarnsData()
    },[currentPage])

    if (!dataLoadComplete) return <div className={'modal-height-view position-relative'}><LoadData/></div>

    return (
        <div>
            <div className="td_orders_table mb-4">
                <div className={'d-flex align-items-center justify-content-between mb-4 px-3'}>
                    <h4 className="td_orders_table_title fw-light">
                        {t('user.profile.earn.tableTitle')}
                    </h4>
                    {/*<div className="td_orders_table_actions d-flex align-items-center">*/}
                    {/*    <div className="td_orders_table_actions_filters d-flex align-items-center">*/}
                    {/*        <div className={`td_filter ms-2 me-2 ${currentFilter==='' && 'td_filter_active'}`} onClick={()=> currentFilter!=='' && setCurrentFilter('')}>*/}
                    {/*            {t('myEarnsTable.allOrders')}*/}
                    {/*        </div>*/}
                    {/*        <div className={`td_filter ms-2 me-2 ${currentFilter==='bundle' && 'td_filter_active'}`} onClick={()=> currentFilter!=='bundle' && setCurrentFilter('bundle')}>*/}
                    {/*            {t('myEarnsTable.bundleOrder')}*/}
                    {/*        </div>*/}
                    {/*        <div className={`td_filter ms-2 me-2 ${currentFilter==='booking' && 'td_filter_active'}`} onClick={()=> currentFilter!=='booking' && setCurrentFilter('booking')}>*/}
                    {/*            {t('myEarnsTable.bookingOrder')}*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className="td_orders_table_actions_sorting d-flex align-items-center mx-3 fs-5" onClick={updateSorting}>*/}
                    {/*        <span className={'me-2'}>Sort by</span>*/}
                    {/*        <span className={checkSortIcon()}/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                {!isEarnsDataLoading
                    ? <>
                        {filteredObjs.length > 0
                            ? 
                            <div className="over-x">
<table className={'table text-center'}>
                                <thead>
                                <tr>
                                    <th className={'fw-light'}>{t('myEarnsTable.orderNo')}</th>
                                    <th className={'fw-light'}>{t('myEarnsTable.refId')}</th>
                                    <th className={'fw-light'}>{t('myEarnsTable.date')}</th>
                                    <th className={'fw-light'}>{t('myEarnsTable.earn')}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredObjs.map(order=> <tr key={order.id}>
                                    <td>{order.order_num}</td>
                                    <td>{order.refferal_id}</td>
                                    <td>{order.created_at ? order.created_at.split('T')[0] : 'N/A'}</td>
                                    <td>{order.earn}</td>
                                </tr>)}
                                </tbody>
                            </table>
                            </div>
                            :<div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center'}>
                                <h4 className="text-danger">{t('myEarnsTable.noEarns')}</h4>
                            </div>
                        }
                    </>
                    :<div className={'modal-height-view position-relative'}><LoadData/></div>
                }
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={earnsData.pagination.total_items}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />
            </div>
        </div>
    )
}