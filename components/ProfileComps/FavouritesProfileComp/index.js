import {LuckyNumbersCard} from "../../LuckyNumbersCard";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {selectLinesMillionaire, showModalAction} from "../../../redux-toolkit/actions";
import {LoadData} from "../../index";
import {deleteLuckyNumbers, getLuckyNumbers} from "../../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../../hooks/useApi";
import {FavouriteLuckyRow} from "../../FavouriteLuckyRow";
import {ModalForm} from "../../ModalForms/ModalForm";
import {EditLuckyNumberModalForm} from "../../ModalForms/EditLuckyNumberModalForm";
import {UpdateFavoriteLuckyModalForm} from "../../ModalForms/UpdateFavoriteLuckyModalForm";

export const FavouritesProfileComp = ({...props}) => {
    const { t }                                             = useTranslation();
    const dispatch                                          = useDispatch();
    const millionLinesInfo                                  = useSelector((state) => state.linesMillionair.millionLines);
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const [isLoadData,setIsLoadData]                        = useState(false);
    const currency                                          = useSelector((state) => state.currency.currency);

    useEffect(()=>{
        setIsLoadData(true)
        dispatch(selectLinesMillionaire(user.token,langVal,currency)).then(()=>{
            setIsLoadData(false)
        }).catch(()=>{
            setIsLoadData(false)
        })
    },[]);

    const deleteLucky = async (id) => {
        await deleteLuckyNumbers(id,user.token,langVal,currency)
    }

    const editLucky = (selectedLines,lineId,name) => {
        dispatch(showModalAction(
            <ModalForm title={'update favorite number'}>
                <UpdateFavoriteLuckyModalForm selectedLines={selectedLines} lineId={lineId} name={name}/>
            </ModalForm>
        ))
    }
    const {
        data,
        isLoading,
        error,
        reFetch
    } = useApi(()=> getLuckyNumbers(user.token,langVal,currency))
    // useEffect(()=>{
    //
    // },[data])

    if (isLoading && !data) return <div className={'modal-height-view position-relative'}><LoadData/></div>
    return (
        <div className="saved-favourites row">
            <div className="col-md-12">
                <h4 className="fw-light my-4">{t('favouritesProfile.addNumber')}</h4>
            </div>
            <div className="col-md-3 col-xs-12">
                <LuckyNumbersCard />
            </div>
            <div className="col-md-9 col-xs-12">
                <div className="box-table bx-shadow bg-white p-4 rounded-3 border-main my-4">
                    <h4>{t('favouritesProfile.savedNumber')}</h4>
                    <div className="table-view-in-profile">
                        {
                            millionLinesInfo.lucky_numbers.length > 0
                            ? 
                            <div className="over-x">
                                <table className="table text-center">
                                    <thead>
                                        <tr>
                                            <th className="fw-light">{t('favouritesProfile.name')}</th>
                                            <th className="fw-light">{t('favouritesProfile.favouriteNumber')}</th>
                                            <th className="fw-light">{t('favouritesProfile.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            millionLinesInfo.lucky_numbers.map((item) =>(
                                                <FavouriteLuckyRow editLucky={editLucky} deleteLucky={deleteLucky} key={item.id} item={item}/>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            :
                            <div className={'modal-height-view position-relative text-center d-flex align-items-center justify-content-center w-100'}>
                                <h4 className="text-danger">{t('favouritesProfile.noFound')}</h4>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}