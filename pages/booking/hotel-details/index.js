import {useRouter} from "next/router";
import {useApi} from "../../../hooks/useApi";
import {
    getIllusionHotelDetailsNative,
    getIllusionHotelSearchDetailsNative, getTreasureSettings
} from "../../../redux-toolkit/actions/axiosCalls";
import {useEffect, useState, useMemo} from "react";
import {LoadData} from "../../../components";
import Image from "next/image";
import {InputSelect} from "../../../components/Inputs/InputSelect";
import {useTranslation} from "react-i18next";
import {GalleryModalForm} from "../../../components/ModalForms/GalleryModalForm";

import SwiperCore, {
    Thumbs, Autoplay
} from 'swiper';
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/pagination"
import "swiper/components/autoplay"
import "swiper/components/thumbs";
import {useDispatch, useSelector} from "react-redux";
import {showModalAction} from "../../../redux-toolkit/actions";
import {ModalForm} from "../../../components/ModalForms/ModalForm";
import {getCode} from 'country-list'
import {HotelStars} from "../../../components/HotelStars";
import Calendar from "react-calendar";
import {HotelBookingItem} from "../../../components/HotelBookingItem";
import {useTable} from "../../../hooks/table-hook";
import {Pagination} from "../../../components/Pagination";

SwiperCore.use([Thumbs,Autoplay]);

export default function HotelDetails() {
    const router                                                    = useRouter();
    const langVal                                                   = useSelector((state) => state.language.language);
    const dispatch                                                  = useDispatch()
    const { t }                                                     = useTranslation();
    const user                                                      = useSelector((state) => state.user.user);
    const [inShowOffers,setInShowOffers]                            = useState(false);
    const [inShowFormBooking, setInShowFormBooking]                 = useState(false)
    const [illusionCommission,setIllusionCommission]                = useState(0)
    const [illusionDiscount,setIllusionDiscount]                    = useState(0)
    const {code} = router.query

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    const {
        data:treasureSettings,
        isLoading:isTreasureSettingsLoading,
        reFetch:refetchTreasureSettings
    } = useApi(()=> getTreasureSettings())
    useEffect(()=>{
        if (treasureSettings) {
            setIllusionCommission(treasureSettings.settings.find(item => item.key === "illusion_commission").value)
            setIllusionDiscount(treasureSettings.settings.find(item => item.key === "illusion_discount").value)
        }
    },[treasureSettings])

    const {
        data:hotelDetails,
        isLoading:isHotelDetailsLoading,
        reFetch:refetchHotelDetails
    } = useApi(()=> getIllusionHotelDetailsNative(code),false)

    //#region date state
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return Number(`${year}${month < 10 ? ('0'+month) : month}${day < 10 ? ('0'+day) : day}`);
    }
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const [startDate,setStartDate] = useState(today)
    const [endDate,setEndDate] = useState(tomorrow);
    const [showCalendar,setShowCalendar] = useState(false)
    useEffect(()=>{
        console.log(formatDate(startDate));
        console.log(formatDate(endDate));
    },[startDate,endDate])
    //#endregion

    //#region search availability
    const count = [1,2,3,4,5,6,7,8,9]
    const [hotelAvailabilityState,setHotelAvailabilityState]        = useState([])
    const [roomCount,setRoomCount]                                  = useState(0)
    const [adultCount,setAdultCount]                                = useState(0)
    const [childrenCount,setChildrenCount]                          = useState(0)
    const [availabilityErrorMessage,setAvailabilityErrorMessage]    = useState([])
    const [isCheckingAvailability,setIsCheckingAvailability]        = useState(false)
    const [currentPage,setCurrentPage]                              = useState(1)

    const {setObjs,filteredObjs,message,createSearchHandler} = useTable([])
    let pageSize = 6
    const currentTableData = useMemo(() => {
        if (filteredObjs) {
            const firstPageIndex = (currentPage - 1) * pageSize;
            const lastPageIndex = firstPageIndex + pageSize;
            return filteredObjs.slice(firstPageIndex, lastPageIndex);
        }
    }, [currentPage,filteredObjs]);

    const distributeNumbers = (roomsCount,adultsCount,childrenCount) => {
        const numberOfSlots = roomsCount;
        const adultsNumber = [...Array(adultsCount).keys()]
        const childrenNumber = [...Array(childrenCount).keys()]

        const nestedArray = Array(numberOfSlots)
            .fill(null)
            .map(() => ({Adult:[],Child:[]}));

        console.log('nestedArray',nestedArray);
        adultsNumber.forEach((number, index) => {
            nestedArray[index % numberOfSlots].Adult.push({"Age":25})
        })
        childrenNumber.forEach((number, index) => {
            nestedArray[index % numberOfSlots].Child.push({"Age":8})
        })
        return nestedArray.filter(item => item.Adult.length !== 0 || item.Child.length !== 0)
    }

    const roomConfiguration = {
        "Room": distributeNumbers(roomCount,adultCount,childrenCount)
    }

    const {
        data:hotelAvailability,
        isLoading:isHotelAvailabilityLoading,
        reFetch:refetchHotelAvailability
    } = useApi(()=> getIllusionHotelSearchDetailsNative(code
        ,formatDate(startDate)
        ,formatDate(endDate)
        ,getCode(user.nationality_name === 'Aland Islands' ? 'Åland Islands' : user.nationality_name),
        roomConfiguration
    ),false)

    const galleryOptions = [
        {id:1,src:'/img/become.png'},
        {id:2,src:'/img/become.png'},
        {id:3,src:'/img/become.png'},
        {id:4,src:'/img/become.png'},
        {id:5,src:'/img/become.png'},
        {id:6,src:'/img/banner.png'},
    ];

    useEffect(()=>{
        if (code) {
            refetchHotelDetails()
        }
    },[code])

    useEffect(()=>{
        if (hotelAvailability && hotelDetails) {
            if (hotelAvailability.ErrorMessage?.Error?.Messages) {
                setAvailabilityErrorMessage(hotelAvailability.ErrorMessage?.Error?.Messages)
                setObjs([])
            }
            // if (hotelAvailability.Hotels.Hotel.length) {
            //     console.log(
            //         'merging', hotelDetails.Details[0].RoomTypes.RoomType.map(room => ({
            //             code:room.RoomTypeCode,
            //             roomName:room.RoomType,
            //             images:room.Images.Img,
            //             contracts:hotelAvailability.Hotels?.Hotel[0]?.RoomTypeDetails.Rooms.Room.map(availableRoom =>
            //                 room.RoomTypeCode === availableRoom.RoomTypeCode
            //                     ? ({...availableRoom,images:room.Images.Img})
            //                     : null
            //             ).filter(item => item)
            //         })).filter(item => item.contracts?.length > 0).sort((a,b) => (a.roomName > b.roomName) ? 1 : ((b.roomName > a.roomName) ? -1 : 0))
            //     )
            if (hotelAvailability.Hotels.Hotel[0]) {
                setAvailabilityErrorMessage([])
                setObjs(
                    hotelDetails.Details[0].RoomTypes.RoomType.map(room => (
                        hotelAvailability.Hotels?.Hotel[0]?.RoomTypeDetails.Rooms.Room.map(availableRoom =>
                            room.RoomTypeCode === availableRoom.RoomTypeCode
                                ? ({
                                    ...availableRoom,
                                    images:room.Images.Img,
                                    maxPassengers:room.MaxOccPax,
                                    maxAdults:room.MaxOccAdt,
                                    maxChildren:room.MaxOccChd,
                                    hotelCityCode:hotelDetails.Details[0].CityCode,
                                    hotelCode:hotelDetails.Details[0].HotelCode,
                                })
                                : null
                        ).filter(item => item)
                    )).flat()
                )
                // setHotelAvailabilityState(
                //     hotelDetails.Details[0].RoomTypes.RoomType.map(room => (
                //         hotelAvailability.Hotels?.Hotel[0]?.RoomTypeDetails.Rooms.Room.map(availableRoom =>
                //             room.RoomTypeCode === availableRoom.RoomTypeCode
                //                 ? ({
                //                     ...availableRoom,
                //                     images:room.Images.Img,
                //                     maxPassengers:room.MaxOccPax,
                //                     maxAdults:room.MaxOccAdt,
                //                     maxChildren:room.MaxOccChd,
                //                     hotelCityCode:hotelDetails.Details[0].CityCode,
                //                     hotelCode:hotelDetails.Details[0].HotelCode,
                //                 })
                //                 : null
                //         ).filter(item => item)
                //     )).flat()
                // )
                setIsCheckingAvailability(false)
            }
        }
    },[hotelAvailability])
    useEffect(()=>{
        console.log('filteredObjs',filteredObjs);
    },[filteredObjs])

    const openGalleryModal = (gallery) => dispatch(showModalAction(<ModalForm title={t('booking.details.gallery')}><GalleryModalForm gallery={gallery}/></ModalForm>))

    const openModalDetails = (data) => {
        dispatch(showModalAction(
            <ModalForm title={t('booking.header.showDetails')}>
                <p className="mb-5 mt-0">{data}</p>
            </ModalForm>
        ));
    }

    const openRoomFacilities = (data) => {
        dispatch(showModalAction(
            <div className='features-section'>
                <ModalForm title={t('booking.details.features')}>
                    <div className='mb-4'>
                        {data.map(amenity =>
                            <div className='d-flex align-items-center py-3 px-4 border-main-def' key={amenity.id}>
                                {/*<Image style={{ objectFit : "contain" }} width={50} height={50} src={amenity.image} alt="amenity icon"/>*/}
                                <h6 className='mx-3'>{amenity}</h6>
                            </div>
                        )}

                        {/*<div className='d-flex align-items-center py-3 px-4 border-main-def'>*/}
                        {/*    <i className='icon-award fs-3'></i>*/}
                        {/*    <h6 className='mx-3'>Quality</h6>*/}
                        {/*</div>*/}
                        {/*<div className='d-flex align-items-center py-3 px-4 border-main-def'>*/}
                        {/*    <i className='icon-customer-service fs-3'></i>*/}
                        {/*    <h6 className='mx-3'>Customer Service</h6>*/}
                        {/*</div>*/}
                    </div>
                </ModalForm>
            </div>
        ));
    }


    if (isHotelDetailsLoading||isTreasureSettingsLoading) return <LoadData/>

    if(user === null) return null;

    return (
        
    <div className='become-partner py-5'>
        
        <div className='container'>

            {/*<h4 className='mt-0 mb-4 fw-light'>FULLY FURNISHED | 1 BHK</h4>*/}

            <div className='row'>
                {/*hotelDetails.Details[0].Images.Img*/}
                <div className='col-md-8 col-xs-12'>
                    {hotelDetails.Details[0].Images.Img.length > 0
                        ? <div className='slide-de border'>
                            <GalleryModalForm gallery={hotelDetails.Details[0].Images.Img.map((img,idx)=>({id:idx,image:img}))}/>
                        </div>
                        : <Image
                            className="w-100 rounded-1"
                            width={200}
                            height={550}
                            alt='service logo'
                            src={galleryOptions[0].src}
                        />
                    }
                    {/* <div className='slide-de border'>
                        <GalleryModalForm gallery={hotelDetails.Details[0].Images.Img.map((img,idx)=>({id:idx,image:img}))}/>
                    </div> */}
                </div>
                <div className='col-md-4 col-xs-12'>
                    <div className='info-de-sale pb-4'>
                        <h5 className='fw-light mt-0 mb-3'>{hotelDetails.Details[0].HotelName}</h5>
                        <HotelStars starsNumber={hotelDetails.Details[0].HotelStarRating}/>
                        {hotelDetails.Details[0].HotelPhone && hotelDetails.Details[0].HotelPhone !== 'NA' &&
                            <div className='d-flex align-items-center my-3'>
                                <i className='icon-call fs-3 mainColor'/>
                                <span className='fw-light mx-3'>{hotelDetails.Details[0].HotelPhone}</span>
                            </div>
                        }
                        {hotelDetails.Details[0].HotelEmail && hotelDetails.Details[0].HotelEmail !== 'NA' &&
                            <div className='d-flex align-items-center my-3'>
                                <i className='icon-mail fs-3 mainColor'/>
                                <span className='fw-light mx-3'>{hotelDetails.Details[0].HotelEmail}</span>
                            </div>
                        }
                        {hotelDetails.Details[0].HotelWeb && hotelDetails.Details[0].HotelWeb !== 'NA' &&
                            <div className='d-flex align-items-center my-3'>
                                <i className='icon-internet fs-3 mainColor'/>
                                <span className='fw-light mx-3 small-font-13'>{hotelDetails.Details[0].HotelWeb}</span>
                            </div>
                        }
                        <div className='d-flex align-items-center'>
                            <i className='icon-location mainColor fs-3'/>
                            <h6 className="fw-light mx-3 small-font-13">{hotelDetails.Details[0].HotelAddress}</h6>

                        </div>

                        <div className='info-de-sale'>
                            <div className="d-flex align-items-center justify-content-between my-3">
                                {
                                    hotelDetails.Details[0].HotelFacilities.Facility.length > 0 && 
                                        <button
                                            className="mainColor text-decoration-underline bg-transparent"
                                            onClick={()=>openRoomFacilities(hotelDetails.Details[0].HotelFacilities.Facility)}>
                                            {t('hotel.form.roomFacilit')}
                                        </button>
                                }
                                <button onClick={()=> openModalDetails(hotelDetails.Details[0].Description)} className="mainColor text-decoration-underline bg-transparent">{t('booking.header.showDetails')}</button>
                            </div>
                            <div className='my-4 border rounded-3'>
                                <iframe id="gmap_canvas" src={`https://maps.google.com/maps?q=${hotelDetails.Details[0].GeoLocation.Latitude},${hotelDetails.Details[0].GeoLocation.Longitude}&z=15&output=embed`} frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className='row'>
                <div className='col-md-12 col-xs-12'>

                    <div className='p-4 rounded-3 old-shadow box-result-hotel my-4'>
                        
                        <h5 className="mt-0 mb-4">{t('hotel.searchRoom')}</h5>

                        <div className="row filter-rooms align-items-center">
                            <div className="col-md-4 col-xs-12">
                                <div className="td_booking_comp_availability_wrapper position-relative">
                                    <div className={'td_input_date d-flex align-items-center justify-content-between px-3'}>
                                            <div className="td_date">
                                                {/*{t('app.checkDate')}*/}
                                                <>From: {startDate.toLocaleDateString(undefined,dateOptions)} &nbsp; To: {endDate.toLocaleDateString(undefined,dateOptions)}</>
                                                {/*{dateStart.toLocaleDateString(undefined,options)}*/}
                                                {/*{checkVoucherType()==='booking_type_2'*/}
                                                {/*    ? <>From: {dateStart.toLocaleDateString(undefined,options)} &nbsp; To: {dateEnd.toLocaleDateString(undefined,options)}</>*/}
                                                {/*    : <>{dateStart.toLocaleDateString(undefined,options)}</>*/}
                                                {/*}*/}
                                            </div>
                                            <div className="td_date_open"><button onClick={()=>setShowCalendar(!showCalendar)} className='bg-transparent icon-date fs-4' /></div>
                                    </div>
                                    {
                                        showCalendar && <div className="td_calendar calendar-booking">
                                            <Calendar
                                                next2Label={null}
                                                prev2Label={null}
                                                minDetail={'month'}
                                                selectRange={true}
                                                onChange={(e)=>{
                                                    setStartDate(e[0])
                                                    setEndDate(e[1])
                                                    setShowCalendar(false)
                                                }}
                                                value={[startDate,endDate]}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="col-md-2 col-xs-12">
                                <div className="select-add">
                                    <InputSelect
                                        placeholder={t('hotel.form.selectRooms')}
                                        options={count.map(item=> ({label:item,value:item}))}
                                        onChange={e=> setRoomCount(e.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-2 col-xs-12">
                                <div className="select-add">
                                    <InputSelect
                                        placeholder={t('hotel.form.selectAdu')}
                                        options={count.map(item=> ({label:item,value:item}))}
                                        onChange={e=> setAdultCount(e.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-2 col-xs-12">
                                <div className="select-add">
                                    <InputSelect
                                        placeholder={t('hotel.form.selectChild')}
                                        options={count.map(item=> ({label:item,value:item}))}
                                        onChange={e=> setChildrenCount(e.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-2 col-xs-12">
                                <button
                                    onClick={()=> {
                                        setIsCheckingAvailability(true)
                                        refetchHotelAvailability()
                                    }}
                                    className={'bgMainColor btn-button text-white w-100 px-4'}
                                >
                                    {isCheckingAvailability
                                        ? <span className={'spinner-border spinner-border-sm text-white'}/>
                                        : <>{t("app.search")}</>
                                    }

                                </button>
                            </div>
                        </div>
                        
                    </div>

                    {availabilityErrorMessage.length > 0 &&
                        availabilityErrorMessage.map((error,idx) => <h5 className={'text-center text-danger'} key={idx}>{error}</h5>)
                    }
                    {/*<div className={'booking'}>*/}
                    {/*    <div className={'block-search ms-auto'}>*/}
                    {/*        <input onChange={createSearchHandler('RoomType')}/>*/}
                    {/*        <button>*/}
                    {/*            <span className="mx-2 fw-light">Search</span>*/}
                    {/*            <i className="icon-search" />*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {currentTableData.length > 0 && <div className="row old-shadow p-3 rounded-2 my-4">
                        <div className="col">
                            {currentTableData.map((contract,idx) =>
                                <div key={idx}>
                                    <HotelBookingItem
                                        commission={illusionCommission}
                                        discount={illusionDiscount}
                                        contract={contract}
                                        galleryOptions={galleryOptions}
                                        openGalleryModal={openGalleryModal}
                                        startDate={startDate}
                                        endDate={endDate}
                                    />
                                </div>
                            )}
                        </div>

                    </div>}
                    {filteredObjs.length > 0 && <div className={'d-flex align-items-center justify-content-center my-5'}>
                        <Pagination
                            className="pagination-bar"
                            currentPage={currentPage}
                            totalCount={filteredObjs.length}
                            pageSize={pageSize}
                            onPageChange={page => setCurrentPage(page)}
                        />
                    </div>}
                </div>
            </div>

        </div>

    </div>
    )
}
