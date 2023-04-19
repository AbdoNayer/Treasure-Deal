import React, {useEffect, useState} from 'react';
import Link from "next/link";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import {addAllCurrencies, chooseLang, logOut} from '../../redux-toolkit/actions';
import app from "../../app.json";
import { useRouter } from 'next/router';
import Toastify from 'toastify-js';
import Image from 'next/image';
import { chooseCurrency } from "../../redux-toolkit/actions/currencyActions";
import { useApi } from "../../hooks/useApi";
import { getCurrencies, getCountNotification } from "../../redux-toolkit/actions/axiosCalls";

export default function Header() {

    const router                                        = useRouter();
    const langVal                                       = useSelector((state) => state.language.language);
    const allNotifications                              = useSelector((state) => state.notifications.notifications);
    const user                                          = useSelector((state) => state.user.user);
    const cartInfo                                      = useSelector((state) => state.cart.cartState);
    const { t, i18n }                                   = useTranslation();
    const { currency, currencies }                      = useSelector((state) => state.currency);
    const [ fadeIn, setFadeIn ]                         = useState(false);
    const [ isLoading,setIsLoading ]                    = useState(false);
    const dispatch                                      = useDispatch();

    const {
        data: currenciesData,
        isLoading: isCurrenciesLoading,
        reFetch: refetchCurrencies
    } = useApi(()=> getCurrencies(langVal,currency))

    const { data: countNoty, reFetch: refetchNoty } = useApi(()=> getCountNotification(langVal, currency, user.token),false)

    useEffect(()=>{if (user){if(user.id){refetchNoty(()=> getCountNotification(langVal, currency, user.token))}} },[user])
    
    useEffect(()=>{
        if (currenciesData){
            dispatch(addAllCurrencies(currenciesData.currencies))
        }
    },[currenciesData])
    
    const change = (lang) => {
        dispatch(chooseLang(lang, i18n));
    }

    const changeCurrency = (curr) => dispatch(chooseCurrency(curr))

    const fadeMenu = () => {
        if(window.innerWidth < 1000){
            setFadeIn(!fadeIn);
        }
    }

    const LogOut = () => {
        return () => {
            setIsLoading(true);
            if(fadeIn){
                setFadeIn(!fadeIn);
            }
            const data = {
                token           : user.token,
                device_id       : 'iuhasdhaius7218761',
            }
            dispatch(logOut(data, router, langVal, currency)).then(() => {
                setIsLoading(false);
            }).catch((err) => {
                setIsLoading(false);
            });
        }
    }

    const chickLink = (link) => {
        if (user) {
            router.push(link)
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
    <div className=''>
        {
            user && !user.email_verified ?
                <div className='bgGrayColor d-flex justify-content-end align-items-center p-3'>
                    <div className="container d-flex justify-content-end align-items-center">
                        <h6 className='m-0 mx-2 fw-light'>{t("auth.activateEmail")}</h6>
                        <Link href={'/auth/verify-email'} className='mainColor m-0 text-decoration-underline fw-light'>{t("auth.activateNow")}</Link>
                    </div>
                </div>
                :
                null
        }

        <header className='py-3 position-sticky top-0 bg-white bx-shadow' style={{ zIndex: 999 }}>
            <div className={fadeIn ? 'overlay back' : 'overlay'} onClick={() => fadeMenu()}></div>
            <div className='container'>
                <div className='pa-header d-flex align-items-center'>
                    <div className='logo'>
                        <Link href={'/'} className='position-relative'>
                            <Image style={{ objectFit:"contain" }} width={150} height={62} src="/img/logo.png" alt="logo" />
                        </Link>
                        <button className="click-nav" onClick={() => fadeMenu()}>
                           <div className={fadeIn ? 'handle closed bg-white' : 'handle'}></div>
                           <div className={fadeIn ? 'handle closed bg-white' : 'handle'}></div>
                           <div className={fadeIn ? 'handle closed bg-white' : 'handle'}></div>
                        </button>
                    </div>
                    <div className={fadeIn ? 'list-head back' : 'list-head d-flex justify-content-between align-items-center flex-fill'}>
                        <div className='user-view-side d-none'>
                            <div className='img-user-pik'>
                                <Image style={{ objectFit:"contain" }} width={100} height={100} src={user ? user.profile_pic : '/img/gust.jpeg'} alt='user' />
                            </div>
                            <h3 className='mainColor'>{ user ? user.first_name : 'Gust' }</h3>
                        </div>
                        <div className='d-flex align-items-center px-4'>
                            <div className="dropdown mx-2">
                                <button className="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    {t('header.buyNow')}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <div className='main-drop'>
                                        {
                                            app.categoryListHeader.map((item, i) => (
                                                <button key={i} onClick={() => chickLink(item.link)}>
                                                    {t(item.name)}
                                                </button>
                                            ))
                                        }
                                    </div>
                                </ul>
                            </div>
                            <div className="dropdown mx-2">
                                <button className="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    {t('header.results')}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <div className='main-drop'>
                                        {
                                            app.categoryListHeader.map((item, i) => (
                                                <button key={i} onClick={() => chickLink(item.resultLink)}>
                                                    {t(item.name)}
                                                </button>
                                            ))
                                        }
                                    </div>
                                    <Link href={'/'} className={'text-white mt-3 last-li'} onClick={() => fadeMenu()}>
                                        {t('app.voucherResults')}
                                    </Link>
                                </ul>
                            </div>
                            <Link href={'/booking'} className="mx-2 text-dark" onClick={() => fadeMenu()}>
                                {t('app.redeem')}
                            </Link>
                            <Link href={'/winners'} className="mx-2 text-dark" onClick={() => fadeMenu()}>
                                {t('header.winners')}
                            </Link>
                        </div>
                        <div className='d-flex align-items-center'>
                            <div className="dropdown mx-2 drop-currency">
                                <button className="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    <Image width={20} height={20} alt='flag' src={`/flag-icon/${langVal === "en" ? 'gb' : "eg"}.png`} />
                                    <span className='mx-1'>{langVal === "en" ? 'EN' : "AR"}</span>
                                </button>
                                <ul className="drop-lang dropdown-menu p-0" aria-labelledby="dropdownMenuButton1">
                                    {
                                        app.language.map((item, i) => (
                                            <button key={i} onClick={() => change(item.val)} className="px-3 py-1 d-flex align-items-center">
                                                <Image width={20} height={20} alt='flag' src={`/flag-icon/${item.flag}.png`} />
                                                <span className='mx-2'>{item.name}</span>
                                            </button>
                                        ))
                                    }
                                </ul>
                            </div>
                            <div className="dropdown mx-2 drop-currency">
                                <button className="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    <Image width={20} height={20} alt='flag' src={`/flag-icon/${app.currency.find(cur=> cur.val === currency)?.flag || app.currency[0].flag}.png`} />
                                    <span className='mx-1'>{currencies.find(curr=> curr.code === currency)?.code || currencies[0].code}</span>
                                </button>
                                <ul className="drop-lang dropdown-menu p-0" aria-labelledby="dropdownMenuButton1">
                                    {
                                        app.currency.map((item, i) => (
                                            <button key={i} className="px-3 py-1 d-flex align-items-center" onClick={()=>changeCurrency(item.val)}>
                                                <Image width={20} height={20} alt='flag' src={`/flag-icon/${item.flag}.png`} />
                                                <span className='mx-2'>{item.val}</span>
                                            </button>
                                        ))
                                    }
                                    {
                                        currenciesData?.currencies.map((item, i) => (
                                            <button key={i} className="px-3 py-1 d-flex align-items-center" onClick={()=>changeCurrency(item.code)}>
                                                <Image width={20} height={20} alt='flag' src={`/flag-icon/${app.currency.find(curr=> curr.val===item.code)?.flag||''}.png`} />
                                                <span className='mx-2'>{item.code}</span>
                                            </button>
                                        ))
                                    }
                                </ul>
                            </div>
                                {
                                    user ?
                                    <div className='d-flex align-items-center'>
                                        <div className="dropdown mx-2 drop-currency">
                                            <button className="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <span className='icon-user fs-5'></span>
                                                    <span className='mx-1'>{ user.first_name }</span>
                                                </button>
                                                <ul className="d-flex align-items-center flex-column justify-content-center dropdown-menu p-0" aria-labelledby="dropdownMenuButton1">
                                                    <Link href={'/my-account'} className='my-2 fw-light text-dark text-center'>{ t('footer.myAccount') }</Link>
                                                    {
                                                        isLoading ?
                                                        <span className="spinner-border spinner-border-sm my-2" role="status" aria-hidden="true"></span>
                                                        :
                                                        <button onClick={isLoading ? null : LogOut() } className='my-2 fw-light text-dark bg-transparent'>
                                                            { t('user.logOut') }
                                                        </button>
                                                    }
                                                </ul>
                                        </div>
                                        <div className="dropdown mx-2 drop-currency drop-noty">
                                                <button className="dropdown-toggle count-num noty text-dark none-mobile" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <span className='icon-bell fs-5'></span>
                                                    {countNoty && countNoty.count !== 0 ? <strong>{countNoty.count}</strong> : null}
                                                </button>
                                                <ul className="d-flex align-items-center flex-column justify-content-center dropdown-menu p-0" aria-labelledby="dropdownMenuButton1">
                                                        {
                                                            allNotifications.slice(0, 3).map((item, i) => (
                                                                <Link key={i} href={'/'} className='border-main-def w-100 p-2 d-block'>
                                                                    <div className='info'>
                                                                        <h6 className='fw-light m-0 mt-1'>{item.title}</h6>
                                                                        <h6 className='fw-light m-0 mt-1'>{item.body}</h6>
                                                                        <p className='fw-light m-0 text-end mainColor'>{ item.created_at }</p>
                                                                    </div>
                                                                </Link>
                                                            ))
                                                        }
                                                    <Link href={'/notifications'} className='my-2 fs-6 text-decoration-underline w-100 px-2 text-center'>
                                                        {t('app.seeAllNoty')}
                                                    </Link>
                                                </ul>
                                        </div>
                                        <Link href={'/shopping-cart'} className="mx-2 count-num text-dark none-mobile" onClick={() => fadeMenu()}>
                                            <span className='icon-shopping-cart fs-5'/>
                                            {cartInfo && cartInfo.total_qty > 0 && <strong>{cartInfo.total_qty}</strong>}
                                        </Link>
                                    </div>
                                    :
                                    <div className='d-flex align-items-center'>
                                        <Link href={'/auth/login'} className="mx-2 text-dark" onClick={() => fadeMenu()}>
                                            <span className='icon-user'></span>
                                            <span className='mx-2'>{t('auth.signIn')}</span>
                                        </Link>
                                        <Link href={'/auth/register'} className="mx-2 text-dark" onClick={() => fadeMenu()}>
                                            <span className='icon-user-plus'></span>
                                            <span className='mx-2'>{t('auth.signUp')}</span>
                                        </Link>
                                    </div>
                                }
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </div>
  )
}