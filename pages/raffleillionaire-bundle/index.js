import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router';
import {buyRaffillionaire} from '../../redux-toolkit/actions';
import { VoucherCard } from "../../components/VoucherCard";
import { LoadData } from "../../components";
import {getRaffillionaire} from "../../redux-toolkit/actions/raffillionaireActions";
import Image from 'next/image';
import {useApi} from "../../hooks/useApi";
import {getBundleDetails} from "../../redux-toolkit/actions/axiosCalls";
import {BuyVoucher} from "../../components/BuyVoucher";


export default  function RaffleillionaireBundle () {

    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);
    const langVal                                       = useSelector((state) => state.language.language);
    const { t }                                         = useTranslation();
    const router                                            = useRouter();

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    const {
        data:raffData,
        isLoading:isRaffLoading,
    } = useApi(()=> getBundleDetails(user.token,langVal,currency,'raffleillionaire'), user !== null)

    if (isRaffLoading) return <LoadData/>

    if(user === null) return null;

    return (
        <BuyVoucher
            title={t('millionaire.voucher.title')}
            description={raffData.description}
            subTitle={t('millionaire.voucher.subTitle')}
            brief={raffData.brief}
            voucherImage={'/img/card.png'}
            maxBundles={raffData.max_bundles}
            pricePerBundle={raffData.price_per_bundle}
            voucherTerms={raffData.terms}
            voucherDate={raffData.date}
            onNextRouter={'/raffleillionaire-bundle/raffleillionaire'}
        />
    )
}