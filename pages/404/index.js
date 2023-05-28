import { useTranslation } from 'react-i18next';
import Link from "next/link";
import Image from 'next/image';

export default function ErrorPage() {
    
    const { t }          = useTranslation();
    
    return (
      <div className='min-page error-page py-5'>
          <div className='container text-center w-full py-5'>
              <div className='relative'>
                  <Image 
                    src={'/img/code-error.png'}
                    width={'220'} 
                    height={'220'}
                    alt='404'
                  />
              </div>
              <h3 className='my-5'>{ t('app.404') }</h3>
              <Link href='/' className='btn-button bgMainColor text-white my-4 d-flex justify-content-center align-items-center m-auto'>
                  { t('app.gohome') }
              </Link>
          </div>
      </div>
    )
  }
  