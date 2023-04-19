import {PrizePolicyRow} from "../PrizePolicyRow";
import {useTranslation} from "react-i18next";

export const PrizePolicyTable = ({prizes,drawType,showWinners=false,showRaffTicket=false,...props}) => {
    const { t }                             = useTranslation();
    return (
        <div className='ta-table-flow'>
            <div className='d-flex align-items-center'>
                <div className='head-flow text-center w-50'>
                    <h5 className='fw-light m-0 text-white'>{t("result.millionaire.prizeraws")}</h5>
                </div>
                <div className='head-flow text-center w-50'>
                    <h5 className='fw-light m-0 text-white'>{t("result.millionaire.numbersDraws")}</h5>
                </div>
                {showWinners && <div className='head-flow text-center w-50'>
                    <h5 className='fw-light m-0 text-white'>Total Winners</h5>
                </div>}
            </div>
            <div className='body-flow'>
                {prizes.map(prize => <PrizePolicyRow drawType={drawType} prizePolicy={prize} key={prize.id} showWinners={showWinners} showRaffTicket={showRaffTicket}/>)}
            </div>
        </div>
    )
}