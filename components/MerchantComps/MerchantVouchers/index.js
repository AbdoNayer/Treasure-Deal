import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import Image from 'next/image';
import {useRouter} from "next/router";

export const MerchantVouchers = ({vouchers,openModal,type,updateSlug,updateVoucherId,shopType,merchantId,...props}) => {
    const { t }                                         = useTranslation();
    const router                                        = useRouter()
    const voucherSlugs = ['table','car','room','yacht','doctor','barber','sky']
    const [slug,setSlug] = useState('restaurant')
    return (
        <div>
            <div className="result-items">
                {vouchers.map(voucher =>
                    <div key={voucher.id} className="block-item-cate d-flex align-items-center p-2 row">
                        <div className="col-md-4 col-xs-12">
                            <div className="img-vocher position-relative">
                                <Image style={{ objectFit:"contain", height: "100%", width:"100%" }} width={338} height={171} alt='' src={'/img/voucher-ver.png'} className='w-100' />
                                <div className='img-des w-100 h-100 d-flex text-center flex-column'>
                                    <span className='mainColor'>{parseInt(voucher.discount_per)}% Off</span>
                                    <h6 className='fw-light mainColor'>{voucher.category}</h6>
                                    <p className='fw-light m-0'>Your Estimated Saving {parseInt(voucher.estimated_value)} AED</p>
                                    <div className='d-flex align-items-center justify-content-between my-4'>
                                        <div className=''>
                                            {/*<h5 className='fw-light'>{t('booking.details.location')}</h5>*/}
                                            {/*<h6 className='mainColor'>Mall Of Emirates</h6>*/}
                                        </div>
                                        {/* <div className='align-self-end'>
                                            <h5 className='fw-light'>{t('booking.details.validUntil')}</h5>
                                            <h6 className='mainColor'>{voucher.valid_until}</h6>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8 col-xs-12">
                            <div className="info-vocher p-3">
                                <div className='d-flex align-items-center justify-content-between f-c'>
                                    <div className=''>
                                        <h4>{voucher.category}</h4>
                                        <h6 className="fw-light">{voucher.description}</h6>
                                        {/*<p className="fw-light">{voucher.description}</p>*/}
                                    </div>
                                    <div className={'d-flex flex-column'}>
                                        {((type==='waik_in')||(type==='all')) && <button
                                            className='bgMainColor m-3 px-3 py-2 fw-light rounded-2 text-white'
                                            onClick={() => openModal('redeem', voucher.id)}
                                        >{t('app.redeem')}</button>}
                                        {((type==='booking')||(type==='all')) && <button
                                            className='bgMainColor m-3 px-3 py-2 fw-light rounded-2 text-white'
                                            onClick={()=> {
                                                if (shopType==='property') {
                                                    router.push(`/booking/dubai-property?id=${merchantId}&voucherId=${voucher.id}`)
                                                }
                                                else {
                                                    updateSlug(voucher.type)
                                                    updateVoucherId(voucher.id)
                                                }
                                            }}
                                        >{shopType==='property'? t('app.bookingProperty') : t('app.booking')}</button>}
                                        {/*<InputSelect options={voucherSlugs.map(v=> ({label:v,value:v}))} onChange={v=> setSlug(v.value)}/>*/}

                                    </div>
                                </div>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <span className="bgMainColor p-2 rounded-4 text-white m-2 px-3">{parseInt(voucher.discount_per)}% Off</span>
                                    <button className='p-0 m-0 bg-transparent mainColor' onClick={()=> openModal('terms')}>{t('booking.details.terms')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}