import { useTranslation } from 'react-i18next';

export default function TermsAndConditions() {
    const { t }          = useTranslation();

    return (
        <div className='stream py-5'>
            <div className='container'>
                Terms and conditions
            </div>
        </div>
    )

}
