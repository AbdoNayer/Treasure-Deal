import Image from "next/image";
import Link from "next/link";
import {getIllusionHotelDetails} from "../../../redux-toolkit/actions/axiosCalls";
import {useApi} from "../../../hooks/useApi";
import {LoadData} from "../../index";
import {HotelStars} from "../../HotelStars";

export const HotelItems = ({hotelCode,hotel,...props}) => {
    const {
        data:hotelDetails,
        isLoading:isHotelDetailsLoading,
        reFetch:refetchHotelDetails
    } = useApi(()=> getIllusionHotelDetails(hotelCode))
    if (isHotelDetailsLoading) return <div className={'modal-height-view-mini position-relative'}><LoadData/></div>
    return (
        <div className="block-item-cate d-flex align-items-center p-2" {...props}>
            <div className="img-item p-3">
                <div className="old-shadow w-100 h-100 rounded-3 d-flex align-items-center justify-content-center">
                    {/*<Image style={{ objectFit : "contain" }} width={70} height={70} alt='logo' src={''} />*/}
                </div>
            </div>
            <div className="up-info-cate d-flex align-items-center justify-content-between px-2">
                <div className="info-cate p-3">
                    <h4>{hotel.Name}</h4>
                    <HotelStars starsNumber={hotel.StarRating}/>

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
                {/*<Link href={{pathname: `booking/details`, query:{merchant_id: item.id}}} className='bgMainColor m-3 px-3 py-2 fw-light rounded-2 text-white'>{t('booking.header.seeVouchers')}</Link>*/}
            </div>
        </div>
    )
}