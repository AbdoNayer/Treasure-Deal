import React, {useEffect, useState} from 'react';
import { VerificationForm } from "../../../components/Forms/VerificationForm";
import { InputOtp } from "../../../components/Inputs/InputOtp";
import { useTranslation } from "react-i18next";
import { verifyAuth, verifyAuthResend } from "../../../redux-toolkit/actions";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function VerifyCode() {

    const { t }                         = useTranslation();
    const langVal                       = useSelector((state) => state.language.language);
    const currency                      = useSelector((state) => state.currency.currency);
    const [otpCode,setOtpCode]          = useState('');
    const router                        = useRouter();
    const dispatch                      = useDispatch();

    const { userId }                    = router.query;

    const verifyCodeSubmit = () => {
        const verData = {
            user_id         : userId,
            code            : otpCode,
            device_id       : localStorage.getItem('deviceToken'),
            device_type     : 'web'
        }
        dispatch(verifyAuth(verData, router, langVal, currency));
    }

    const verifyCodeResend = () => {
        const verResendData = { user_id: userId }
        dispatch(verifyAuthResend(verResendData, router, langVal));
    }

    return (
        <div>
            <VerificationForm
                titleMessage={t('verify_number.title')}
                disclaimerMessage={t('verify_number.disclaimer_message')}
            >
                <InputOtp
                    countDownButton
                    resendButtonClick={verifyCodeResend}
                    submitOtpCode={verifyCodeSubmit}
                    setOtpCode={setOtpCode}
                    otpCode={otpCode}
                />
            </VerificationForm>
        </div>
  )
}
  