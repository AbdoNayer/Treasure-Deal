import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {CountdownTimer} from "../../../components/CountdownTimer";
import {useTranslation} from "react-i18next";
import { v4 as uuid } from 'uuid';

import {
    addBundleMillionaire, callCart, hideModalAction,
    removeBundleMillionaire, saveBundleMillionaire,
    selectLinesMillionaire,
    showModalAction
} from '../../../redux-toolkit/actions';
import {EmptyData, LoadData} from "../../../components";
import {LuckyNumbersWrapper} from "../../../components/LuckyNumbersWrapper";
import {ErrorModalForm} from "../../../components/ModalForms/ErrorModalForm";
import {useRouter} from "next/router";
import {ModalForm} from "../../../components/ModalForms/ModalForm";
import {
    addMillionVoucherBundleReducer,
    resetMillionVoucherReducer
} from "../../../redux-toolkit/reducer/millionVoucherReducer";
import {resetMillionLinesReducer} from "../../../redux-toolkit/reducer/linesMillionaireReducer";
import Image from 'next/image';

export default function MillionaireLotto() {

    const router                                            = useRouter();
    const { t }                                             = useTranslation();
    const dispatch                                          = useDispatch();
    const millionareInfo                                    = useSelector((state) => state.millionVoucher.millionVoucher);
    const millionLinesInfo                                  = useSelector((state) => state.linesMillionair.millionLines);
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const [isLoadData,setIsLoadData]                        = useState(false);
    const [isLoading,setIsLoading]                          = useState(false);
    const maxLuckyCards                                     = [...Array(millionLinesInfo.lines_per_bundle).keys()];
    const [maxLuckyCardsBundles]                            = useState([...Array(millionareInfo.qty).keys()]);
    const [clearAllButton,setClearAllButton]                = useState(0);
    const [shuffleAllButton,setShuffleAllButton]            = useState(0);
    const [maxBundlesWithIds,setMaxBundlesWithIds]          = useState(
        maxLuckyCardsBundles.reduce((acc,elem)=> {
                return acc
                    ? [...acc,
                        {
                            elem,
                            id: uuid(),
                            selectedLines: millionLinesInfo.selected_lines
                                ? millionLinesInfo.selected_lines.filter(line=>line.setno === (elem+1)).reduce((linesAcc,line)=>{
                                    return linesAcc
                                        ? [...linesAcc,{
                                            setno:line.setno,
                                            id:line.id,
                                            luckynumber5: line.luckynumber5,
                                            luckynumber2: line.luckynumber2,
                                        }]
                                        : [{
                                            setno:line.setno,
                                            id:line.id,
                                            luckynumber5: line.luckynumber5,
                                            luckynumber2: line.luckynumber2,
                                        }]
                                },[])
                                : []
                        }
                    ]
                    : [
                        {
                            elem,
                            id: uuid(),
                            selectedLines: millionLinesInfo.selected_lines
                                ? millionLinesInfo.selected_lines.filter(line=>line.setno === (elem+1)).reduce((linesAcc,line)=>{
                                    return linesAcc
                                        ? [...linesAcc,{
                                            setno:line.setno,
                                            id:line.id,
                                            luckynumber5: line.luckynumber5,
                                            luckynumber2: line.luckynumber2,
                                        }]
                                        : [{
                                            setno:line.setno,
                                            id:line.id,
                                            luckynumber5: line.luckynumber5,
                                            luckynumber2: line.luckynumber2,
                                        }]
                                },[])
                                : []
                        }
                    ]
            },[]
        )
    );
    const [luckyNumbersCounter,setLuckyNumbersCounter] = useState(0)
    const [luckyNumbers,setLuckyNumbers] = useState([])
    const [luckyNumbersValid,setLuckyNumbersValid] = useState([]);

    useEffect(()=>{
        setIsLoadData(true)
        dispatch(callCart(user.token,langVal,currency))
        dispatch(selectLinesMillionaire(user.token,langVal,currency)).then(()=>{
            setIsLoadData(false)
        }).catch(()=>{
            setIsLoadData(false)
        })
    },[]);

    const saveNumbers = (arr) => {
        setLuckyNumbers(prevState => ([...prevState,arr]))
    }

    const updateNumbers = async () => {
        await setLuckyNumbersValid([])
        await setLuckyNumbers([])
        await setLuckyNumbersCounter(luckyNumbersCounter+1)
    }

    const checkCardEmpty = (arr1,arr2) => {
        if (arr1.length === 5 && arr2.length === 2) setLuckyNumbersValid(prevState => ([...prevState,true]))
        else setLuckyNumbersValid(prevState => ([...prevState,false]))
    }

    const checkAndSaveAllNumbers = async () => {
        setIsLoading(true)
        if (millionareInfo.qty === 0) {
            dispatch(showModalAction(<ErrorModalForm
                title={t('millionaire.lotto.pop_ups.error_popup.no_bundles.title')}
                message={t('millionaire.lotto.pop_ups.error_popup.no_bundles.message')}
                buttonMessage={t('millionaire.lotto.pop_ups.error_popup.no_bundles.button')}
            />))
            setIsLoading(false)
        } else {
            await updateNumbers()
        }
    }

    const sendNumbers = () => {
        if (luckyNumbers.length !== 0) {
            if (luckyNumbersValid.includes(false)) {
                dispatch(showModalAction(<ErrorModalForm
                    title={t('millionaire.lotto.pop_ups.error_popup.no_lines.title')}
                    message={t('millionaire.lotto.pop_ups.error_popup.no_lines.message')}
                    buttonMessage={t('millionaire.lotto.pop_ups.error_popup.no_lines.button')}
                />))
                setIsLoading(false)
            } else {
                dispatch(saveBundleMillionaire({numbers: JSON.stringify(luckyNumbers)},router,user.token,langVal,currency)).then(()=>{
                    setIsLoading(false)
                })
            }
        }
    }

    useEffect(()=>{
        sendNumbers()
    },[luckyNumbers]);

    const addBundle = (num) => {
      if (maxBundlesWithIds.length === millionLinesInfo.max_bundles) {
          dispatch(showModalAction(<ModalForm title={t('millionaire.lotto.pop_ups.bundle_limit.title')}>
              <div className={'text-center mb-4'}>
                  {t('millionaire.lotto.pop_ups.bundle_limit.message')}
              </div>
          </ModalForm>))
      }
      else {
          dispatch(showModalAction(
              <ModalForm
                  title={'Add Bundle'}
                  applyButton
                  applyText={t('millionaire.lotto.pop_ups.add_bundle.title')}
                  applyFunction={async () => {
                      dispatch(addMillionVoucherBundleReducer(millionareInfo.qty+1))
                      await setMaxBundlesWithIds(prevState => ([...prevState,{elem:num,id:uuid()}]))
                      dispatch(hideModalAction())
                  }}>
                  <div className={'d-flex flex-column align-items-center justify-content-between'}>
                      <div className={'mb-4'}>{t('millionaire.lotto.pop_ups.add_bundle.message')}</div>
                  </div>
          </ModalForm>))
      }
    }

    const removeBundle = async (key) => {
        await setMaxBundlesWithIds(maxBundlesWithIds.filter(bundle=> bundle.id!==key))
        dispatch(addMillionVoucherBundleReducer(millionareInfo.qty-1))
    }

    // const setNum = (num) => {
    //     if(num === 1){
    //         return 250;
    //     }else if(num === 2){
    //         return 500;
    //     }else if(num === 3){
    //         return 750;
    //     }else if(num === 4){
    //         return 1000;
    //     }
    // }

    if(isLoadData) return ( <LoadData /> )

    return (
      <div className={'td-lotto container'}>
          <div className="td-lotto-header">
              <div className='my-5'>
                <h3 className="td-lotto-header-title fw-light mt-4 fs-1 text-center">{t('millionaire.lotto.title')}</h3>
                <p className="td-lotto-header-description mt-4 fs-6">{t('millionaire.lotto.description')}</p>
              </div>
              <div className="td-lotto-header-prize mt-4 d-flex justify-content-between align-items-center p-4">
                  <div className="td-lotto-header-prize-logo">
                    <Image style={{ objectFit : "contain" }} width={100} height={100} src="/img/TD.png" alt="treasure deal logo"/>
                  </div>
                  <div className="td-lotto-header-prize-money d-flex flex-column text-center">
                      <div className="fw-bold">{t('millionaire.lotto.subTitle')}</div>
                      <div className="fw-bold">{millionLinesInfo.prize_value.toLocaleString()}</div>
                  </div>
                  <div className="td-lotto-header-prize-countdown align-self-end">
                      <CountdownTimer date={millionLinesInfo.prize_date}/>
                  </div>
              </div>
          </div>
          <div className="td-lotto-body">
              <div className="td-lotto-body-header d-flex align-items-center justify-content-between">
                  <div className="td-lotto-body-header-logo mx-2">
                    <Image style={{ objectFit : "contain" }} width={120} height={40} src="/img/logo-white.png" alt="treasure deal logo"/>
                  </div>
                  <div className="td-lotto-body-header-buttons d-flex align-items-center">
                      <button className={'btn-button bgSecondColor text-black d-table mx-1'} onClick={()=>setClearAllButton(clearAllButton+1)}><span className={'icon-eraser'}/> {t('millionaire.lotto.buttons.clearAll')}</button>
                      <button className={'btn-button bgSecondColor text-black d-table mx-1'} onClick={()=>setShuffleAllButton(shuffleAllButton+1)}><span className={'icon-shuffle2 '}/> {t('millionaire.lotto.buttons.quickPickAll')}</button>
                      <button className={'btn-button bgSecondColor text-black d-table mx-1'} onClick={()=>addBundle(millionareInfo.qty)}>
                          <span className={'icon-plus '}/> {t('millionaire.lotto.buttons.addBundle')}
                      </button>
                  </div>
              </div>
              {millionareInfo.qty > 0
                  ? <div className="td-lotto-body-bundles position-relative px-2">
                      {/* <Swiper
                        spaceBetween={30}
                        width={setNum(millionLinesInfo.lines_per_bundle)}
                        freeMode={true}
                        modules={[FreeMode, Pagination]}
                      >
                          {maxBundlesWithIds.map(bundle=>
                              <SwiperSlide key={bundle.id}>
                                  <LuckyNumbersWrapper
                                      selectedLines={bundle.selectedLines}
                                      checkCardEmpty={checkCardEmpty}
                                      luckyCounter={luckyNumbersCounter}
                                      saveNumbers={saveNumbers}
                                      removeBundle={removeBundle}
                                      wrapperId={bundle.id}
                                      maxLuckyCards={maxLuckyCards}
                                      shuffleAllButton={shuffleAllButton}
                                      clearAllButton={clearAllButton}
                                  />
                              </SwiperSlide>
                          )}
                      </Swiper> */}
                      <div className='d-flex flex-wrap'>
                          {
                              maxBundlesWithIds.map(bundle =>
                                  <div className='swiper-block position-relative mx-2' key={bundle.id}>
                                      <LuckyNumbersWrapper
                                          checkCardEmpty={checkCardEmpty}
                                          luckyCounter={luckyNumbersCounter}
                                          saveNumbers={saveNumbers}
                                          removeBundle={removeBundle}
                                          wrapperId={bundle.id}
                                          maxLuckyCards={maxLuckyCards}
                                          shuffleAllButton={shuffleAllButton}
                                          clearAllButton={clearAllButton}
                                      />
                                  </div>
                              )
                          }
                      </div>
                  </div>
                  : <EmptyData data={{text : 'Add bundle to continue'}} />
              }
          </div>
          <div className="td-lotto-footer d-flex align-items-center justify-content-between mb-5">
            <button className={'btn-button bgMainColor text-white'} onClick={()=>router.push('/')}>{t('millionaire.lotto.buttons.continueShopping')}</button>
            <button className={'btn-button bgMainColor text-white'} disabled={isLoading} onClick={checkAndSaveAllNumbers}>
                {isLoading
                    ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
                    : <span>{t('millionaire.lotto.buttons.viewCart')}</span>
                }
            </button>
          </div>
      </div>
  )
}