import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
    const { t }          = useTranslation();

    return (
        <div className='stream py-5'>
            <div className='container'>
                Privacy Policy
            </div>
        </div>
    )

}
