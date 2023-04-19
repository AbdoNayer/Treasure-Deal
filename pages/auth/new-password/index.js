import React from 'react';
import { VerificationForm } from "../../../components/Forms/VerificationForm";
import { ResetPasswordForm } from "../../../components/Forms/ResetPasswordForm";
import { useRouter } from "next/router";

export default function NewPassword() {

  const router                        = useRouter();
  const data                          = router.query;

  return (
    <VerificationForm disclaimerMessage={null}>
            
            <ResetPasswordForm inData={data} />

      </VerificationForm>
  )

}
  