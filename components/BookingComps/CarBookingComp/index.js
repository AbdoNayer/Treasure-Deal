import Image from "next/image";
import {useTranslation} from "react-i18next";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {
    Pagination, Thumbs, Autoplay
} from 'swiper';
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/pagination"
import "swiper/components/autoplay"
import "swiper/components/thumbs"
import {useDispatch, useSelector} from "react-redux";
import {showModalAction} from "../../../redux-toolkit/actions";
import {GalleryModalForm} from "../../ModalForms/GalleryModalForm";
import {ModalForm} from "../../ModalForms/ModalForm";
import {InputSelect} from "../../Inputs/InputSelect";
import {useEffect} from "react";

SwiperCore.use([Pagination,Thumbs,Autoplay]);

export const CarBookingComp = ({children,selectedServices,setServices,car,...props}) => {
    const { t }                                         = useTranslation();
    const dispatch                                      = useDispatch();
    const currency                                      = useSelector((state) => state.currency.currency);

    const openGalleryModal = (gallery) => dispatch(showModalAction(<ModalForm title={t('booking.details.gallery')}><GalleryModalForm gallery={gallery}/></ModalForm>))
    const options = [
        {label:'Choose Duration',value:0,price:0}
    ]
    return (
        <div>
            <div className={'td_car_booking old-shadow mt-3'} {...props}>
                {(selectedServices.find(service=> service.id === car.id) || (selectedServices && selectedServices[0]?.serviceId)) &&
                    <div className="bgMainColor text-white p-1 py-2 px-3">
                        <span className={'icon-star-full yallowColor'}/>
                        <strong className="mx-2 fw-light">Selected {car.type.split('_').join(' ')}</strong>
                    </div>
                }
                <div className="rounded-1 p-3">
                    <div className='td_car_info_wrapper d-flex align-items-start pb-3'>
                        <div className="td_img_wrapper">
                            <Swiper

                                spaceBetween={10}
                                grabCursor
                                loop
                                // autoplay={true}
                                autoplay={{delay:5000, waitForTransition: true, pauseOnMouseEnter: true, disableOnInteraction: false, }}
                                className={'td-car-gallery-swiper'}

                                // modules={[Navigation, Autoplay]}
                            >
                                {car.gallaries.map(galleryItem=>
                                    <SwiperSlide key={galleryItem.id} onClick={()=>openGalleryModal(car.gallaries)}>
                                        {/*<Image width={318} height={318} src={galleryItem.src} alt="gallery item"/>*/}
                                        <Image width={200} height={200} alt='service logo' src={galleryItem.image} />
                                        {/*<img alt='logo' src={galleryItem.image} />*/}
                                    </SwiperSlide>
                                )}
                            </Swiper>
                        </div>
                        <div className="td_car_details px-3">
                            <h5>{car.name}</h5>
                            <p className='my-2 small-font-13'>{car.description}</p>
                            <div className='d-flex align-items-center'>
                                {car.options.map(option=>
                                    <div key={option.id} className='d-flex align-items-center'>
                                        <i className='icon-info mainColor'/>
                                        {/*<img src={option.image} alt=""/>*/}
                                        <span className='mx-2 small-font-13'>{option.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='d-flex align-items-center justify-content-between pt-3'>
                        {car.has_price === 1 && <>
                            <button
                                className={`btn-button w-auto px-4 ${selectedServices.find(service => service.id === car.id) ? 'bgMainColor text-white' : 'bg-transparent text-black border-main border-5'}`}
                                // onClick={()=>setSelectedCarIds(car.id)}
                                onClick={() => setServices(car)}
                            >
                                {t('select')}</button>
                            <div className='d-flex align-items-center'>
                                <span className='mx-3 text-decoration-line-through text-black-50'>{car.price} {currency}</span>
                                <span>{car.price} {currency}</span>
                                {/*<span className='mx-3 text-decoration-line-through text-black-50'>{currency} 600</span>*/}
                                {/*<h6 className='m-0'>{currency} 400</h6>*/}
                            </div>
                        </>}
                        {car.has_price === 0 && <>
                            <div>select rent duration</div>
                            {car.prices &&
                                <div className="select-ponier">
                                    <InputSelect
                                        onChange={e=> {
                                            setServices({serviceId:car.id,id:e.value,price:e.price})
                                        }}
                                        options={options.concat(car.prices.map(price => ({label: `${price.duration} - ${currency} ${price.price}`, value: price.id,price:price.price})))}
                                    />
                                </div>   
                            }
                        </>}
                    </div>
                </div>
            </div>
            {children}
        </div>


    )
}