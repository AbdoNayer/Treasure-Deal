import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {Pagination} from "../../Pagination";

export const ReferralCode = ({...props}) =>  {
    const langVal                                       = useSelector((state) => state.language.language);
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);

    const [currentPage, setCurrentPage]                 = useState(1);
    const { t }     = useTranslation();


    return (
        <div className="">
            
            <div className="my-3">
                <h4>{t('user.profile.referral.title')}</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio. Fugit iste asperiores repellendus voluptate omnis iusto officiis nam praesentium. Add your vouchers more you can play more lotto at the</p>
            </div>
            
            <div className="d-flex align-items-center my-4">
                <button className="bgMainColor text-white px-3 py-2 rounded-2 old-shadow d-flex align-items-center">
                    <i className="icon-repeat"></i>
                    <span className="mx-2">Generate Code</span>
                </button>
                <button className="bg-white px-3 py-2 rounded-2 mainColor border mx-3 old-shadow d-flex align-items-center">
                    <span>ALAND12461</span>
                    <i className="icon-copy mx-2"></i>
                </button>
                <button className="bg-transparent mx-3">
                    <i className="icon-share-f mainColor fs-3"></i>
                </button>
            </div>


            <div className="td_orders_table my-5">
                    <div className={'d-flex align-items-center justify-content-between px-3 mb-4'}>
                        <h4 className="td_orders_table_title fw-light">
                            {t('user.profile.referral.title')}
                        </h4>
                    </div>
                        <table className={'table text-center'}>
                            <thead>
                                <tr>
                                    <th className={'fw-light'}>Si.No</th>
                                    <th className={'fw-light'}>{t('user.profile.referral.title')}</th>
                                    <th className={'fw-light'}>{t('user.profile.referral.comp.dateIssue')}</th>
                                    <th className={'fw-light'}>{t('user.profile.referral.comp.expireDate')}</th>
                                    <th className={'fw-light'}>{t('user.profile.referral.comp.participate')}</th>
                                    <th className={'fw-light'}>{t('ordersProfile.status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Bundle Of 5</td>
                                    <td>Adidas</td>
                                    <td>20-12-2022</td>
                                    <td>9874562</td>
                                    <td>13-01-2023</td>
                                    <td><button className="text-primary bg-transparent text-decoration-underline">Waiting for results</button></td>
                                </tr>
                                <tr>
                                    <td>Bundle Of 5</td>
                                    <td>Adidas</td>
                                    <td>20-12-2022</td>
                                    <td>9874562</td>
                                    <td>13-01-2023</td>
                                    <td><button className="text-success bg-transparent text-decoration-underline">Win</button></td>
                                </tr>
                                <tr>
                                    <td>Bundle Of 5</td>
                                    <td>Adidas</td>
                                    <td>20-12-2022</td>
                                    <td>9874562</td>
                                    <td>13-01-2023</td>
                                    <td><button className="mainColor bg-transparent text-decoration-underline">No Win</button></td>
                                </tr>
                            </tbody>
                        </table>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={1}
                        pageSize={5}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>

        </div>
    )
}