import {LuckyNumbersCard} from "../LuckyNumbersCard";
import {useEffect, useState} from "react";

export const LuckyNumbersWrapper = ({selectedLines,luckyCounter,checkCardEmpty,saveNumbers,maxLuckyCards,shuffleAllButton,clearAllButton,wrapperId,removeBundle,...props}) => {
    const [shuffleWrapper,setShuffleWrapper] = useState(0)
    const [isDeleting,setIsDeleting] = useState(false)
    const [luckyBundle,setLuckyBundle] = useState([])
    const updateBundle = (arr1,arr2) => {
        setLuckyBundle(prevState => [...prevState,{numbers5:arr1,numbers2: arr2}])
    }
    const deleteBundle = () => {
        setIsDeleting(true)
        removeBundle(wrapperId).then(()=>setIsDeleting(false))
    }
    useEffect(()=>{
        if (luckyCounter !== 0){
            if (saveNumbers) saveNumbers(luckyBundle.slice(luckyBundle.length-2))
        }
    },[luckyBundle])
    return (
        <div className="td-lotto-body-bundles-wrapper position-relative d-flex align-items-center justify-content-center" {...props}>
            <div className='control-icon d-flex align-items-center justify-content-end'>
                <button className='bg-transparent icon-shuffle2 fs-5 mainColor mx-2' onClick={()=>setShuffleWrapper(shuffleWrapper+1)}/>
                <button className='bg-transparent mainColor mx-2' onClick={deleteBundle}>
                    {isDeleting
                        ? <span className={'fs-5 spinner-border spinner-border-sm'}/>
                        : <span className={'icon-bin fs-5 '}/>
                    }
                </button>
            </div>
            {
                maxLuckyCards.map(lucky =>
                    <div className={'td-lotto-body-bundles-wrapper-card'} key={lucky}>
                        <LuckyNumbersCard
                            checkCardEmpty={checkCardEmpty}
                            luckyCounter={luckyCounter}
                            saveNumbers={updateBundle}
                            callShuffleWrapper={shuffleWrapper}
                            callShuffleFunction={shuffleAllButton}
                            callClearFunction={clearAllButton}/>
                    </div>
                )
            }
        </div>
        )
}
