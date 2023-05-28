import {useTranslation} from "react-i18next";
import Barcode from "react-barcode";
import {showModalAction} from "../../../redux-toolkit/actions";
import {ModalForm} from "../../ModalForms/ModalForm";
import {Feedback} from "../../index";
import {useDispatch} from "react-redux";
import {Pagination} from "../../Pagination";
import {useTable} from "../../../hooks/table-hook";
import {useEffect} from "react";

export const RedeemedVouchers = ({redeems,openModal,refetchRedeems,pagination,updatePage,currentPage,...props}) => {
    const { t }                                         = useTranslation();
    const dispatch = useDispatch();
    const openFeedBackModal = (redeemId) => {
        dispatch(showModalAction( <ModalForm title={t('app.feedBack')}>
            <Feedback redeemId={redeemId} refetchRedeems={refetchRedeems}/>
        </ModalForm> ))
    }

    const {setObjs,filteredObjs,message} = useTable([])

    useEffect(()=>{
        if (redeems) {
            setObjs(redeems)
        }
    },[redeems])
    return (
        <div className="details">
            {/*
            <div className="result-items">
                {
                    redeems.map(redeem => (
                        <div key={redeem.id} className="block-item-cate d-flex align-items-center p-2 row">
                            <div className="col-md-3 col-xs-12">
                                <div className="img-vocher position-relative act text-center">
                                    <Barcode value={redeem.redeem_num} format={'CODE128'} width={4} fontSize={20} />
                                </div>
                            </div>
                            <div className="col-md-9 col-xs-12">
                                <div className="info-vocher p-3">
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div className=''>
                                            <h4>{redeem.voucher.category}</h4>
                                            <h6 className="fw-light">{redeem.voucher.category}</h6>
                                        </div>
                                        <div className='d-flex align-items-center justify-content-center flex-column'>
                                            <div className='py-2 fw-light bg-transparent'>{redeem.status_text}</div>
                                            {redeem.has_feedback===0 && <button
                                                className='p-0 m-0 bg-transparent mainColor text-decoration-underline'
                                                onClick={() => openFeedBackModal(redeem.id)}>{t('booking.feedback.rateStars')}</button>}
                                        </div>
                                    </div>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <span className="bgMainColor p-2 rounded-4 text-white my-2 px-3">{parseInt(redeem.voucher.discount_per)}% Off</span>
                                        <button className='p-0 m-0 bg-transparent mainColor' onClick={()=> openModal('terms')}>{t('booking.details.terms')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            */}
            <div className='mb-5 mt-3'>
                {filteredObjs.length > 0
                    ? 
                    <div className="over-x">
                    <table className="table bg-white text-center border">
                        <thead>
                        <tr>
                            {/*<th>Sl.No</th>*/}
                            <th>{t('app.barcode')}</th>
                            <th>{t('app.offer')}</th>
                            <th>{t('app.voucher')}</th>
                            <th>{t('app.ordersProfile')}</th>
                            <th>{t('app.actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredObjs.map(item=> (
                            // <RedeemsRow key={item.id} item={item} refetchRedeems={refetchRedeems}/>
                            <tr key={item.id}>
                                <td>
                                    <Barcode value={item.redeem_num} format={'CODE128'} width={2} height={30} fontSize={12} />
                                </td>
                                <td>{item.voucher.discount_per} % {t('shoppingCart.discount')}</td>
                                <td>{item.voucher.category}</td>
                                <td><span className={`${item.status === 'redeemed' ? 'mainColor' : 'text-success'}`}>{item.status_text}</span></td>
                                <td>
                                    {item.has_feedback===0
                                        ? <button
                                            className='p-0 m-0 bg-transparent mainColor text-decoration-underline'
                                            onClick={() => openFeedBackModal(item.id)}>{t('booking.feedback.rateStars')}
                                        </button>
                                        : <span className={`text-success`}>{t('app.rated')}</span>
                                    }
                                </td>
                            </tr>
                        ))
                        }
                        </tbody>
                    </table>
                    </div>
                    : <h3 className={'text-center text-danger my-5'}>No Redeems Yet</h3>
                }
                <div className="td-pagination mt-3 d-flex justify-content-end">
                    {pagination && <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={pagination.total_items}
                        pageSize={pagination.per_page}
                        onPageChange={updatePage}
                    />}
                </div>
            </div>

        </div>
    )
}