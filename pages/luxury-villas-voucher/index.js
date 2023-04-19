import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useApi} from "../../hooks/useApi";
import {getBundleDetails} from "../../redux-toolkit/actions/axiosCalls";
import {LoadData} from "../../components";
import {BuyVoucher} from "../../components/BuyVoucher";

export default  function LuxuryVillasVoucher ({...props}) {
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);
    const langVal                                       = useSelector((state) => state.language.language);
    const { t }                                         = useTranslation();

    const {
        data:luxuryVillaData,
        isLoading:isLuxuryVillasLoading,
    } = useApi(()=> getBundleDetails(user.token,langVal,currency,'luxury_villas'))

    if (isLuxuryVillasLoading) return <LoadData/>
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