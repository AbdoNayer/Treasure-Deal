import {useApi} from "../../../hooks/useApi";
import {getOrdersCall} from "../../../redux-toolkit/actions/axiosCalls";
import {useSelector} from "react-redux";
import {LoadData} from "../../index";
import {useEffect} from "react";
import {useMemo, useState} from "react";
import {Pagination} from "../../Pagination";
import {useTranslation} from "react-i18next";
import {useTable} from "../../../hooks/table-hook";
import {SortableFieldHeader} from "../../SortableFieldHeader";

export const OrdersTableProfileComp = ({...props}) => {
    const langVal                                       = useSelector((state) => state.language.language);
    const user                                          = useSelector((state) => state.user.user);
    const [currentFilter,setCurrentFilter]              = useState('')
    const [currentSort,setCurrentSort]                  = useState('')
    const [currentPage, setCurrentPage]                 = useState(1);
    const { t }     = useTranslation();
    const currency                                          = useSelector((state) => state.currency.currency);

    const {
        data,
        isLoading,
        reFetch,
    } = useApi(()=> getOrdersCall(currentSort,currentFilter,currentPage,user.token,langVal,currency))
    const [dataLoadComplete,setDataLoadComplete] = useState(!!data)

    const {createFilterHandler,createSearchHandler,createSortHandler,setObjs,filteredObjs,getOptions,getSortingMode,message} = useTable([])
    let PageSize = data ? data.pagination.per_page : 5;
    // let PageSize = 3;

    // const currentTableData = useMemo(() => {
    //     if (data) {
    //         const firstPageIndex = (currentPage - 1) * PageSize; //0
    //         const lastPageIndex = firstPageIndex + PageSize; //10
    //         return tableData.slice(firstPageIndex, lastPageIndex);
    //     }
    // },[data]);
    const updateSorting = () => {
        if (isLoading) return
        if (currentSort!=='asc') setCurrentSort('asc')
        if (currentSort==='asc') setCurrentSort('desc')
    }
    const checkSortIcon = () => {
        switch (currentSort) {
            case '':
                return 'icon-sort';
            case 'asc':
                return 'icon-up-sort';
            case 'desc':
                return 'icon-down-sort';
        }
    }


    useEffect(()=>{
        if (data) {
            setObjs(data.orders)
            setDataLoadComplete(true)
        }
    },[data])

    useEffect(()=>{
        if (currentPage !== 1) setCurrentPage(1)
        else reFetch()
    },[currentFilter])
    useEffect(()=>{
        if (currentPage !== 1) setCurrentPage(1)
        else reFetch()
    },[currentSort])
    useEffect(()=>{
        reFetch()
    },[currentPage])

    if (!dataLoadComplete) return <div className={'modal-height-view position-relative'}><LoadData/></div>

    return (
        <div>
            <div className="td_orders_table mb-4">
                    <div className={'t_h_table_order d-flex align-items-center justify-content-between mb-4 px-3'}>
                        <h4 className="td_orders_table_title fw-light">
                            {t('user.profile.orders.title')}
                        </h4>
                        <div className="td_orders_table_actions d-flex align-items-center">
                            <div className="td_orders_table_actions_filters d-flex align-items-center">
                                <div className={`td_filter ms-2 me-2 ${currentFilter==='' && 'td_filter_active'}`} onClick={()=> currentFilter!=='' && setCurrentFilter('')}>
                                    {t('ordersProfile.allOrders')}
                                </div>
                                <div className={`td_filter ms-2 me-2 ${currentFilter==='bundle' && 'td_filter_active'}`} onClick={()=> currentFilter!=='bundle' && setCurrentFilter('bundle')}>
                                    {t('ordersProfile.bundleOrder')}
                                </div>
                                <div className={`td_filter ms-2 me-2 ${currentFilter==='booking' && 'td_filter_active'}`} onClick={()=> currentFilter!=='booking' && setCurrentFilter('booking')}>
                                    {t('ordersProfile.bookingOrder')}
                                </div>
                            </div>
                            <div className="td_orders_table_actions_sorting d-flex align-items-center mx-3 fs-5" onClick={updateSorting}>
                                <span className={'me-2'}>{t('app.sortBy')}</span>
                                <span className={checkSortIcon()}/>
                            </div>
                        </div>
                    </div>
                    {!isLoading
                        ? <>
                            {filteredObjs.length > 0
                                ? 
                                <div className="over-x">
                                    <table className={'table text-center'}>
                                        <thead>
                                            <tr>
                                                <th className={'fw-light'}>{t('ordersProfile.confirmationNo')}</th>
                                                <th className={'fw-light'}>{t('ordersProfile.date')}</th>
                                                <th className={'fw-light'}>{t('ordersProfile.type')}</th>
                                                <th className={'fw-light'}>{t('ordersProfile.status')}</th>
                                                <th className={'fw-light'}>{t('myEarnsTable.refId')}</th>
                                                <th className={'fw-light'}>{t('ordersProfile.paymentMethod')}</th>
                                                <th className={'fw-light'}>{t('ordersProfile.amount')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredObjs.map(order=> <tr key={order.id}>
                                                <td>{order.order_num}</td>
                                                <td>{order.date ? order.date.split('T')[0] : 'N/A'}</td>
                                                <td>{order.type_text}</td>
                                                <td>{order.status_text}</td>
                                                <td>{order.refferal_id}</td>
                                                <td>{order.pay_type_text}</td>
                                                <td>{(order.illusion_data? (order.illusion_data.Currency + ' ') : '') + order.final_total}</td>
                                            </tr>)}
                                        </tbody>
                                    </table>
                                </div>
                                :<div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center'}>
                                    <h4 className="text-danger">{t('ordersProfile.noOrders')}</h4>
                                </div>
                            }
                        </>
                        :<div className={'modal-height-view position-relative'}><LoadData/></div>
                    }
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={data.pagination.total_items}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
        </div>
    )
}