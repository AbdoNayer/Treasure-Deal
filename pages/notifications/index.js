import React, { useState, useEffect } from 'react';
import { LoadData, EmptyData, ItemNotification } from "../../components";
import { useApi } from "../../hooks/useApi";
import { useTranslation } from 'react-i18next';
import {
    deleteAllNotifications,
    deleteNotification,
    getAllDeleteNotification
} from "../../redux-toolkit/actions/axiosCalls";
import { getAllNotifications } from '../../redux-toolkit/actions';
import { useDispatch, useSelector } from "react-redux";
import {notificationsReducer} from "../../redux-toolkit/reducer/notificationsReducer";
import Toastify from "toastify-js";

export default function Notifications() {
    
    const { t }                                         = useTranslation();
    const [ type, setType ]                             = useState('');
    const [ isloaded, setIsloaded ]                     = useState(true);
    const dispatch                                      = useDispatch();
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);
    const allNotifications                              = useSelector((state) => state.notifications.notifications);
    const user                                          = useSelector((state) => state.user.user);

    const fetchData = () => {
        dispatch(getAllNotifications(langVal, currency, user.token, type)).then(() => setIsloaded(false)).catch(() => setIsloaded(false))
    }

    useEffect(() => { fetchData(); }, []);

    const chickNoty = (name) => {
        
        setIsloaded(true);
        setType(name);
        dispatch(getAllNotifications(langVal, currency, user.token, name)).then(() => setIsloaded(false)).catch(() => setIsloaded(false))

    }

    const deleteAllNotification = () => {
        (async()=> await deleteAllNotifications(langVal, currency, user.token))()
            .then(()=> {
                setIsloaded(false)
                dispatch(notificationsReducer([]))
                Toastify({
                    text: 'All Notifications Cleared',
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
      <div className='notifications'>

            <div className="container">

                <h3 className='my-5 text-center'>{ t('app.notifications') }</h3>

                {/* <div className="d-flex justify-content-center align-items-center my-4">

                    <button onClick={() => chickNoty('seen')} className={type === 'seen' ? 'btn-button mx-2 bgMainColor text-white' : 'btn-button mx-2 border-main mainColor bg-transparent'}>
                        Seen
                    </button>

                    <button onClick={() => chickNoty('not_seen')} className={type === 'not_seen' ? 'btn-button mx-2 bgMainColor text-white' : 'btn-button mx-2 border-main mainColor bg-transparent'}>
                        Not Seen
                    </button>

                </div> */}

                <div className="height-view d-flex justify-content-center align-items-center position-relative">
                { isloaded ? <LoadData/> : null }
                {
                    allNotifications.length > 0 ?
                    <div className='py-5 mb-5 w-100 position-relative'>
                        <button onClick={deleteAllNotification} className="mainColor text-decoration-underline w-75 m-auto bg-transparent d-table text-start px-3 mb-4">Remove All Notifications</button>
                        <div className='height-view-scroll position-relative'>
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
  