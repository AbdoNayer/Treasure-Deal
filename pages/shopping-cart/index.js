import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {callCart, getSubscriptions, selectLinesMillionaire, showModalAction} from "../../redux-toolkit/actions";
import {MillionaireCart} from "../../components/CartComps/MillionaireCart";
import {LoadData, EmptyData} from "../../components";
import {RaffelillionaireCart} from "../../components/CartComps/RaffelillionaireCart";
import {useRouter} from "next/router";
import {ModalForm} from "../../components/ModalForms/ModalForm";
import {CountdownTimer} from "../../components/CountdownTimer";
import io from "socket.io-client";

export default function ShoppingCart() {
    const { t }                                             = useTranslation();
    const dispatch                                          = useDispatch();
    const router                                            = useRouter();
    const millionLinesInfo                                  = useSelector((state) => state.linesMillionair.millionLines);
    const cartInfo                                          = useSelector((state) => state.cart.cartState);
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const [ isLoadData, setIsLoadData ]                     = useState(true);
    const [isDeleting,setIsDeleting]                        = useState(false)

    useEffect(() => {if(user === null) router.push('/auth/login');}, [user]);

    const socket = io('https://treasuredeal.com:9090', {
        transports      : ['websocket'],
        query: "id=" + user?.id + "&user_type=User",
    });
    useEffect(()=>{
        if (user) {
            dispatch(getSubscriptions(user.token,langVal,currency))
            dispatch(selectLinesMillionaire(user.token,langVal,currency))
            dispatch(callCart(user.token,langVal,currency)).then(()=>setIsLoadData(false));
        }
    },[]);
    const [subscriptions,setSubscriptions] = useState([])

    useEffect(()=>{
        setSubscriptions([].concat([{id: 0, months: 0, discount_per: 0, draw_times: 1}],cartInfo.subscriptions.subscriptions))
    },[cartInfo.subscriptions.subscriptions])

    const checkCartType = (cart) => {
        switch (cart.cart_data.type) {
            case 'millionaire':
                return <MillionaireCart
                    subscriptions={subscriptions}
                    cartData={cart}
                />;
            default:
                return <RaffelillionaireCart
                    isDeleting={isDeleting}
                    setIsDeleting={setIsDeleting}
                    subscriptions={subscriptions}
                    cartData={cart}
                    socket={socket}
                />;
        }
    }

    const goToCheckOut = () => {
        if (cartInfo.carts.map(cart => cart.cart_data.can_checkout).includes(false)) {
            dispatch(showModalAction(<ModalForm title={t('shoppingCart.checkCart')}>
                {t('shoppingCart.pleaseCheck')}
            </ModalForm>))
        } else router.push('/shopping-cart/checkout')
    }

    if (isLoadData) return <LoadData/>
    if(!user) return null;

    return (
      <div className='td-card container'>

            <div className="td-card-header">
                <h3 className="td-lotto-header-title mt-4 fs-1 text-center">{t('millionaire.cart.shoppingCart')}</h3>
                <p className="td-lotto-header-description mt-4 fs-6">{t('millionaire.lotto.description')}</p>
            </div>
            {
                cartInfo.carts.length ? 
                <div className='row'>
                    <div className='col-md-7 col-xs-12'>
                        <div className='td-card-body my-5'>
                            {cartInfo.carts.map((cart,idx)=> <div key={idx}>{checkCartType(cart)}</div>)}
                        </div>
                        {/* <div className='footer-chick-out mt-4 mb-5'>
                            <div className='d-flex align-items-center justify-content-between mb-4'>
                                <h5 className='fw-light'>{t('millionaire.cart.totalPrice')}</h5>
                                <h5 className='fw-light mainColor'>{cartInfo.total_amount}</h5>
                            </div>
                            <div className='d-flex align-items-center justify-content-between btn-chickout'>
                                <button className='fw-light btn-button bgMainColor text-white'>{t('millionaire.lotto.buttons.continueShopping')}</button>
                                <button className='fw-light btn-button bgMainColor text-white' onClick={goToCheckOut}>{t('millionaire.cart.CHECKOUT')}</button>
                            </div>
                        </div> */}
                    </div>
                    <div className='col-md-5 col-xs-12'>
                    
                        <div className='mb-5'>
    
                            <div className='over-x'>

                            <div className='view-check-num old-shadow'>
                                <table className="table text-center mt-4">
                                    <thead className='bgMainColor'>
                                        <tr>
                                            <th className='fw-light text-white fs-6 p-2'>{t("shoppingCart.SI")}</th>
                                            <th className='fw-light text-white fs-6 p-2'>{t("shoppingCart.bundleId")}</th>
                                            <th className='fw-light text-white fs-6 p-2'>{t("shoppingCart.bundleType")}</th>
                                            <th className='fw-light text-white fs-6 p-2'>{t("shoppingCart.subscription")}</th>
                                            <th className='fw-light text-white fs-6 p-2'>{t("shoppingCart.discount")}</th>
                                            <th className='fw-light text-white fs-6 p-2'>{t("shoppingCart.price")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartInfo.carts.map((cart,idx)=>
                                            <tr key={cart.cart_data.id}>
                                                <td>{idx+1}</td>
                                                <td>{cart.cart_data.id}</td>
                                                <td>{cart.cart_data.type_text}</td>
                                                <td>X {cart.cart_data.draw_times}</td>
                                                <td>{cart.cart_data.discount_amount > 0 ? cart.cart_data.discount_amount : 'N/A'}</td>
                                                <td>{cart.cart_data.amount}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <div className='d-flex align-items-end px-3 justify-content-end flex-column w-100 pb-3'>
                                    <div className='d-flex align-items-center justify-content-between w-50'>
                                        <h6 className='fw-light'>{t('shoppingCart.subTotal')}</h6>
                                        <h6 className='fw-light'>{Number(cartInfo.total_sub_amount).toFixed(2)}</h6>
                                    </div>
                                    <div className='d-flex align-items-center justify-content-between w-50'>
                                        <h6 className='fw-light'>{t('shoppingCart.totalDiscount')}</h6>
                                        <h6 className='fw-light'>{Number(cartInfo.total_discount).toFixed(2)}</h6>
                                    </div>
                                    <div className='d-flex align-items-center justify-content-between w-50'>
                                        <h6 className='fw-light'>{cartInfo.vat_percentage} {t('shoppingCart.VAT')}</h6>
                                        <h6 className='fw-light'>{((parseFloat(cartInfo.vat_percentage) / 100) * Number(cartInfo.total_sub_amount)).toFixed(2)}</h6>
                                    </div>
                                </div>

                            </div>
                            </div>

                            <div className='d-flex align-items-end flex-column justify-content-end mx-2 my-2'>
                                <div className='d-flex align-items-center justify-content-between w-50'>
                                    <h6>{t('millionaire.checkout.total')}</h6>
                                    <h6>{currency} {Number(cartInfo.final_total).toFixed(2)}</h6>
                                </div>
                                <button className='fw-light btn-button bgMainColor text-white mt-2' onClick={goToCheckOut}>
                                    {t('millionaire.cart.CHECKOUT')}
                                </button>
                            </div>

                            <div className='my-5'>
                                
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
                                        <button className='btn-button bg-white' onClick={()=>router.push('/raffleillionaire-bundle/raffleillionaire')}>
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
                                        <button className='btn-button bg-white'onClick={()=>router.push('/luxury-cars-voucher/luxury-cars')}>
                                            {t('millionaire.lotto.buttons.addBundle')}
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center align-self-end">

                                        <i className='icon-date fs-4 text-white mx-2'/>
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

                                        <i className='icon-date fs-4 text-white mx-2'/>
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

                                        <i className='icon-date fs-4 text-white mx-2'/>
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

                                        <i className='icon-date fs-4 text-white mx-2'/>
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
                :
                <EmptyData data={{text : 'app.notFound'}} />
            }

      </div>
    )
}