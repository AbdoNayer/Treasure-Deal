import {initializeApp} from "firebase/app";
import {getMessaging, getToken, onMessage} from "firebase/messaging";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const FirebaseInit = ({...props}) => {

    const langVal                                           = useSelector((state) => state.language.language);

    const firebaseConfig = {
        apiKey: "AIzaSyBUThzJBff3nlt2vGx-QESK5MIV9O769aI",
        authDomain: "treasure-9739a.firebaseapp.com",
        projectId: "treasure-9739a",
        storageBucket: "treasure-9739a.appspot.com",
        messagingSenderId: "827514819187",
        appId: "1:827514819187:web:c873f94e742aa5cb205006",
        measurementId: "G-WP0G0X6P3B"
    }

    useEffect(()=>{
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);
        getToken(messaging, {vapidKey: "BDy49vy1ML74J9n19smFyAjnC7DegYMemerKSiG5T6mvBVtCnJWCTdf1AHHXwaXzUz3XekYyqBycfvUDKowX_tw"})
            .then((currentToken) => {
            if (currentToken) {
                // Send the token to your server and update the UI if necessary
                localStorage.setItem("deviceToken", currentToken)
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
        onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
            toast(
                <div>
                  <h5 className="mainColor fw-light">{payload?.notification?.title}</h5>
                  <h6 className="fw-light">{payload?.notification?.body}</h6>
                </div>,
                {
                    position            : langVal === 'en' ? "top-right" : 'top-left',
                    className           : 'tost-noty',
                    transition          : Slide,
                    autoClose           : 5000,
                    hideProgressBar     : true,
                    closeOnClick        : true,
                    pauseOnHover        : true,
                    draggable           : true,
                    progress            : undefined,
                    theme               : "light",
                }
            );
            // ...
        });

        function requestPermission() {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                }
            })
        }
    },[])

    return (<ToastContainer />)
}