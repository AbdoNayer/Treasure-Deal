import React, { useEffect } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Toastify from 'toastify-js';
import app from "../../app.json";
import { contactUs } from "../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../hooks/useApi";

export default function Footer() {
  
    const { t }                                 = useTranslation();
    const router                                = useRouter();
    const langVal                               = useSelector((state) => state.language.language);
    const user                                  = useSelector((state) => state.user.user);

    const {
        data:contactData
    } = useApi(()=> contactUs())

    const chickLink = (link) => {
        if (user) {
            router.push(link);
        }else {
            Toastify({
                text: t('auth.loginFirst'),
                duration: 3000,
                gravity: "top",
                position: langVal === 'en' ? "left" : "right",
                style: {
                  background: "#F00",
                }
            }).showToast();
        }
    }

  return (
    <footer>
        <div className='container py-5'>
            <div className='row'>
                <div className='col-md-3 col-xs-12'>
                    <div className='head-box'>
                        <h2>{t("footer.company")}</h2>
                        <p>{t("footer.text")}</p>
                        <Link href={'/become-partner'} className="my-4 btn-button bgSecondColor w-75 fw-light d-flex align-items-center justify-content-center">{t('footer.becomePartner')}</Link>
                        <Link href={'/'} className="my-4 btn-button bgSecondColor w-75 fw-light d-flex align-items-center justify-content-center">{t('footer.becomeLogin')}</Link>
                    </div>
                </div>
                
                <div className='col-md-3 col-xs-12'>
                    <div className='head-box'>
                        <h2>{t("footer.myAccount")}</h2>
                        <ul className='d-flex flex-column link-footer'>
                            <a onClick={() => chickLink('/my-account')}>
                                {t('footer.myAccount')}
                            </a>
                            <a onClick={() => chickLink('/shopping-cart')}>
                                {t('footer.cart')}
                            </a>
                            {/* <Link href={'/about'}>
                                {t('app.aboutUs')}
                            </Link> */}
                            <a onClick={() => chickLink('/winners')}>
                                {t('header.winners')}
                            </a>
                            <a onClick={() => chickLink('/help-center')}>
                                {t('footer.helpCenter')}
                            </a>
                        </ul>
                    </div>
                </div>
                <div className='col-md-3 col-xs-12'>
                    <div className='head-box'>
                        <h2>{t("footer.information")}</h2>
                        <div className='d-flex flex-column link-footer'>
                            {
                                app.categoryListHeader.map((item, i) => (
                                    <a key={i} onClick={() => chickLink(item.link)}>
                                        {t(item.name)}
                                    </a>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className='col-md-3 col-xs-12'>
                    <div className='head-box'>
                        <h2>{t("footer.followUs")}</h2>
                        <p>{t("footer.text2")}</p>
                        <ul className='social  d-flex align-items-center'>
                            {
                                contactData && contactData.sociails.map((item) => (
                                    <Link target='_blank' key={item?.id} href={item.link ? item.link : '/'} className="mx-1">
                                        <Image src={item?.image} quality='100' alt='img' width={20} height={20} />
                                    </Link>
                                ))
                            }
                            {/* <Link href={'/'} className="mx-1">
                                <i className='icon-facebook'></i>
                            </Link>
                            <Link href={'/'} className="mx-1">
                                <i className='icon-instagram'></i>
                            </Link>
                            <Link href={'/'} className="mx-1">
                                <i className='icon-twitter'></i>
                            </Link>
                            <Link href={'/'} className="mx-1">
                                <i className='icon-youtube'></i>
                            </Link> */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div className='end-footer bgMainColor py-4'>
            <div className='container text-center'>
                <p className='m-0 mb-2 text-white'>{t("footer.copyRight")}</p>
                <div className='d-flex align-items-center justify-content-center'>
                  <Link href={'/privacy-policy'} className='m-0 mx-2 secondColor'>{t("footer.Policy")}</Link>
                  <Link href={'/terms-and-conditions'} className='m-0 mx-2 secondColor'>{t("footer.Terms")}</Link>
                </div>
            </div>
        </div>
    </footer>
  )
}