import React, {useEffect} from 'react';
import {useApi} from "../../hooks/useApi";
import {getBundleDetails} from "../../redux-toolkit/actions/axiosCalls";
import {useSelector} from "react-redux";
import {LoadData} from "../../components";
import {BuyVoucher} from "../../components/BuyVoucher";
import {useTranslation} from "react-i18next";
import { useRouter } from "next/router";

export default  function BrideGroomVoucher ({...props}) {
    const router                                            = useRouter();
    const user                                          = useSelector((state) => state.user.user);
    const currency                               = useSelector((state) => state.currency.currency);
    const langVal                                       = useSelector((state) => state.language.language);
    const { t }                                         = useTranslation();

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    const {
        data:brideGroomData,
        isLoading:isBrideGroomLoading,
    } = useApi(()=> getBundleDetails(user.token,langVal,currency,'bride_groom'), user !== null)

    if (isBrideGroomLoading) return <LoadData/>

    if(user === null) return null;

    return (
        <div>
            <BuyVoucher
                title={t('millionaire.voucher.title')}
                description={brideGroomData.description}
                subTitle={t('millionaire.voucher.subTitle')}
                brief={brideGroomData.brief}
                voucherImage={'/img/card.png'}
                maxBundles={brideGroomData.max_bundles}
                pricePerBundle={brideGroomData.price_per_bundle}
                voucherTerms={brideGroomData.terms}
                voucherDate={brideGroomData.date}
                onNextRouter={'/bride-&-groom-voucher/bride-&-groom'}
            />

        </div>
    )
}