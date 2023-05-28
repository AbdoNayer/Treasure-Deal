import {useApi} from "../../../hooks/useApi";
import {getOrdersCall} from "../../../redux-toolkit/actions/axiosCalls";
import {useSelector} from "react-redux";
import {LoadData} from "../../index";
import {useEffect} from "react";
import {useState} from "react";
import {Pagination} from "../../Pagination";
import {useTranslation} from "react-i18next";
import Link from "next/link";
import {useTable} from "../../../hooks/table-hook";

export const RedeemVoucherResult = ({...props}) => {
    const langVal                                       = useSelector((state) => state.language.language);
    const user                                          = useSelector((state) => state.user.user);
    const currency                                          = useSelector((state) => state.currency.currency);

    const [currentFilter,setCurrentFilter]              = useState('')
    const [currentSort,setCurrentSort]                  = useState('')
    const [currentPage, setCurrentPage]                 = useState(1);
    const { t }     = useTranslation();

    const {
        data,
        isLoading,
        reFetch,
    } = useApi(()=> getOrdersCall(currentSort,currentFilter,currentPage,user.token,langVal,currency))
    const [dataLoadComplete,setDataLoadComplete] = useState(!!data)

    const {setObjs,filteredObjs } = useTable([])
    let PageSize = data ? data.pagination.per_page : 5;
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
                    <div className={'d-flex align-items-center justify-content-between px-3 mb-4'}>
                        <h4 className="td_orders_table_title fw-light">
                            {t('user.profile.Redeem.redeem')}
                        </h4>
                        <div className="td_orders_table_actions_sorting d-flex align-items-center fs-5" onClick={updateSorting}>
                            <span className={'me-2'}>Sort by</span>
                            <span className={checkSortIcon()}/>
                        </div>
                    </div>
                    {/* {!isLoading
                        ? <>
                            {filteredObjs.length > 0
                                ? <table className={'table text-center'}>
                                    <thead>
                                        <tr>
                                            <th className={'fw-light'}>{t('ordersProfile.confirmationNo')}</th>
                                            <th className={'fw-light'}>{t('ordersProfile.date')}</th>
                                            <th className={'fw-light'}>{t('ordersProfile.type')}</th>
                                            <th className={'fw-light'}>{t('ordersProfile.status')}</th>
                                            <th className={'fw-light'}>{t('ordersProfile.paymentMethod')}</th>
                                            <th className={'fw-light'}>{t('ordersProfile.amount')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredObjs.map(order=> <tr key={order.id}>
                                            <td>{order.order_num}</td>
                                            <td>{order.date}</td>
                                            <td>{order.type_text}</td>
                                            <td>{order.status_text}</td>
                                            <td>{order.pay_type_text}</td>
                                            <td>{order.final_total}</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                                :<div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center'}>
                                    <h4 className="text-danger">{t('user.profile.Redeem.noResult')}</h4>
                                </div>
                            }
                        </>
                        :<div className={'modal-height-view position-relative'}><LoadData/></div>
                    } */}
                        <div className="over-x">
                        <table className={'table text-center'}>
                            <thead>
                                <tr>
                                    <th className={'fw-light'}>{t('user.profile.Redeem.bundleName')}</th>
                                    <th className={'fw-light'}>{t('user.profile.Redeem.merchantName')}</th>
                                    <th className={'fw-light'}>{t('user.profile.Redeem.redeemDate')}</th>
                                    <th className={'fw-light'}>{t('user.profile.Redeem.raffleID')}</th>
                                    <th className={'fw-light'}>{t('draw.drawDate')}</th>
                                    <th className={'fw-light'}>{t('app.details')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Bundle Of 5</td>
                                    <td>Adidas</td>
                                    <td>20-12-2022</td>
                                    <td>9874562</td>
                                    <td>13-01-2023</td>
                                    <td><Link href={'/'} className="text-primary">Waiting for results</Link></td>
                                </tr>
                                <tr>
                                    <td>Bundle Of 5</td>
                                    <td>Adidas</td>
                                    <td>20-12-2022</td>
                                    <td>9874562</td>
                                    <td>13-01-2023</td>
                                    <td><Link href={'/'} className="text-primary">Waiting for results</Link></td>
                                </tr>
                                <tr>
                                    <td>Bundle Of 5</td>
                                    <td>Adidas</td>
                                    <td>20-12-2022</td>
                                    <td>9874562</td>
                                    <td>13-01-2023</td>
                                    <td><Link href={'/'} className="text-primary">Waiting for results</Link></td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
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