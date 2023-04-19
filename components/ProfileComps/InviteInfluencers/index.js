import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pagination } from "../../Pagination";
import { InputText } from "../../Inputs/InputText";

export const InviteInfluencers = ({...props}) =>  {
    const langVal                                       = useSelector((state) => state.language.language);
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);

    const [currentPage, setCurrentPage]                 = useState(1);
    const { t }     = useTranslation();


    return (
        <div className="invite-influencers">
            
            <div className="my-3">
                <h4>{t('user.profile.influencers.title')}</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis tempore voluptates doloremque eligendi provident! Fugiat facere iure temporibus id distinctio. Fugit iste asperiores repellendus voluptate omnis iusto officiis nam praesentium. Add your vouchers more you can play more lotto at the</p>
            </div>
            
            <div className="d-flex align-items-center my-4 form">
                <div className='mx-2 mt-2'>
                    <InputText
                        className='px-3 py-2'
                        label={t('register.labels.name')}
                        type={'text'}
                    />
                </div>
                <div className='mx-2 mt-2'>
                    <InputText
                        className='px-3 py-2'
                        label={t('register.labels.email')}
                        type={'email'}
                    />
                </div>
                <button className="bgMainColor text-white rounded-2 align-self-end small-font-13">
                    Send Inivitation
                </button>
            </div>


            <div className="td_orders_table my-5">
                    <div className={'d-flex align-items-center justify-content-between px-3 mb-4'}>
                        <h4 className="td_orders_table_title fw-light">
                            {t('user.profile.influencers.titleCom')}
                        </h4>
                    </div>
                        <table className={'table text-center'}>
                            <thead>
                                <tr>
                                    <th className={'fw-light'}>Si.No</th>
                                    <th className={'fw-light'}>{t('register.labels.name')}</th>
                                    <th className={'fw-light'}>{t('register.labels.email')}</th>
                                    <th className={'fw-light'}>{t('favouritesProfile.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Alan</td>
                                    <td>alen342@gmail.com</td>
                                    <td><button className="text-primary bg-transparent"><i className="icon-trash-2 mainColor fs-4"></i></button></td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>Alan</td>
                                    <td>alen342@gmail.com</td>
                                    <td><button className="text-primary bg-transparent"><i className="icon-trash-2 mainColor fs-4"></i></button></td>
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