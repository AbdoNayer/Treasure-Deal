import app from "../../../app.json";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import Image from "next/image";
import {showModalAction} from "../../../redux-toolkit/actions";
import {ModalForm} from "../../ModalForms/ModalForm";
import {useDispatch, useSelector} from "react-redux";
import {getAllQuizzes, startQuizApi} from "../../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../../hooks/useApi";
import {LoadData} from "../../index";
import {useTranslation} from "react-i18next";
import {useEffect, useRef, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "../../Pagination";
import {QuizDetailsModalForm} from "../../ModalForms/QuizDetailsModalForm";
import Toastify from "toastify-js";

export const MerchantQuizzes = ({...props}) => {
    const dispatch                                          = useDispatch();
    const { t }                                             = useTranslation();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const [currentPage,setCurrentPage]                      = useState(1)
    const didMount                                          = useRef(false);
    const [startingQuiz,setStartingQuiz]                    = useState(false)

    const {
        data:quizzesData,
        isLoading:isQuizzesDataLoading,
        reFetch:refetchQuizzesData
    } = useApi(()=> getAllQuizzes(user.token,langVal,currency,currentPage))
    useEffect(()=>{
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        refetchQuizzesData()
    },[currentPage])

    //{
    //     "merchant": {
    //         "id": 1,
    //         "type": "booking",
    //         "business_name": "H&M",
    //         "category": "Restaurant",
    //         "category_slug": "restaurant",
    //         "logo": "https://team-connect.treasuredeal.com/defaults/default.png",
    //         "cover": "https://team-connect.treasuredeal.com/defaults/default.png",
    //         "lat": "30.04",
    //         "lng": "31.24",
    //         "map_desc": "dubai second",
    //         "brief": "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which",
    //         "description": "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which"
    //     },
    //     "id": 1,
    //     "title": "quiz title in english",
    //     "description": "quiz description in english",
    //     "time_sec": 600,
    //     "expiry_date": "2023-05-15",
    //     "questions": [
    //         {
    //             "id": 1,
    //             "question": "first question in english",
    //             "answers": [
    //                 {
    //                     "id": 1,
    //                     "answer": "first answer"
    //                 },
    //                 {
    //                     "id": 2,
    //                     "answer": "first second"
    //                 },
    //                 {
    //                     "id": 3,
    //                     "answer": "first third"
    //                 },
    //                 {
    //                     "id": 4,
    //                     "answer": "first fourth"
    //                 }
    //             ]
    //         }
    //     ]
    // }

    const startQuiz = (quizId) => {
        setStartingQuiz(true);
        (async () => await startQuizApi(user.token,langVal,currency,quizId))()
            .then(r => {
                setStartingQuiz(false)
                dispatch(showModalAction(
                    <ModalForm title={'Quiz'}>
                        <QuizDetailsModalForm quizDetails={r}/>
                    </ModalForm>
                ))
            })
            .catch(e => {
                setStartingQuiz(false)
                Toastify({
                    text: e.response.data.msg,
                    duration: 3000,
                    gravity: "top",
                    position: langVal === 'en' ? "left" : "right",
                    style: {
                        background: "#F00",
                    }
                }).showToast();

            })

    }

    if (isQuizzesDataLoading) return <div className={'modal-height-view position-relative'}><LoadData/></div>
    return (
        <div className={''} {...props}>
            {quizzesData && quizzesData.quizzes.length > 0
                ? <>
                    <div className="row">
                        <Swiper
                            grabCursor
                            slidesPerView={3.5}
                            spaceBetween={10}
                            breakpoints={{
                                360:{
                                    slidesPerView:1.2,
                                    spaceBetween:10
                                },
                                420:{
                                    slidesPerView:2.2,
                                    spaceBetween:10
                                },
                                580:{
                                    slidesPerView:3.2,
                                    spaceBetween:10
                                },
                                768:{
                                    slidesPerView:4.2,
                                    spaceBetween:10
                                },
                                1000:{
                                    slidesPerView:5.2,
                                    spaceBetween:10
                                },
                            }}
                            className={'td-categories-swiper justify-content-center'}
                        >
                            {quizzesData.quizzes.map((item, i) => (
                                <SwiperSlide className={''} key={item.id}>
                                    <div className='block-quizz rounded-3 old-shadow my-3 overflow-hidden position-relative'>
                                        <div className='position-relative'>
                                            <Image style={{ width: "100%" }} width={318} height={170} alt='img' src={item.merchant.cover} />
                                            <div className='info-merchant-quizz d-flex p-2 align-items-center'>
                                                <Image style={{ objectFit : "contain" }} className='rounded-3' width={30} height={30} alt='img' src={item.merchant.logo} />
                                                <div className='px-2'>
                                                    <h6 className='small-font-12 m-0'>{item.merchant.category}</h6>
                                                    <h6 className='small-font-12 m-0 mainColor'>{item.merchant.business_name}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text-center px-2 py-3'>
                                            <h6 className='m-0'>{item.title}</h6>
                                            <p className='small-font-12 fw-light'>{item.description}</p>
                                            <p className='small-font-12 fw-light'>Expirty Date: {item.expiry_date}</p>
                                            <p className='small-font-12 fw-light'>Time Limit: {item.time_sec} seconds</p>
                                            <button onClick={()=>
                                                // openModal()
                                                startQuiz(item.id)
                                            } className='bg-transparent text-decoration-underline mainColor small-font-13'>
                                                {startingQuiz
                                                    ? <span className={'fs-5 spinner-border spinner-border-sm'}/>
                                                    : <span>{'Start Quiz'}</span>
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))
                            }
                        </Swiper>
                    </div>
                    <div className="td-pagination mt-3 d-flex justify-content-center">
                        <Pagination
                            className="pagination-bar"
                            currentPage={currentPage}
                            totalCount={quizzesData.pagination.total_items}
                            pageSize={quizzesData.pagination.per_page}
                            onPageChange={page=>setCurrentPage(page)}
                        />
                    </div>
                </>
                : 
                <div className='main-body-mini d-flex justify-content-center align-items-center'>
                    <h3 className='text-danger text-center m-0'>{t('app.noQuizzes')}</h3>
                </div>
            }
        </div>
    )
}