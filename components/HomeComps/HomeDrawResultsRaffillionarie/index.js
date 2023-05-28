import app from "../../../app.json";
import {useSelector} from "react-redux";
import {useApi} from "../../../hooks/useApi";
import {getResultsRaffellionaire} from "../../../redux-toolkit/actions/axiosCalls";
import {useTranslation} from "react-i18next";
import Link from "next/link";

export const HomeDrawResultsRaffillionarie = ({...props}) => {
    const { t }                             = useTranslation();
    const user                              = useSelector((state) => state.user.user);
    const langVal                           = useSelector((state) => state.language.language);
    const currency                          = useSelector((state) => state.currency.currency);
    const {
        data,
        isLoading,
        error,
        reFetch
    } = useApi(()=> getResultsRaffellionaire(user.token,langVal,currency,'','raffleillionaire'))

    if (data?.previous_draws?.length === 0) return null
    return (
        <div className='table-view my-5 overflow-hidden'>
            <h3 className='fw-light mb-3'>{t("category.raffleillionaire")}</h3>
            <table style={{ borderRadius: "10px 10px 0 0" }} className="table table-bordered text-center overflow-hidden" data-aos="fade-up" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
                <thead className='bgMainColor'>
                <tr>
                    <th className='fw-light text-white fs-5'>{t("app.resultDate")}</th>
                    <th className='fw-light text-white fs-5'>{t("app.drawSeries")}</th>
                    <th className='fw-light text-white fs-5'>{t("app.ticketNumbers")}</th>
                    <th className='fw-light text-white fs-5'>{t("app.details")}</th>
                </tr>
                </thead>
                <tbody>
                {data?.previous_draws?.map((item, i) => (
                        <tr key={item.id}>
                            <td className='fw-light fs-5'>{item.date}</td>
                            <td className='fw-light fs-5'>{item.series}</td>
                            <td>
                                <div className='d-flex justify-content-center align-items-center'>
                                    TD - {item.ticket}
                                </div>
                            </td>
                            <td>
                                <Link href={`/results/raffellionaire-draw/details?draw_id=${item.id}`} className='btn-button bgSecondColor w-75 fw-light d-flex justify-content-center align-items-center m-auto'>{t("app.drawDetails")}</Link>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}