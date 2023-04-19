import { useState } from 'react';
import { VerificationForm } from "../../../components/Forms/VerificationForm";
import { InputOtp } from "../../../components/Inputs/InputOtp";
import { useTranslation } from "react-i18next";
import { verifyAuthEmail, verifyAuthEmailResend } from "../../../redux-toolkit/actions";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function verifyEmail() {
    const { t }                         = useTranslation();
    const [otpCode,setOtpCode]          = useState('');
    const dispatch                      = useDispatch();
    const router                        = useRouter();
    const langVal                       = useSelector((state) => state.language.language);
    const user                          = useSelector((state) => state.user.user);
    const currency                               = useSelector((state) => state.currency.currency);

    const verifyCodeSubmit = () => {
        const verData = { code : otpCode }
        dispatch(verifyAuthEmail(verData, router, langVal, currency, user.token));
    }

    const verifyCodeResend = () => {
        dispatch(verifyAuthEmailResend(langVal, user.token, currency));
    }

    return (
        <div>
            <VerificationForm
                titleMessage={t('verify_email.title')}
                disclaimerMessage={t('verify_email.disclaimer_message')}
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
