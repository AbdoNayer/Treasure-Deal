import { useTranslation } from 'react-i18next';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { deleteNotification } from "../../redux-toolkit/actions/axiosCalls";
import Link from "next/link";
import {notificationsReducer} from "../../redux-toolkit/reducer/notificationsReducer";
import Toastify from "toastify-js";

export default  function ItemNotification ({ item, ...props }) {
    
    const { t }                                         = useTranslation();
    const [ isloaded, setIsloaded ]                     = useState(false);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);
    const user                                          = useSelector((state) => state.user.user);
    const allNotifications                              = useSelector((state) => state.notifications.notifications);
    const dispatch = useDispatch()

    const deleteNotificationFunction = (id) => {

        setIsloaded(true);
        (async()=> await deleteNotification(langVal, currency, user.token, id))()
            .then(()=> {
                setIsloaded(false)
                dispatch(notificationsReducer(allNotifications.filter(noty => noty.id !== id)))
                Toastify({
                    text: t('app.notiRemoved'),
                    duration: 3000,
                    gravity: "top",
                    position: langVal === 'en' ? "left" : "right",
                    style: {
                        background: "#007427",
                    }
                }).showToast();
            })
            .catch((e)=> {
                setIsloaded(false)
            })

    }

    return (
        <div {...props} className='my-4 d-flex x-noty m-auto p-2 old-shadow rounded-3 w-75 position-relative'>
            <button onClick={() => deleteNotificationFunction(item.id)} className='position-absolute rounded-circle bgMainColor text-white'>
                {
                    isloaded ? 
                    <span className={'fs-5 spinner-border spinner-border-sm'}/>
                    :
                    <span className='icon-x'/>
                }
            </button>
            <Link href={'/'} className='info px-2 w-100'>
                <h6 className='fw-light m-0 mb-2 mt-1'>{ item.title }</h6>
                <h6 className='fw-light m-0 mb-2 mt-1'>{ item.body }</h6>
                <p className='fw-light m-0 text-end mainColor'>{ item.created_at }</p>
            </Link>
        </div>
    )

}