import {useEffect, useState} from "react";
import {QuizCountDownTimer} from "../../QuizCountDownTimer";
import {useTranslation} from "react-i18next";
import {submitQuizAnswers} from "../../../redux-toolkit/actions/axiosCalls";
import {useSelector} from "react-redux";

export const QuizDetailsModalForm = ({quizDetails,...props}) => {
    const { t }                                             = useTranslation();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);

    const [isSubmitting,setIsSubmitting]                    = useState(false)
    const [selectedAnswers,setSelectedAnswers]              = useState([])
    const [isExpired,setIsExpired]                          = useState(false)

    const currentTime = Date.now()
    const futureTime = currentTime + ((quizDetails?.time_sec||600)*1000)

    const addAnswer = (answer_id,question_id) => {
        setSelectedAnswers(prevState => prevState.find(obj => obj.answer_id === answer_id)
            ? prevState
            : prevState.find(obj => obj.question_id === question_id)
                ? [...prevState.filter(obj=> obj.question_id !== question_id) ,{question_id,answer_id}]
                : [...prevState,{question_id,answer_id}]
        )
    }
    useEffect(()=>{
        console.log(selectedAnswers);
    },[selectedAnswers])
    const testQuestions = [
        {
            "id": 1,
            "question": "first question in english",
            "answers": [
                {
                    "id": 1,
                    "answer": "first answer"
                },
                {
                    "id": 2,
                    "answer": "first second"
                },
                {
                    "id": 3,
                    "answer": "first third"
                },
                {
                    "id": 4,
                    "answer": "first fourth"
                }
            ]
        },
        {
            "id": 2,
            "question": "second question in english",
            "answers": [
                {
                    "id": 5,
                    "answer": "first answer"
                },
                {
                    "id": 6,
                    "answer": "first second"
                },
                {
                    "id": 7,
                    "answer": "first third"
                },
                {
                    "id": 8,
                    "answer": "first fourth"
                }
            ]
        },
        {
            "id": 3,
            "question": "third question in english",
            "answers": [
                {
                    "id": 9,
                    "answer": "first answer"
                },
                {
                    "id": 10,
                    "answer": "first second"
                },
                {
                    "id": 11,
                    "answer": "first third"
                },
                {
                    "id": 12,
                    "answer": "first fourth"
                }
            ]
        },
        {
            "id": 4,
            "question": "fourth question in english",
            "answers": [
                {
                    "id": 13,
                    "answer": "first answer"
                },
                {
                    "id": 14,
                    "answer": "first second"
                },
                {
                    "id": 15,
                    "answer": "first third"
                },
                {
                    "id": 16,
                    "answer": "first fourth"
                }
            ]
        },
        {
            "id": 5,
            "question": "fifth question in english",
            "answers": [
                {
                    "id": 17,
                    "answer": "first answer"
                },
                {
                    "id": 18,
                    "answer": "first second"
                },
                {
                    "id": 19,
                    "answer": "first third"
                },
                {
                    "id": 20,
                    "answer": "first fourth"
                }
            ]
        },
    ]
    const submitAnswers = (quizId) => {
        setIsSubmitting(true);
        // console.log('test submit');
        // console.log(JSON.stringify(selectedAnswers));
        (async () => await submitQuizAnswers(user.token,langVal,currency,quizId,JSON.stringify(selectedAnswers)))()
            .then(r => {
                setIsSubmitting(false)
            })
            .catch(e => {
                setIsSubmitting(false)
            })
        // setTimeout(()=>{
        //     setIsSubmitting(false)
        // },1000)
    }

    return (
        <div className={''} {...props}>
            <div className="td-quiz-header d-flex align-items-center justify-content-between mb-4">
                <h4 className="title mainColor m-0">{quizDetails?.title || 'Quiz Title'}</h4>
                <div className="time">
                    <QuizCountDownTimer setIsExpired={setIsExpired} targetDate={isExpired ? null : futureTime} />
                </div>
            </div>
            {isExpired
                ? <h5 className={'text-center my-5'}>Try again later</h5>
                : <>

                    <div className="td-quiz-body height-mini-view-scroll px-2">
                        {/*{testQuestions.map(question =>*/}
                        {quizDetails.questions.map(question =>
                            <div className="td-quiz-block old-shadow p-2 rounded-2 my-2" key={question.id}>
                                <h5 className="question-title">{question.question}</h5>
                                <ul className="question-answers">
                                    {question.answers.map(answer =>
                                        <li
                                            className={selectedAnswers.find(obj=> obj.answer_id===answer.id) && 'bgMainColor text-white'}
                                            key={answer.id}
                                            onClick={()=>addAnswer(answer.id,question.id)}
                                        >{answer.answer}</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="td-quiz-footer">
                        <button className='btn-button bgMainColor w-auto px-3 text-white d-table m-auto my-4' onClick={()=>submitAnswers()}>
                            {isSubmitting
                                ? <span className={'fs-5 spinner-border spinner-border-sm text-white'}/>
                                : <span>{'Submit Answers'}</span>
                            }
                        </button>
                    </div>
                </>
            }
        </div>
    )
}