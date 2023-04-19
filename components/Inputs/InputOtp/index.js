import {InputText} from "../InputText";
import {useEffect, useRef, useState} from "react";
import { useTranslation } from "react-i18next";

export const InputOtp = ({countDownButton=false,resendButtonClick,otpLength=6,submitOtpCode,setOtpCode,otpCode,handleOtp,showLoading=false}) => {

    const { t }                         = useTranslation();

    String.prototype.replaceAt = function(index, replacement) {
        return this.substring(0, index) + replacement + this.substring(index + replacement.length);
    }

    const input1 = useRef(null)
    const input2 = useRef(null)
    const input3 = useRef(null)
    const input4 = useRef(null)
    const input5 = useRef(null)
    const input6 = useRef(null)

    const jump = (ref) =>{
        if (ref.current){
            ref.current.focus()
        }
    }
    const [inputOtpCode,setInputOtpCode] = useState('')
    //#region check otp values
    const [isLoading,setIsLoading]=useState(false);
    useEffect(()=>{
        if (otpCode){
            setInputOtpCode(otpCode)
        }
    },[otpCode])

    const checkOnChange = (e,i) => {
        if (setOtpCode) setOtpCode(prevState => prevState.replaceAt(i,e.target.value))
        else if (handleOtp) {
            setInputOtpCode(prevState => prevState.replaceAt(i, e.target.value))
        }
    }

    const checkOtp = async () => {
        setIsLoading(true);
        if (handleOtp) {
            handleOtp(inputOtpCode)
        }

        // setOtpValues(otpCode);

        if (submitOtpCode){
            submitOtpCode();
        }

        setTimeout(()=>{
            setIsLoading(false)
        },3000);
    }
    //#endregion

    //#region count down timer
    const timeRef           = useRef(null);
    const [timer, setTimer] = useState('00:00');

    const getTimeRemaining = (e) => {
        const total     = Date.parse(e) - Date.parse(new Date());
        const seconds   = Math.floor((total / 1000) % 60);
        const minutes   = Math.floor((total / 1000 / 60) % 60);
        return { total, minutes, seconds };
    }

    const startTimer = (e) => {
        let { total, minutes, seconds } = getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':' + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
    }

    const clearTimer = (e) => {
        
        setTimer('01:00');
        
        if (timeRef.current) clearInterval(timeRef.current);

        const id = setInterval(() => {
            startTimer(e);
        }, 1000);

        timeRef.current = id;

    }
    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 60);
        return deadline;
    }

    const onClickReset = () => {
        if (timer === '00:00'){
            if (resendButtonClick){
                resendButtonClick();
            }
            clearTimer(getDeadTime());
        }
    }
    //#endregion

    useEffect(() => { clearTimer(getDeadTime()) }, []);


    return (
        <>
            <div className='td_input_otp_wrapper' dir={'ltr'}>
                <div className='td_input'><InputText type={'tel'} maxLength={1} id="digit-1" name="digit-1" ref={input1} onKeyUp={()=>jump(input2)} onChange={e=>checkOnChange(e,0)}/></div>
                <div className='td_input'><InputText type={'tel'} maxLength={1} id="digit-2" name="digit-2" ref={input2} onKeyUp={()=>jump(input3)} onChange={e=>checkOnChange(e,1)}/></div>
                <div className='td_input'><InputText type={'tel'} maxLength={1} id="digit-3" name="digit-3" ref={input3} onKeyUp={()=>jump(input4)} onChange={e=>checkOnChange(e,2)}/></div>
                <div className='td_input'><InputText type={'tel'} maxLength={1} id="digit-4" name="digit-4" ref={input4} onKeyUp={() => otpLength > 4 ? jump(input5) : checkOtp()} onChange={e=>checkOnChange(e,3)}/></div>
                {otpLength>4 && <div className='td_input'><InputText type={'tel'} maxLength={1} id="digit-5" name="digit-5" ref={input5} onKeyUp={() => otpLength > 5 ? jump(input6) : checkOtp()} onChange={e => checkOnChange(e, 4)}/></div>}
                {otpLength>5 && <div className='td_input'><InputText type={'tel'} maxLength={1} id="digit-6" name="digit-6" ref={input6} onKeyUp={checkOtp} onChange={e => checkOnChange(e, 5)}/></div>}
            </div>
            {
                countDownButton &&
                <button className='btn-button bgSecondColor text-dark mt-4' onClick={onClickReset}>
                        { 
                            isLoading ? 
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            : 
                            (timer!=='00:00' ? timer : 'Resend')
                        }
                </button>
            }
            {
                showLoading && 
                <div className={'mt-4 d-flex align-content-center justify-content-center'}>
                {
                    isLoading && 
                    <div className="spinner-grow" role="status">
                        <span className="visually-hidden">{t('app.loading')}</span>
                    </div>
                }
                </div>
            }
        </>
    )
}