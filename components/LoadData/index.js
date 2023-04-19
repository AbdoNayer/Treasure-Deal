import { useTranslation } from 'react-i18next';

export default  function LoadData () {
    
    const { t }              = useTranslation();

    return (
        <div className='load-data w-100 h-100 d-flex flex-column align-items-center justify-content-center'> 
            <div className="spinner-border mainColor" role="status">
                <span className="visually-hidden"/>
            </div>
            <h4 className='m-0 my-4'>{t('app.loadingData')}</h4> 
        </div>
    )

}