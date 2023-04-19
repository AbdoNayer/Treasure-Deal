import {AccountInfo} from "../../components/AccountInfo";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { 
    ProfileHeader,
    LuckyPartnersProfileComp,
    OrdersTableProfileComp,
    RedeemVoucherResult,
    FavouritesProfileComp,
    BundlesProfileComp,
    RedeemedHistory,
    MyDrawTableProfileComp,
    BookingCalendarProfileComp,
    AddressBookProfileComp,
    AllBookingHistory,
    ReferralCode,
    InviteInfluencers,
    BusinessServices,
    Enquiry,
    MyChat
} from "../../components/ProfileComps";

export default function MyAccount() {

    const user = useSelector((state) => state.user.user);
    const { t }     = useTranslation();
    const accountInfoArray = [
        {
            id: 1,
            icon:"/img/Artboard.png",
            title:t("user.profile.referral.title"),
            subTitle:t("user.profile.referral.subTitle"),
            description:t("user.profile.referral.description"),
            buttonMessage:t("user.profile.referral.buttonMessage"),
            name: "referral",
            buttonClick: ()=> showComp('referral'),
            component: <ReferralCode />,
        },
        {
            id: 2,
            icon:"/img/add-user.png",
            title:t("user.profile.influencers.title"),
            subTitle:t("user.profile.influencers.subTitle"),
            description:t("user.profile.influencers.description"),
            buttonMessage:t("user.profile.influencers.buttonMessage"),
            name: "influencers",
            buttonClick: ()=>showComp('influencers'),
            component: <InviteInfluencers />,
        },
        {
            id: 3,
            icon:"/img/promotion.png",
            title:t("user.profile.businessServices.title"),
            subTitle:t("user.profile.businessServices.subTitle"),
            description:t("user.profile.businessServices.description"),
            buttonMessage:t("user.profile.businessServices.buttonMessage"),
            name: "businessServices",
            buttonClick: ()=>showComp('businessServices'),
            component: <BusinessServices />,
        },
        {
            id: 4,
            icon:"/img/enquiry.png",
            title:t("user.profile.enquiry.title"),
            subTitle:t("user.profile.enquiry.subTitle"),
            description:t("user.profile.enquiry.description"),
            buttonMessage:t("user.profile.enquiry.buttonMessage"),
            name: "enquiry",
            buttonClick: ()=>showComp('enquiry'),
            component: <Enquiry />,
        },
        // {
        //     id: 5,
        //     icon:"/img/chats.png",
        //     title:t("user.profile.myChat.title"),
        //     subTitle:t("user.profile.myChat.subTitle"),
        //     description:t("user.profile.myChat.description"),
        //     buttonMessage:t("user.profile.myChat.buttonMessage"),
        //     name: "myChat",
        //     buttonClick: ()=>showComp('myChat'),
        //     component: <MyChat />,
        // },
        {
            id: 6,
            icon:"/img/calendar.png",
            title: t("user.profile.booking.title"),
            subTitle:t("user.profile.booking.subTitle"),
            description:t("user.profile.booking.description"),
            buttonMessage:t("user.profile.booking.buttonMessage"),
            name: "calendar",
            buttonClick: ()=>showComp('calendar'),
            component: <BookingCalendarProfileComp />
        },
        {
            id: 7,
            icon:"/img/order.png",
            title:t("user.profile.orders.title"),
            subTitle:'',
            description:t("user.profile.orders.description"),
            buttonMessage:t("user.profile.orders.buttonMessage"),
            name: "orders",
            buttonClick: ()=>showComp('orders'),
            component: <OrdersTableProfileComp/>,
        },
        {
            id: 8,
            icon:"/img/fortune.png",
            title:t("user.profile.bundle.title"),
            subTitle:t("user.profile.bundle.subTitle"),
            description:t("user.profile.bundle.description"),
            buttonMessage:t("user.profile.bundle.buttonMessage"),
            name: "bundle",
            buttonClick: ()=>showComp('bundle'),
            component: <BundlesProfileComp/>,
        },
        {
            id: 9,
            icon:"/img/wallet.png",
            title:t("user.profile.wallet.title"),
            subTitle:'AED ' + user ? user.wallet_balance : null,
            description:t("user.profile.wallet.description"),
            buttonMessage:t("user.profile.wallet.buttonMessage"),
            name: "wallet",
            buttonClick: ()=>showComp('wallet'),
            component: <div>HELLOOOOOOOOO wallet</div>,
        },
        {
            id: 10,
            icon:"/img/cons.png",
            title:t("user.profile.coins.title"),
            subTitle:user.my_coins,
            description:t("user.profile.coins.description"),
            buttonMessage:''
        },
        {
            id: 11,
            icon:"/img/select.png",
            title:t("user.profile.draw.title"),
            subTitle:t("user.profile.draw.subTitle"),
            description:t("user.profile.draw.description"),
            buttonMessage:t("user.profile.draw.buttonMessage"),
            name: "draw",
            buttonClick: ()=>showComp('draw'),
            component: <MyDrawTableProfileComp/>,
        },
        {
            id: 12,
            icon:"/img/money.png",
            title:t("user.profile.earn.title"),
            subTitle:t("user.profile.earn.subTitle"),
            description:'',
            buttonMessage:t("user.profile.earn.buttonMessage"),
            name: "earn",
            buttonClick: ()=>showComp('earn'),
            component: <div>HELLOOOOOOOOO earn</div>,
        },
        {
            id: 13,
            icon:"/img/favorite.png",
            title:t("user.profile.favourites.title"),
            subTitle:t("user.profile.favourites.subTitle"),
            description:'',
            buttonMessage:t("user.profile.favourites.buttonMessage"),
            name: "favourites",
            buttonClick: ()=>showComp('favourites'),
            component: <FavouritesProfileComp/>,
        },
        {
            id: 14,
            icon:"/img/people.png",
            title:t("user.profile.partners.title"),
            subTitle:t("user.profile.partners.subTitle"),
            description:'',
            buttonMessage:t("user.profile.partners.buttonMessage"),
            name: "partners",
            buttonClick: ()=>showComp('partners'),
            component: <LuckyPartnersProfileComp />,
        },
        {
            id: 15,
            icon:"/img/gift-voucher.png",
            title:t("user.profile.Redeem.redeem"),
            subTitle:t("user.profile.Redeem.earnHere"),
            description:'',
            buttonMessage:t("draw.results"),
            name: "redeem",
            buttonClick: ()=> showComp('redeem'),
            component: <RedeemVoucherResult/>,
        },
        {
            id: 16,
            icon:"/img/box.png",
            title:t("user.profile.Redeem.redeemedHistory"),
            subTitle:t("user.profile.Redeem.historyHere"),
            description:'',
            buttonMessage:t("booking.details.redeemed"),
            name: "redeemed",
            buttonClick: ()=> showComp('redeemed'),
            component: <div className="booking">
                <RedeemedHistory />
            </div>,
        },
        {
            id: 17,
            icon:"/img/Order_history.png",
            title:t("user.profile.Redeem.bookingHistory"),
            subTitle:t("user.profile.Redeem.bookingHere"),
            description:'',
            buttonMessage:t("booking.details.booking"),
            name: "booking",
            buttonClick: ()=> showComp('booking'),
            component: <div className="booking">
                <AllBookingHistory />
            </div>,
        },
        {
            id: 18,
            icon:"/img/home-address.png",
            title:'Address Book',
            subTitle:t("user.profile.address.addressHere"),
            description:'',
            buttonMessage:t("user.profile.address.address"),
            name: "address",
            buttonClick: ()=> showComp('address'),
            component: <div className="booking">
                <AddressBookProfileComp />
            </div>,
        },
    ];

    const [showState,setShowState] = useState({
        calendar:false,
        orders:false,
        bundle:false,
        wallet:false,
        draw:false,
        earn:false,
        favourites:false,
        partners:false,
        redeem:false,
        redeemed:false,
        booking:false,
        address:false,
        referral:false,
        influencers:false,
        businessServices:false,
        enquiry:false,
        myChat:false,
    })
    
    const showComp = (name) => {
        setShowState(Object.keys(showState).reduce((acc,key)=>({
            ...acc,
            [key]: key === name
        }),showState))
    }

    return (
        <div className='container'>
            <div className="up-profile mt-5">
                <h3 className='mb-4 fw-light'>{t("user.profile.title")}</h3>
                <ProfileHeader user={user}/>
                <div className="row act-profile">
                    <div className="col-12">
                        <AccountInfo
                            title={accountInfoArray[0].title}
                            subTitle={accountInfoArray[0].subTitle}
                            description={accountInfoArray[0].description}
                            icon={accountInfoArray[0].icon}
                            buttonMessage={accountInfoArray[0].buttonMessage}
                            buttonClick={accountInfoArray[0].buttonClick}
                        />
                    </div>
                    {showState[accountInfoArray[0].name] && <div className="col-12">{accountInfoArray[0].component}</div>}
                    {accountInfoArray.filter(item=> item.id!==1).map((item,idx)=>
                        <div key={item.id}>
                            <div className="col-12 mt-3">
                                <AccountInfo
                                    title={item.title}
                                    subTitle={item.subTitle}
                                    description={item.description}
                                    icon={item.icon}
                                    buttonMessage={item.buttonMessage}
                                    buttonClick={item.buttonClick}
                                />
                            </div>
                            {showState[item.name] && <div className="col-12">{item.component}</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}