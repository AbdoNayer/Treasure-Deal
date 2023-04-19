import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { BookingForm } from "../../../components/BookingComps/BookingForm";
import { FaqQuestion } from "../../../components/FaqQuestion";
import { InputSelect } from "../../../components/Inputs/InputSelect";
import Link from "next/link";
import Image from 'next/image';


export default function DetailsName() {
  
    const { t }                                         = useTranslation();
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const currency                                      = useSelector((state) => state.currency.currency);
    const [selectedCountry,setSelectedCountry]          = useState('');
    const [show, setShow]                               = useState(false);

    const count = [
        '1', '2', '3'
    ]

    const filter = [
        {
            'id'            : 1,
            'title'         : 'Sliver - AED 295',
            'dis'           : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
            'price'         : 'AED 295 each',
            'num' : [
                '1',
                '2',
                '3'
            ]
        }
    ]

    return (
      <div className='page-events-ev'>
          

            <div className=''>


                <div className='container pt-5 pb-4'>

                    <div className='position-relative ev-poster'>

                        <Image className='rounded-3 c-img' unoptimized={true} width={550} height={450} alt='img' src='/img/im-3.png'/>

                        <Image className='w-100 rounded-3' unoptimized={true} width={188} height={500} alt='cover' src='/img/mask-m.png'/>

                        <div className='ti-live-man'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <h2 className='text-white m-0'>Majid Al Mohandis live</h2>
                                <div className='d-flex align-items-center'>
                                    <i className='icon-location1 text-white fs-3'></i>
                                    <h5 className='text-white my-0 mx-2'>Coca-Cola Arena</h5>
                                </div>
                            </div>
                            <p className='text-white mt-5 mb-0'>
                                Make it a musical March with Majid Al Mohandis
                                <br/>
                                as he takes to the stage at the Coca-Cola Arena
                            </p>
                            <p className='text-white mt-5 mb-0'>Support: boxoffice@coca-cola-arena.com</p>
                            <div className='p-2 d-flex align-items-center mt-5'>
                                <div className='d-flex align-items-center bg-white rounded-3 p-3'>
                                    <i className='icon-date fs-5'></i>
                                    <span className='mx-2 fs-6'>20-12-2023</span>
                                </div>
                                <div className='d-flex align-items-center bg-white rounded-3 p-3 mx-3'>
                                    <i className='icon-clock fs-5'></i>
                                    <span className='mx-2 fs-6'>10:00 AM</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='row'>
                        <div className='col-md-6 col-xs-12'>

                            <div className='my-2'>
                                <h6 className='bgMainColor p-3 text-white rounded-3 fw-light d-inline-block'>
                                    About This Event
                                </h6>
                                <p className='pe-4'>
                                    Make it a musical March with Majid Al Mohandis as he takes to the stage at the Coca-Cola Arena. The Iraqi singing sensation, who has performed at sold-out shows across the region, will belt out some of his most loved hits on 17 March. Al Mohandis has been nicknamed the ‘Engineer of Arabic song’ thanks to his impressive vocals. On the night, expect a crowd-pleasing act filled with favourites from albums like Ana Wayyak and Ensaa along with tracks from his 2022 releases Meshtaqelak and Eateni Waqtan. Tickets are likely to sell out quickly, so book early to avoid disappointment. Doors open at 7pm.
                                </p>                                
                            </div>

                            <div className='my-2'>

                                <h6 className='bgMainColor p-3 text-white rounded-3 fw-light d-inline-block'>
                                    Ticket categories
                                </h6>

                                <div className='d-flex align-items-center my-2'>
                                    <h6 className='m-0'>Bronze : </h6>
                                    <h6 className='m-0 mx-1'>AED195</h6>
                                </div>
                                <div className='d-flex align-items-center my-2'>
                                    <h6 className='m-0'>Silver : </h6>
                                    <h6 className='m-0 mx-1'>AED195</h6>
                                </div>
                                <div className='d-flex align-items-center my-2'>
                                    <h6 className='m-0'>Gold : </h6>
                                    <h6 className='m-0 mx-1'>AED195</h6>
                                </div>
                                <div className='d-flex align-items-center my-2'>
                                    <h6 className='m-0'>Platinum : </h6>
                                    <h6 className='m-0 mx-1'>AED195</h6>
                                </div>
                                <div className='d-flex align-items-center my-2'>
                                    <h6 className='m-0'>Diamond : </h6>
                                    <h6 className='m-0 mx-1'>AED195</h6>
                                </div>
                                <div className='d-flex align-items-center my-2'>
                                    <h6 className='m-0'>VIP : </h6>
                                    <h6 className='m-0 mx-1'>AED195</h6>
                                </div>

                            </div>

                        </div>
                        <div className='col-md-6 col-xs-12'>

                            <h6 className='bgMainColor py-3 px-5 text-white rounded-3 fw-light d-inline-block'>
                                Overview
                            </h6>

                            <div className='d-flex my-4'>
                                <i className='icon-location1 mainColor fs-4'></i>
                                <span className='mx-2'>City Walk, Al Safa Street, Jumeirah, Dubai</span>
                            </div>

                            <div className='d-flex my-4'>
                                <i className='icon-internet mainColor fs-4'></i>
                                <Link href={''} className='mx-2 mainColor'>www.coca-cola-arena.com/en/e.....</Link>
                            </div>

                            <div className='d-flex my-4'>
                                <i className='icon-call mainColor fs-4'></i>
                                <span className='mx-2'>+971 123 456789</span>
                            </div>

                            <div className="gmap_canvas">
                                <iframe width="100%" height="200" className='rounded-3' src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;coord=52.70967533219885, -8.020019531250002&amp;q=1%20Grafton%20Street%2C%20Dublin%2C%20Ireland&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>
                            </div>

                        </div>
                    </div>

                </div>

                <hr/>

                <div className='container'>

                    <div className='my-2'>
                        <h6 className='bgMainColor p-3 text-white rounded-3 fw-light d-inline-block'>
                            Book Your tickets
                        </h6>                              
                    </div>

                    <div className='row'>

                        <div className='col-md-6 col-xs-12'>

                            {
                                filter.map((item) => (
                                    <div key={item.id} className='rounded-3 my-3'>
                                        <div onClick={()=> setShow(!show)} className='head-it-block p-3 bgSecondColor d-flex justify-content-between align-items-center'>
                                            <h6>{item.title}</h6>
                                            <i className={`${show === true ? 'rotate' : ''} icon-chevron-down fs-2`}></i>
                                        </div>
                                        {
                                            show ?
                                            <div className='p-3 border border-top-0'>
                                                <div className='bg-white'>
                                                    <p className='small-font-13'>{item.dis}</p>
                                                    <h6 className='my-4'>{item.price}</h6>
                                                </div>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <button className='btn-button w-auto px-4 bg-transparent text-white bgMainColor border-5'>Select</button>
                                                    <div className='select-active text-center'>
                                                        <span className='small-font-12'>Number of Tickets</span>
                                                        <InputSelect
                                                        className='m-auto d-table'
                                                            onChange={country => setSelectedCountry(country.value)}
                                                            options={count.map(count => ({
                                                                label   : count,
                                                                value   : count
                                                            }))}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                ))
                            }

                        </div>

                        <div className='col-md-6 col-xs-12'>
                                {/* <BookingForm
                                    defaultAddressId={''}
                                    defaultOrderId={''}
                                    voucherId={23}
                                    merchantId={23}
                                    checkAddressByVoucherType={'checkAddressByVoucherType'}
                                    serviceState={'serviceState'}
                                    employeesState={'employeesState'}
                                    time={'selectedTime'}
                                    checkInDate={'dateStart'}
                                    checkVoucherType={'checkVoucherType'}
                                    checkHasAdultsCount={'checkHasAdultsCount'}
                                    voucherType={'voucherType'}
                                    checkOutDate={'dateEnd'}
                                /> */}
                        </div>

                    </div>

                </div>

            </div>

      </div>
    )
}