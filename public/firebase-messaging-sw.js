importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBUThzJBff3nlt2vGx-QESK5MIV9O769aI",
    authDomain: "treasure-9739a.firebaseapp.com",
    projectId: "treasure-9739a",
    storageBucket: "treasure-9739a.appspot.com",
    messagingSenderId: "827514819187",
    appId: "1:827514819187:web:c873f94e742aa5cb205006",
    measurementId: "G-WP0G0X6P3B"
}

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = { body: payload.notification.body };

    self.registration.showNotification(notificationTitle, notificationOptions);
});