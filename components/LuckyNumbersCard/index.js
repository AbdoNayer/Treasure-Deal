import {useEffect, useRef, useState} from "react";
import Toastify from 'toastify-js';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import {showModalAction} from "../../redux-toolkit/actions";
import {ModalForm} from "../ModalForms/ModalForm";
import {SaveLuckyNumbersModalForm} from "../ModalForms/SaveLuckyNumbersModalForm";
import {SelectLuckyNumbersModalForm} from "../ModalForms/SelectLuckyNumbersModalForm";
import _ from 'lodash';

export const LuckyNumbersCard = ({
                                     selectedLines,
                                     checkCardEmpty,
                                     luckyCounter,
                                     saveNumbers,
                                     callClearFunction,
                                     callShuffleFunction,
                                     callShuffleWrapper,
                                     modalMode=false,
                                     callEditFunction,
                                     editCounter=0,
                                     modalFavNums,
                                     favCounter=0,
                                     ...props}) => {

    const { t }                                   = useTranslation();
    const dispatch                                = useDispatch();
    const langVal                                 = useSelector((state) => state.language.language);
    const primaryLuckyNums                          = [...Array(51).keys()].slice(1)
    const secondaryLuckyNums                        = [...Array(13).keys()].slice(1)
    const currency                                          = useSelector((state) => state.currency.currency);
    const [activePrimaryNums,setActivePrimaryNums]      = useState(selectedLines ? selectedLines.luckynumber5 : []);
    const [activeSecondaryNums,setActiveSecondaryNums]  = useState(selectedLines ? selectedLines.luckynumber2 : []);
    const millionLinesInfo                              = useSelector((state) => state.linesMillionair.millionLines);
    const didMount = useRef(false);

    //#region load from favourites
    const saveActiveNums = (arr1,arr2) => {
      setActivePrimaryNums([...arr1].sort((a,b)=> a-b ))
      setActiveSecondaryNums([...arr2].sort((a,b)=> a-b ))
    }
    //#endregion

    //#region favourite numbers
    const addFavourite = () => {
        const luckyNums5 = millionLinesInfo.lucky_numbers.map(num=> num.luckynumber5).map(lucky => lucky.every((elem, idx) => elem === activePrimaryNums[idx]))
        const luckyNums2 = millionLinesInfo.lucky_numbers.map(num=> num.luckynumber2).map(lucky => lucky.every((elem, idx) => elem === activeSecondaryNums[idx]))
        if (activePrimaryNums.length === 5 && activeSecondaryNums.length === 2){
            if (luckyNums5.indexOf(true) !== -1 && (luckyNums5.indexOf(true) === luckyNums2.indexOf(true))) {
                dispatch(showModalAction(
                    <ModalForm title={t('millionaire.lotto.pop_ups.load_favourite.loadFavouriteTitle')}>
                        <SelectLuckyNumbersModalForm saveActiveNums={saveActiveNums}/>
                    </ModalForm>
                ))
            } else {
                dispatch(showModalAction(
                    <ModalForm title={t('millionaire.lotto.pop_ups.save_favorite.saveFavouriteTitle')}>
                        <SaveLuckyNumbersModalForm luckynumber5={activePrimaryNums} luckynumber2={activeSecondaryNums} />
                    </ModalForm>
                ))
            }
        } else {
            if(millionLinesInfo.lucky_numbers.length !== 0){
                dispatch(showModalAction(
                    <ModalForm title={t('millionaire.lotto.pop_ups.load_favourite.loadFavouriteTitle')}>
                        <SelectLuckyNumbersModalForm saveActiveNums={saveActiveNums}/>
                    </ModalForm>
                ))
            }else{
                Toastify({
                    text: t('millionaire.lotto.enterNumbers'),
                    duration: 3000,
                    gravity: "top",
                    position: langVal === 'en' ? "left" : "right",
                    style: {
                      background: "#F00",
                    }
                }).showToast();
            }
        }
    }
    //#endregion

    //#region check favourite icon
    const checkFavouriteIcon = () => {
        const luckyNums5 = millionLinesInfo.lucky_numbers.map(num=> num.luckynumber5).map(lucky => lucky.every((elem, idx) => elem === activePrimaryNums[idx]))
        const luckyNums2 = millionLinesInfo.lucky_numbers.map(num=> num.luckynumber2).map(lucky => lucky.every((elem, idx) => elem === activeSecondaryNums[idx]))
        if (luckyNums5.indexOf(true) !== -1 && (luckyNums5.indexOf(true) === luckyNums2.indexOf(true))) return 'icon-heart1 text-white mx-1'
        else return 'icon-heart text-white mx-1'
    }
    //#endregion

    //#region add numbers
    const addNumber = (str,type) => {
        if (type === 'primary') {
            if (activePrimaryNums.includes(str)) setActivePrimaryNums(prevState => prevState.filter(num=> num!==str).sort((a,b)=>a-b))
            else {
                if (activePrimaryNums.length === 5) {
                    
                    Toastify({
                        text: t('app.numberCompleted'),
                        duration: 3000,
                        gravity: "top",
                        position: langVal === 'en' ? "left" : "right",
                        style: {
                          background: "#F00",
                        }
                    }).showToast();

                } else {
                    setActivePrimaryNums(prevState => [...prevState, str].sort((a,b)=>a-b))
                }
            }
        }
        if (type === 'secondary') {
            if (activeSecondaryNums.includes(str)) setActiveSecondaryNums(prevState => prevState.filter(num=> num!==str).sort((a,b)=>a-b))
            else {
                if (activeSecondaryNums.length === 2) {
                    
                    Toastify({
                        text: t('app.numberCompleted'),
                        duration: 3000,
                        gravity: "top",
                        position: langVal === 'en' ? "left" : "right",
                        style: {
                          background: "#F00",
                        }
                    }).showToast();

                }
                else {
                    setActiveSecondaryNums(prevState => [...prevState, str].sort((a,b)=>a-b))
                }
            }
        }
    }
    //#endregion

    //#region clear numbers
    const clearNumbers = () => {
        setActivePrimaryNums([])
        setActiveSecondaryNums([])
    }
    //#endregion

    //#region shuffle numbers
    const getMultipleRandom = (arr, num) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    }
    const shuffleNumbers = () => {
        setActivePrimaryNums(getMultipleRandom(primaryLuckyNums,5).sort((a,b)=>a-b))
        setActiveSecondaryNums(getMultipleRandom(secondaryLuckyNums,2).sort((a,b)=>a-b))
    }
    //#endregion

    //#region shuffle and clear based on parents
    useEffect(()=>{
        if (callShuffleWrapper) shuffleNumbers()
    },[callShuffleWrapper])
    useEffect(()=>{
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        if (callShuffleFunction !== 0) {
            if (callShuffleFunction) shuffleNumbers()
        }
    },[callShuffleFunction])
    useEffect(()=>{
        if (callClearFunction) clearNumbers()
    },[callClearFunction])
    //#endregion

    useEffect(()=>{
        if (!didMount.current) {
            didMount.current = true;
            return;
        }
        if (luckyCounter !== 0){
            if (checkCardEmpty) checkCardEmpty(activePrimaryNums,activeSecondaryNums)
            if (saveNumbers) saveNumbers(activePrimaryNums,activeSecondaryNums)
        }
    },[luckyCounter])

    useEffect(()=>{
        if (editCounter !== 0) {
            if (callEditFunction) callEditFunction(activePrimaryNums,activeSecondaryNums)
        }
    },[editCounter])

    useEffect(()=>{
        if (favCounter !== 0) {
            if (modalFavNums) saveActiveNums(modalFavNums[0],modalFavNums[1])
        }
    },[favCounter])

  return (
      <div className={'td-lucky-card my-4'} {...props}>
          <div className="td-lucky-card-header bgMainColor text-center">
              <Image style={{ objectFit:"contain" }} width={83} height={22} alt='' src="/img/logo-white.png" />
          </div>
          <div className="td-lucky-card-body position-relative">
            <Image width={100} height={100} alt='' src="/img/logo-grid.png" className="logo-grid" />
              <div className="td-lucky-primary-nums position-relative">
                  <div className="td-lucky-title">
                      {activePrimaryNums.length!==5
                          ? `Choose ${5 - activePrimaryNums.length}`
                          : 'Done'}
                  </div>
                  <div className="td-lucky-nums-wrapper">
                    {primaryLuckyNums.map(num=>
                        <div
                            className={`td-lucky-num ${activePrimaryNums.includes(num) && ' td-active-primary'}`}
                            onClick={()=>addNumber(num,'primary')}
                            key={num}
                        >
                            {num}
                        </div>
                    )}
                  </div>
              </div>
              <div className="td-lucky-secondary-nums position-relative">
                  <div className="td-lucky-title">
                      {activeSecondaryNums.length!==2
                          ? `Choose ${2 - activeSecondaryNums.length}`
                          : 'Done'}
                  </div>
                  <div className="td-lucky-nums-wrapper">
                      {secondaryLuckyNums.map(num=>
                          <div
                              className={`td-lucky-num ${activeSecondaryNums.includes(num) && ' td-active-secondary'}`}
                              key={num}
                              onClick={()=>addNumber(num,'secondary')}
                          >
                              {num}
                          </div>
                      )}
                  </div>
              </div>
          </div>
          <div className="td-lucky-card-footer">

              <span onClick={shuffleNumbers} className='icon-shuffle2 text-white mx-1'/>
              {!modalMode && <span onClick={addFavourite} className={checkFavouriteIcon()}/>}
              <span onClick={clearNumbers} className='icon-eraser text-white mx-1'/>

          </div>
      </div>
  )
}