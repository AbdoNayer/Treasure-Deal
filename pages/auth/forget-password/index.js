import React from 'react';
import { useTranslation } from "react-i18next";
import { VerificationForm } from "../../../components/Forms/VerificationForm";
import { ForgetPasswordForm } from "../../../components/Forms/ForgetPasswordForm";

export default function ForgetPassword() {

    const { t }                         = useTranslation();

    return (
        <VerificationForm disclaimerMessage={t('forget_password.disclaimer_message')}>
            <ForgetPasswordForm/>
        </VerificationForm>
  )
  
}
  