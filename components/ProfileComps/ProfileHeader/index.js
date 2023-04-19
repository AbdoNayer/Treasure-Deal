import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";
import {useTranslation} from "react-i18next";
import {setInputStateAction, showModalAction} from "../../../redux-toolkit/actions";
import {ModalForm} from "../../ModalForms/ModalForm";
import {ChangeNumberModalForm} from "../../ModalForms/ChangeNumberModalForm";
import {ChangeEmailModalForm} from "../../ModalForms/ChangeEmailModalForm";
import {ChangePasswordModalForm} from "../../ModalForms/ChangePasswordModalForm";
import {LoadingPage} from "../../index";
import Image from 'next/image';


export const ProfileHeader = () => {
    const user = useSelector((state) => state.user.user);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const changePhoneNumber = () => {
        dispatch(setInputStateAction('input-start'))
        dispatch(showModalAction(
            <ModalForm title={t('user.changeNumber')}>
                <ChangeNumberModalForm />
            </ModalForm>
        ))
    }
    const changeEmailAddress = () => {
        dispatch(setInputStateAction('input-start'))
        dispatch(showModalAction(
            <ModalForm title={t('user.changeEmail')}>
                <ChangeEmailModalForm />
            </ModalForm>
        ))
    }
    const changePassword = () => {
        dispatch(setInputStateAction('input-start'))
        dispatch(showModalAction(
            <ModalForm title={t('user.changePassword')}>
                <ChangePasswordModalForm />
            </ModalForm>
        ))
    }

    if(!user){
      return(
        <LoadingPage />
      )
    }

  return (
      <div className='td_profile_header_wrapper position-relative p-4 mb-4 rounded-3 old-shadow d-flex'>
        <Link href={'/my-account/profile-edit'} className='td_edit_icon'>
            <span className={'icon-edit-3'}/>
        </Link>
        <div className='td_profile_image_wrapper'>
            <Image style={{ objectFit:"contain" }} width={90} height={90} src={user.profile_pic} alt="profile picture"/>
        </div>
        <div className='td_profile_info_wrapper'>
          <div className='td_profile_info_header'>
              <h3 className='fw-normal'>{user.full_name}</h3>
              <h5 className='fw-light mainColor'>{t("user.profile.header.TD")} {user.id}</h5>
              <h5 className='fw-light'>{user.nationality_name}</h5>
          </div>
          <div className='td_profile_info_footer mt-2'>
            <div className="my-3">
              <h5 className='fw-normal mainColor'>{t("user.profile.header.phone")}</h5>
              <div className="d-flex align-items-center in-click">
                <h6 className='fw-light m-0'>{`+${user.country_code} ${user.phone}`}</h6>
                <button className="bgMainColor edit-pin" onClick={changePhoneNumber}>
                    <i className="icon-edit-2 text-white"></i>
                </button>
              </div>
            </div>
            <div className="my-3">
                <h5 className='fw-normal mainColor'>{t("user.profile.header.email")}</h5>
                <div className="d-flex align-items-center in-click">
                  <h6 className='fw-light m-0' onClick={changeEmailAddress}>{user.email}</h6>
                  <button className="bgMainColor edit-pin" onClick={changeEmailAddress}>
                      <i className="icon-edit-2 text-white"></i>
                  </button>
                </div>
            </div>
            <div className="my-3">
              <h5 className='fw-normal mainColor'>{t("user.changePassword")}</h5>
              <div className="d-flex align-items-center in-click">
                  <h6 className='fw-light mb-0 mt-2' onClick={changePassword}>*************</h6>
                  <button className="bgMainColor edit-pin" onClick={changePassword}>
                      <i className="icon-edit-2 text-white"></i>
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}