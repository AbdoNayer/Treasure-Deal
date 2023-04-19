import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { showModalAction } from "../../../redux-toolkit/actions";
import { ModalForm } from "../../ModalForms/ModalForm";
import { EnquiryDetails } from "../../ModalForms/EnquiryDetails";

export const Enquiry = ({...props}) =>  {
    const langVal                                       = useSelector((state) => state.language.language);
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);

    const [currentFilter,setCurrentFilter]              = useState('')
    const dispatch                                      = useDispatch();
    const { t }                                         = useTranslation();

    const clickView = () => {
        dispatch(showModalAction(
            <ModalForm title={t('user.profile.enquiry.title')}>
                <EnquiryDetails />
            </ModalForm>
        ))
    }


    return (
        <div className="">
            <div className="td_orders_table my-5">
                <div className={'d-flex align-items-center justify-content-between px-3 mb-4'}>
                    <h4 className="td_orders_table_title fw-light">
                        {t('user.profile.enquiry.title')}
                    </h4>
                </div>
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
                        <tr>
                            <td>1</td>
                            <td>03-03-2023</td>
                            <td>Basic</td>
                            <td>Hotel</td>
                            <td className="text-warning">Pending</td>
                            <td><button onClick={clickView} className="text-primary bg-transparent"><i className="icon-eye mainColor fs-4"></i></button></td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>03-03-2023</td>
                            <td>Basic</td>
                            <td>Hotel</td>
                            <td className="text-success">Accepted</td>
                            <td><button onClick={clickView} className="text-primary bg-transparent"><i className="icon-eye mainColor fs-4"></i></button></td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>03-03-2023</td>
                            <td>Basic</td>
                            <td>Hotel</td>
                            <td className="text-danger">Rejected</td>
                            <td><button onClick={clickView} className="text-primary bg-transparent"><i className="icon-eye mainColor fs-4"></i></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}