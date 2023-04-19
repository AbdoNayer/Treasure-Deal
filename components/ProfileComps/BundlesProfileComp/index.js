import {useTranslation} from "react-i18next";
import {getBundlesCall} from "../../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../../hooks/useApi";
import {useSelector} from "react-redux";
import {LoadData} from "../../index";
import {Pagination} from "../../Pagination";
import {useEffect, useMemo, useState} from "react";
import {useTable} from "../../../hooks/table-hook";

export const BundlesProfileComp = ({...props}) => {
    const { t }                                             = useTranslation();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const [currentPage, setCurrentPage] = useState(1);
    const currency                                          = useSelector((state) => state.currency.currency);

    const {
        data,
        isLoading,
        error,
        reFetch
    } = useApi(()=> getBundlesCall(currentPage,user.token,langVal,currency))
    const [dataLoadComplete,setDataLoadComplete] = useState(!!data)

    const {createFilterHandler,createSearchHandler,createSortHandler,setObjs,filteredObjs,getOptions,getSortingMode,message} = useTable([])

    let PageSize = data ? data.pagination.per_page : 5;
    // let PageSize = 5;

    useEffect(()=>{
        if (data) {
            setObjs(data.bundles)
            setDataLoadComplete(true)
        }
    },[data])

    // const currentTableData = useMemo(() => {
    //     if (data) {
    //         const firstPageIndex = (currentPage - 1) * PageSize;
    //         const lastPageIndex = firstPageIndex + PageSize;
    //         return data.bundles.slice(firstPageIndex, lastPageIndex);
    //     }
    // }, [currentPage,data]);
    useEffect(()=>{
        reFetch()
    },[currentPage])

    if (!dataLoadComplete) return <div className={'modal-height-view position-relative'}><LoadData/></div>
    return (
        <div className="">
            <div className="my-3">
                <h4>{t("app.myBundle")}</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio. Fugit iste asperiores repellendus voluptate omnis iusto officiis nam praesentium. Add your vouchers more you can play more lotto at the</p>
            </div>
            <div className="box-table bx-shadow bg-white p-4 rounded-3 border-main my-3">
                <h4>{t("app.myBundle")}</h4>
                <div className="table-view-in-profile">
                    {!isLoading
                        ? <>
                            {filteredObjs.length > 0
                                ? <table className="table text-center">
                                    <thead>
                                    <tr>
                                        <th className="fw-light">{t('ordersProfile.type')}</th>
                                        <th className="fw-light">{t('bundlesProfile.orderNo')}</th>
                                        <th className="fw-light">{t('bundlesProfile.totalVouchers')}</th>
                                        <th className="fw-light">{t('bundlesProfile.usedVouchers')}</th>
                                        <th className="fw-light">{t('bundlesProfile.balanceVouchers')}</th>
                                        <th className="fw-light">{t('bundlesProfile.expiryDate')}</th>
                                        <th className="fw-light">{t('ordersProfile.status')}</th>
                                        {/*<th className="fw-light">{t('bundlesProfile.totalVouchers')}</th>*/}
                                        {/*<th className="fw-light">{t('bundlesProfile.usedVouchers')}</th>*/}
                                        {/*<th className="fw-light">{t('bundlesProfile.balanceVouchers')}</th>*/}
                                        {/*<th className="fw-light">{t('bundlesProfile.expiryDate')}</th>*/}
                                        {/*<th className="fw-light">{t('ordersProfile.status')}</th>*/}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        filteredObjs.map(bundle=> <tr key={bundle.id}>
                                            <td>{bundle.type_text}</td>
                                            <td>{bundle.order_no}</td>
                                            <td>{bundle.total_vouchers}</td>
                                            <td>{bundle.used_vouchers}</td>
                                            <td>{bundle.balance_vouchers}</td>
                                            <td>{bundle.expires_at}</td>
                                            <td>{bundle.status_text}</td>
                                        </tr>)
                                    }
                                    </tbody>
                                </table>
                                : <div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center w-100'}>
                                    <h4 className="text-danger">{t('bundlesProfile.noBundles')}</h4>
                                </div>
                            }

                        </>

                        : <div className={'modal-height-view position-relative'}><LoadData/></div>
                    }
                    {/*{currentTableData && currentTableData.length > 0*/}
                    {/*    ?*/}
                    {/*    <table className="table text-center">*/}
                    {/*        <thead>*/}
                    {/*        <tr>*/}
                    {/*            <th className="fw-light">{t('ordersProfile.type')}</th>*/}
                    {/*            <th className="fw-light">{t('bundlesProfile.orderNo')}</th>*/}
                    {/*            <th className="fw-light">{t('bundlesProfile.totalVouchers')}</th>*/}
                    {/*            <th className="fw-light">{t('bundlesProfile.usedVouchers')}</th>*/}
                    {/*            <th className="fw-light">{t('bundlesProfile.balanceVouchers')}</th>*/}
                    {/*            <th className="fw-light">{t('bundlesProfile.expiryDate')}</th>*/}
                    {/*            <th className="fw-light">{t('ordersProfile.status')}</th>*/}
                    {/*        </tr>*/}
                    {/*        </thead>*/}
                    {/*        <tbody>*/}
                    {/*            {*/}
                    {/*                currentTableData.map(bundle=> <tr key={bundle.id}>*/}
                    {/*                    <td>{bundle.type_text}</td>*/}
                    {/*                    <td>{bundle.order_no}</td>*/}
                    {/*                    <td>{bundle.total_vouchers}</td>*/}
                    {/*                    <td>{bundle.used_vouchers}</td>*/}
                    {/*                    <td>{bundle.balance_vouchers}</td>*/}
                    {/*                    <td>{bundle.expires_at}</td>*/}
                    {/*                    <td>{bundle.status_text}</td>*/}
                    {/*                </tr>)*/}
                    {/*            }*/}
                    {/*        </tbody>*/}
                    {/*    </table>*/}
                    {/*    :*/}
                    {/*    <div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center w-100'}>*/}
                    {/*        <h4 className="text-danger">{t('bundlesProfile.noBundles')}</h4>*/}
                    {/*    </div>*/}
                    {/*}*/}
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={data.pagination.total_items}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
    )
}