import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {HotelStars} from "../../HotelStars";

export const HotelItems = ({hotelCode,hotel,...props}) => {
    const { t }                                             = useTranslation();
    // const {
    //     data:hotelDetails,
    //     isLoading:isHotelDetailsLoading,
    //     reFetch:refetchHotelDetails
    // } = useApi(()=> getIllusionHotelDetailsNative(hotelCode))
    // if (isHotelDetailsLoading) return <div className={'modal-height-view-mini position-relative'}><LoadData/></div>
    return (
        <div className="block-item-cate d-flex align-items-center p-2" {...props}>
            <div className="img-item p-3">
                <div className="old-shadow w-100 h-100 rounded-3 d-flex align-items-center justify-content-center">
                    <Image style={{ objectFit : "contain" }} width={70} height={70} alt='logo' src={'/img/hotel.png'} />
                </div>
            </div>
            <div className="up-info-cate d-flex align-items-center justify-content-between px-2">
                <div className="info-cate p-3">
                    <div className="d-flex align-items-center justify-content-between fl-col">
                        <h4 className="m-0 text-overflow">{hotel.Name}</h4>
                        {hotel.StarRating > 0 && <HotelStars starsNumber={hotel.StarRating}/>}
                    </div>
                    <h6 className="fw-light my-4">{hotel.city}</h6>
                    {/*<h6 className="fw-light my-4">{hotelDetails.Details[0].HotelCity}</h6>*/}
                    <Link href={{pathname: `booking/hotel-details`, query:{code: hotelCode}}} className='mainColor text-decoration-underline'>{t('booking.header.showDetails')}</Link>
                    {/*<h6 className="fw-light">{item.map_desc}</h6>*/}
                    {/*<p className="fw-light">{item.description}</p>*/}
                    {/*<div className="d-flex">*/}
                    {/*    {*/}
                    {/*        item.vouchers.map(offer => (*/}
                    {/*            <span key={offer.id} className="bgMainColor p-1 rounded-1 text-white m-2 px-2">{parseInt(offer.discount_per)}%Off</span>*/}
                    {/*        ))*/}
                    {/*    }*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )
}