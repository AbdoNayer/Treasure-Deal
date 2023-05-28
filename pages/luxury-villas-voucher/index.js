import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useApi} from "../../hooks/useApi";
import {getBundleDetails} from "../../redux-toolkit/actions/axiosCalls";
import {LoadData} from "../../components";
import {BuyVoucher} from "../../components/BuyVoucher";
import { useRouter } from "next/router";
import {useEffect} from "react";

export default  function LuxuryVillasVoucher ({...props}) {
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);
    const langVal                                       = useSelector((state) => state.language.language);
    const { t }                                         = useTranslation();
    const router                                            = useRouter();

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    const {
        data:luxuryVillaData,
        isLoading:isLuxuryVillasLoading,
    } = useApi(()=> getBundleDetails(user.token,langVal,currency,'luxury_villas'), user !== null)

    if (isLuxuryVillasLoading) return <LoadData/>

    if(user === null) return null;
    return (
        <div>
            <BuyVoucher
                title={t('millionaire.voucher.title')}
                description={luxuryVillaData.description}
                subTitle={t('millionaire.voucher.subTitle')}
                brief={luxuryVillaData.brief}
                voucherImage={'/img/card.png'}
                maxBundles={luxuryVillaData.max_bundles}
                pricePerBundle={luxuryVillaData.price_per_bundle}
                voucherTerms={luxuryVillaData.terms}
                voucherDate={luxuryVillaData.date}
                onNextRouter={'/luxury-villas-voucher/luxury-villas'}
            />

        </div>
    )
}