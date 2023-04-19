import {useDispatch, useSelector} from "react-redux";
import {showModalAction} from "../../redux-toolkit/actions";
import {ModalForm} from "../ModalForms/ModalForm";
import {useTranslation} from "react-i18next";
import Image from 'next/image';

export const VoucherCard = ({image, price, date, terms, textModal}) => {
    const { t }                         = useTranslation();
    const currency         = useSelector((state) => state.currency.currency);
    const dispatch = useDispatch();
    const showTermsModal = () =>{
        dispatch(showModalAction(
            <ModalForm title={t('millionaire.voucher.cardTermsMini')}>
                <p className="mb-5 text-center">{textModal}</p>
            </ModalForm>
        ))
    }
  return (
      <div className='td-voucher-card'>
        <Image style={{ width: '100%', height: '100%' }} width={700} height={700} src={image} alt="voucher card" />
        {price && <div className="td-voucher-card-price">
            {price?.split('.')[0] || price}
            <span className={'td_currency'}>{currency}</span>
            <span className={'td_price_factor'}>.{price.split('.')[1]}</span></div>
        }
        <div className="td-voucher-card-date">{date}</div>
        <div className="td-voucher-card-terms" onClick={showTermsModal}>{terms}</div>
      </div>
  )
}