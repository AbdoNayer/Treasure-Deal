import React from 'react';
import Link from "next/link";
import { useTranslation } from 'react-i18next';

export default function Footer() {
  
  const { t }                         = useTranslation();

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
                            <Link href={'/'}>
                                {t('footer.myAccount')}
                            </Link>
                            <Link href={'/'}>
                                {t('footer.cart')}
                            </Link>
                            <Link href={'/'}>
                                {t('app.aboutUs')}
                            </Link>
                            <Link href={'/'}>
                                {t('header.winners')}
                            </Link>
                            <Link href={'/help-center'}>
                                {t('footer.helpCenter')}
                            </Link>
                        </ul>
                    </div>
                </div>
                <div className='col-md-3 col-xs-12'>
                    <div className='head-box'>
                        <h2>{t("footer.information")}</h2>
                        <ul className='d-flex flex-column link-footer'>
                            <Link href={'/'}>
                                Millionaire Vouchers
                            </Link>
                            <Link href={'/'}>
                                Raffleillionaire Vouchers
                            </Link>
                            <Link href={'/'}>
                                Luxury Villas Vouchers
                            </Link>
                            <Link href={'/'}>
                                Luxury Cars Vouchers
                            </Link>
                            <Link href={'/'}>
                                Luxury Watches Vouchers
                            </Link>
                            <Link href={'/'}>
                                Bride & Groom Vouchers
                            </Link>
                        </ul>
                    </div>
                </div>
                <div className='col-md-3 col-xs-12'>
                    <div className='head-box'>
                        <h2>{t("footer.followUs")}</h2>
                        <p>{t("footer.text2")}</p>
                        <ul className='social  d-flex align-items-center'>
                            <Link href={'/'} className="mx-1">
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
                            </Link>
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