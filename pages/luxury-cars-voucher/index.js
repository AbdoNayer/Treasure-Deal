import {useSelector} from "react-redux";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import {useApi} from "../../hooks/useApi";
import {getBundleDetails} from "../../redux-toolkit/actions/axiosCalls";
import {LoadData} from "../../components";
import {BuyVoucher} from "../../components/BuyVoucher";

export default  function LuxuryCarsVoucher ({...props}) {
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);
    const langVal                                       = useSelector((state) => state.language.language);
    const { t }                                         = useTranslation();

    const {
        data:luxuryCarsData,
        isLoading:isLuxuryCarsLoading,
    } = useApi(()=> getBundleDetails(user.token,langVal,currency,'luxury_cars'))

    if (isLuxuryCarsLoading) return <LoadData/>
    return (
        <div>
            <BuyVoucher
                title={t('millionaire.voucher.title')}
                description={luxuryCarsData.description}
                subTitle={t('millionaire.voucher.subTitle')}
                brief={luxuryCarsData.brief}
                voucherImage={'/img/card.png'}
                maxBundles={luxuryCarsData.max_bundles}
                pricePerBundle={luxuryCarsData.price_per_bundle}
                voucherTerms={luxuryCarsData.terms}
                voucherDate={luxuryCarsData.date}
                onNextRouter={'/luxury-cars-voucher/luxury-cars'}
            />

        </div>
    )
}