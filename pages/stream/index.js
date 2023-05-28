import { useTranslation } from 'react-i18next';
import {CountdownTimer} from "../../components/CountdownTimer";
import { useSelector } from "react-redux";
import {useRouter} from "next/router";

export default function Stream() {
    
    const { t }          = useTranslation();
    const millionLinesInfo                                  = useSelector((state) => state.linesMillionair.millionLines);
    const router = useRouter()

    return (
      <div className='stream py-5'>
          <div className='container'>

                <div className='row'>

                    <div className='col-md-7 col-xs-12'>
                        <div className='my-4'>
                          <iframe src="http://www.youtube.com/embed/JW5meKfy3fY?autoplay=1"></iframe>
                        </div>
                    </div>

                    <div className='col-md-5 col-xs-12'>
                      
                            <div className='my-4'>
                                
                                <div className='bg-voukum d-flex align-items-center justify-content-between f-c'>
                                    <div className="d-flex flex-column align-items-center">
                                        <h5 className='text-white'>{t('category.millionaire')}</h5>
                                        <button className='btn-button bg-white' onClick={()=>router.push('/the-millionaire-voucher/millionaire-lotto')}>
                                            {t('millionaire.lotto.buttons.addBundle')}
                                        </button>
                                    </div>
                                    <div className="align-self-end">
                                        <CountdownTimer date={millionLinesInfo.prize_date}/>
                                    </div>
                                </div>

                                <div className='bg-voukum d-flex align-items-center justify-content-between f-c'>
                                    <div className="d-flex flex-column text-center align-items-center">
                                        <h5 className='text-white'>{t('category.raffleillionaire')}</h5>
                                        <button className='btn-button bg-white'  onClick={()=>router.push('/raffleillionaire-bundle/raffleillionaire')}>
                                            {t('millionaire.lotto.buttons.addBundle')}
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center align-self-end">

                                        <i className='icon-date fs-4 text-white mx-2'></i>
                                        <p className='text-white'>
                                            Estimate Date 15-02-2023
                                            <br/>
                                            When campaign sold out
                                        </p>

                                    </div>
                                </div>

                                <div className='bg-voukum d-flex align-items-center justify-content-between f-c'>
                                    <div className="d-flex flex-column text-center align-items-center">
                                        <h5 className='text-white'>{t('category.cars')}</h5>
                                        <button className='btn-button bg-white' onClick={()=>router.push('/luxury-cars-voucher/luxury-cars')}>
                                            {t('millionaire.lotto.buttons.addBundle')}
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center align-self-end">

                                        <i className='icon-date fs-4 text-white mx-2'></i>
                                        <p className='text-white'>
                                            Estimate Date 15-02-2023
                                            <br/>
                                            When campaign sold out
                                        </p>

                                    </div>
                                </div>

                                <div className='bg-voukum d-flex align-items-center justify-content-between f-c'>
                                    <div className="d-flex flex-column text-center align-items-center">
                                        <h5 className='text-white'>{t('category.villas')}</h5>
                                        <button className='btn-button bg-white' onClick={()=>router.push('/luxury-villas-voucher/luxury-villas')}>
                                            {t('millionaire.lotto.buttons.addBundle')}
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center align-self-end">

                                        <i className='icon-date fs-4 text-white mx-2'></i>
                                        <p className='text-white'>
                                            Estimate Date 15-02-2023
                                            <br/>
                                            When campaign sold out
                                        </p>

                                    </div>
                                </div>

                                <div className='bg-voukum d-flex align-items-center justify-content-between f-c'>
                                    <div className="d-flex flex-column text-center align-items-center">
                                        <h5 className='text-white'>{t('category.watches')}</h5>
                                        <button className='btn-button bg-white' onClick={()=>router.push('/luxury-watches-voucher/luxury-watches')}>
                                            {t('millionaire.lotto.buttons.addBundle')}
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center align-self-end">

                                        <i className='icon-date fs-4 text-white mx-2'></i>
                                        <p className='text-white'>
                                            Estimate Date 15-02-2023
                                            <br/>
                                            When campaign sold out
                                        </p>

                                    </div>
                                </div>

                                <div className='bg-voukum d-flex align-items-center justify-content-between f-c'>
                                    <div className="d-flex flex-column text-center align-items-center">
                                        <h5 className='text-white'>{t('category.bride')}</h5>
                                        <button className='btn-button bg-white' onClick={()=>router.push('/bride-&-groom-voucher/bride-&-groom')}>
                                            {t('millionaire.lotto.buttons.addBundle')}
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center align-self-end">

                                        <i className='icon-date fs-4 text-white mx-2'></i>
                                        <p className='text-white'>
                                            Estimate Date 15-02-2023
                                            <br/>
                                            When campaign sold out
                                        </p>

                                    </div>
                                </div>

                            </div>

                    </div>

                </div>
                
          </div>
      </div>
    )

}
  