import {useDispatch, useSelector} from "react-redux";
import {InputOtp} from "../../Inputs/InputOtp";
import {useState} from "react";
import {getProfileAuth, setInputStateAction, updateEmailCheckCode} from "../../../redux-toolkit/actions";
import {makeRedeem} from "../../../redux-toolkit/actions/axiosCalls";
import {useRouter} from "next/router";
import Barcode from "react-barcode";
import { Feedback } from "../../../components";

export const RedeemVoucherModalForm = ({voucher_id,...props}) => {
    const inputState = useSelector((state) => state.inputState.state);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const langVal = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const [redeemCode,setRedeemCode] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    const [redeemId,setRedeemId] = useState('')

    const [otpCode,setOtpCode] = useState('')
    const verifyOtp = () => {
        const verData = { pin : otpCode, voucher_id };
        (async () => await makeRedeem(verData,user.token,langVal,currency))()
            .then(r=> {
                setRedeemCode(r.redeem.redeem_num)
                setRedeemId(r.redeem.id)
                setErrorMessage('')
                dispatch(setInputStateAction('input-otp'))
            })
            .catch(e=> setErrorMessage(e.response.data.msg))

    }

    return (
        <div>
            {inputState==='input-start' && <div className={'d-flex flex-column align-items-center my-2'}>
                <div className={'mb-5 fs-5'}>Enter Merchant Pin Here</div>
                <div className={'mb-5'}>
                    <InputOtp
                        otpCode={otpCode}
                        setOtpCode={setOtpCode}
                        submitOtpCode={verifyOtp}
                        otpLength={4}
                        showLoading
                    />
                    <div className={'text-danger text-center fs-6'}>{errorMessage}</div>
                </div>
            </div>}
            {
                inputState==='input-otp' && redeemCode && 
                <div className={'text-center'}>
                    <Barcode value={redeemCode} width={5} fontSize={30} />
                    <Feedback redeemId={redeemId}/>
                </div>
            }
        </div>
    )
}