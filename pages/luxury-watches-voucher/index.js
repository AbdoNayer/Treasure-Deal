import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useApi} from "../../hooks/useApi";
import {getBundleDetails} from "../../redux-toolkit/actions/axiosCalls";
import {LoadData} from "../../components";
import {BuyVoucher} from "../../components/BuyVoucher";

export default  function LuxuryWatchesVoucher ({...props}) {
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);
    const langVal                                       = useSelector((state) => state.language.language);
    const { t }                                         = useTranslation();

    const {
        data:luxuryWatchesData,
        isLoading:isLuxuryWatchesLoading,
    } = useApi(()=> getBundleDetails(user.token,langVal,currency,'luxury_watches'))

    if (isLuxuryWatchesLoading) return <LoadData/>
    return (
        <div>
            <BuyVoucher
                title={t('millionaire.voucher.title')}
                description={luxuryWatchesData.description}
                subTitle={t('millionaire.voucher.subTitle')}
                brief={luxuryWatchesData.brief}
                voucherImage={'/img/card.png'}
                maxBundles={luxuryWatchesData.max_bundles}
                pricePerBundle={luxuryWatchesData.price_per_bundle}
                voucherTerms={luxuryWatchesData.terms}
                voucherDate={luxuryWatchesData.date}
                onNextRouter={'/luxury-watches-voucher/luxury-watches'}
            />

        </div>
    )
}