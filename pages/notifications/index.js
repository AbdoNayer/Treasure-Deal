import React, { useState } from 'react';
import { LoadData, EmptyData, ItemNotification } from "../../components";
import { useTranslation } from 'react-i18next';
import { deleteAllNotifications } from "../../redux-toolkit/actions/axiosCalls";
import { useDispatch, useSelector } from "react-redux";
import {notificationsReducer} from "../../redux-toolkit/reducer/notificationsReducer";
import Toastify from "toastify-js";

export default function Notifications() {
    
    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch();
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);
    const allNotifications                              = useSelector((state) => state.notifications.notifications);
    const user                                          = useSelector((state) => state.user.user);
    const [isLoaded,setIsLoaded]                        = useState(false)

    const deleteAllNotification = () => {
        setIsLoaded(true);
        (async()=> await deleteAllNotifications(langVal, currency, user.token))()
            .then(()=> {
                setIsLoaded(false)
                dispatch(notificationsReducer([]))
                Toastify({
                    text: t('app.allNotiCleared'),
                    duration: 3000,
                    gravity: "top",
                    position: langVal === 'en' ? "left" : "right",
                    style: {
                        background: "#007427",
                    }
                }).showToast();
            }).catch((e)=> { setIsLoaded(false) })
    }
    
    return (
      <div className='notifications'>

            <div className="container">

                <h3 className='my-5 text-center'>{ t('app.notifications') }</h3>

                <div className="height-view d-flex justify-content-center align-items-center position-relative">
                {
                    allNotifications.length > 0 ?
                    <div className='py-5 mb-5 w-100 position-relative'>
                        <button onClick={deleteAllNotification} className="mainColor text-decoration-underline w-75 m-auto bg-transparent d-table text-start px-3 mb-4">Remove All Notifications</button>
                        <div className='position-relative'>
                        {
                            allNotifications.map((item)=> (
                                <ItemNotification item={item} key={item.id} />
                            ))
                        }
                        </div>
                    </div>  
                    :
                    <EmptyData data={{text : 'app.notFound'}} />
                }
                </div>


            </div>

      </div>
    )
  }
  