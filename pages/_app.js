import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { useRouter } from 'next/router';
import { Layout, HeadPage, Header, Footer, Functions, TabsMobile, Breadcrumb, LoadingPage, BtnGoChat } from '../components';
import store from '../redux-toolkit/store/store';
import AOS from "aos";
import "aos/dist/aos.css";
import '../public/icomoon/icons.css';
import 'swiper/swiper-bundle.min.css'
import 'bootstrap/dist/css/bootstrap.css';
import "toastify-js/src/toastify.css";
import '../styles/globals.scss';
import { Modal } from "../components/Modal";
import {FirebaseInit} from "../components/FirebaseInit";

let persistor = persistStore(store);

function MyApp({ Component, pageProps }) {

  const router                        = useRouter();

  useEffect(() =>{
    
    import ('bootstrap/dist/js/bootstrap');

    AOS.init();
    AOS.refresh();

  });

  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Layout>
              <HeadPage namePage='treasure-deal' />
                <FirebaseInit />
              <Header />
               {/*<LoadingPage />*/}
              { router.pathname !== '/' ?  <Breadcrumb /> : null }
              <TabsMobile />
              <Functions />
              { router.pathname !== '/my-chat' ?  <BtnGoChat /> : null }
              <div className="main-body position-relative">
                <Component {...pageProps} />
              </div>
              <Footer />
            </Layout>
            <Modal />
        </PersistGate>
    </Provider>
  )
}

export default MyApp
