import {useSelector} from "react-redux";
import {useState,useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useApi} from "../../../hooks/useApi";
import {getMyDrawsCall, getOrdersCall} from "../../../redux-toolkit/actions/axiosCalls";
import {useTable} from "../../../hooks/table-hook";
import {LoadData} from "../../index";
import {SortableFieldHeader} from "../../SortableFieldHeader";
import {Pagination} from "../../Pagination";
import {useRouter} from "next/router";

export const MyDrawTableProfileComp = ({...props}) => {
    const langVal                                       = useSelector((state) => state.language.language);
    const user                                          = useSelector((state) => state.user.user);
    const currency                                          = useSelector((state) => state.currency.currency);

    const [currentFilter,setCurrentFilter]              = useState('millionaire')
    const [currentPage, setCurrentPage]                 = useState(1);
    const router = useRouter()
    const { t }     = useTranslation();
    const {
        data,
        isLoading,
        reFetch,
    } = useApi(()=> getMyDrawsCall(currentFilter,currentPage,user.token,langVal,currency))
    const [dataLoadComplete,setDataLoadComplete] = useState(!!data)
    const {createFilterHandler,createSearchHandler,createSortHandler,setObjs,filteredObjs,getOptions,getSortingMode,message} = useTable([])
    let PageSize = data ? data.pagination.per_page : 5;
    useEffect(()=>{
        if (data) {
            setObjs(data.draws)
            setDataLoadComplete(true)
        }
    },[data])
    useEffect(()=>{
        if (currentPage !== 1) setCurrentPage(1)
        else reFetch()
    },[currentFilter])
    useEffect(()=>{
        reFetch()
    },[currentPage])

    if (!dataLoadComplete) return <div className={'modal-height-view position-relative'}><LoadData/></div>

    return (
        <div className="td_orders_table mb-4">
            <div className={'t_h_table_order d-flex align-items-center justify-content-between'}>
                <h4 className="td_orders_table_title fw-light mb-4 px-3">
                    My Draw
                </h4>
                <div className="td_orders_table_actions">
                    <div className="td_orders_table_actions_filters d-flex align-items-center">
                        <h6 className={`td_filter ms-2 me-2 ${currentFilter==='millionaire' && 'td_filter_active'}`} onClick={()=> currentFilter!=='millionaire' && setCurrentFilter('millionaire ')}>
                            Millionaire
                        </h6>
                        <h6 className={`td_filter ms-2 me-2 ${currentFilter==='raffleillionaire' && 'td_filter_active'}`} onClick={()=> currentFilter!=='raffleillionaire' && setCurrentFilter('raffleillionaire')}>
                            Raffleillionaire
                        </h6>
                        <h6 className={`td_filter ms-2 me-2 ${currentFilter==='luxury_villas' && 'td_filter_active'}`} onClick={()=> currentFilter!=='luxury_villas' && setCurrentFilter('luxury_villas')}>
                            Luxury Villa
                        </h6>
                        <h6 className={`td_filter ms-2 me-2 ${currentFilter==='luxury_cars' && 'td_filter_active'}`} onClick={()=> currentFilter!=='luxury_cars' && setCurrentFilter('luxury_cars')}>
                            Luxury Car
                        </h6>
                        <h6 className={`td_filter ms-2 me-2 ${currentFilter==='luxury_watches' && 'td_filter_active'}`} onClick={()=> currentFilter!=='luxury_watches' && setCurrentFilter('luxury_watches')}>
                            Luxury Watches
                        </h6>
                        <h6 className={`td_filter ms-2 me-2 ${currentFilter==='bride_groom' && 'td_filter_active'}`} onClick={()=> currentFilter!=='bride_groom' && setCurrentFilter('bride_groom')}>
                            Bride & Groom
                        </h6>
                    </div>
                    {/*<div className="td_orders_table_actions_sorting">Sort</div>*/}
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
                                        <th className={'fw-light'}>Draw Series</th>
                                        <th className={'fw-light'}>Draw date</th>
                                        <th className={'fw-light'}>Results</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {filteredObjs.map(draw=> <tr key={draw.id}>
                                    <td>{draw.series}</td>
                                    <td>{draw.date}</td>
                                    <td className={'text-primary text-decoration-underline'} onClick={()=>router.push(`/my-account/my-draw?draw_id=${draw.id}`)}>{draw.status}</td>
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
    )
}