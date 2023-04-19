import {useState} from "react";
import {useRouter} from "next/router";

export const MillionaireTicketCard = ({bundle,editLineClick}) => {
    const router                                            = useRouter();

    return (
      <div className='position-relative'>
          {bundle.map(line=>
                  <div key={line.id} className='d-flex align-items-center mb-3'>
                      <div className='num-lis d-flex align-items-center'>
                          {line.luckynumber5.map((num,idx)=> <span key={idx}>{num}</span>)}
                          {line.luckynumber2.map((num,idx)=> <span key={idx}>{num}</span>)}
                      </div>
                      <button className='icon-edit-3 mainColor mx-2 fs-6' onClick={()=>editLineClick({luckynumber5:line.luckynumber5,luckynumber2:line.luckynumber2},line.id)}/>
                  </div>)
          }

          {/* <div className='d-flex align-items-center justify-content-between mt-3'> */}
              {/*<div className='d-flex align-items-center'>*/}
              {/*    <h5 className='fw-light m-0'>{t('millionaire.cart.RaffelID')}</h5>*/}
              {/*    <span className='mainColor fs-5 mx-2'>9160154767</span>*/}
              {/*</div>*/}
              {/* {bundle[1] && <button className='mainColor ms-auto' onClick={deleteWithLoading}>
                  {isDeleteLoading
                      ? <span className={'fs-5 spinner-border spinner-border-sm'}/>
                      : <span className={' fs-5 icon-trash-2'}/>
                  }
              </button>
              } */}
          {/* </div> */}
      </div>
  )
}