import { useTranslation } from 'react-i18next';
import Link from "next/link";
import Image from 'next/image';

export default function ErrorPage() {
    
    const { t }          = useTranslation();
    
    return (
      <div className='min-page error-page'>
          <div className='container text-center w-full py-5'>
              <div className='relative'>
                  <Image 
                    src={'/img/err1.png'}
                    width={'350'} 
                    height={'350'}
                    alt='404'
                  />
              </div>
              <h3 className='my-4'>{ t('app.404') }</h3>
              <Link href='/' className='btn-button bgMainColor text-white my-4 d-flex justify-content-center align-items-center m-auto'>
                  { t('app.gohome') }
              </Link>
          </div>
      </div>
    )
  }
  