export const PrizePolicyRow = ({prizePolicy,drawType,showRaffTicket,showWinners,...props}) => {
    const primaryLuckyNums                          = [...Array(prizePolicy.numbers5_count).keys()]
    const secondaryLuckyNums                        = [...Array(prizePolicy.numbers2_count).keys()]
    return (
        <div className='block-table d-flex align-items-center ite-body' {...props}>
            <div className={`lis-number active d-flex align-items-center w-50 in-ip ${drawType!=='mill' && 'justify-content-center'}`}>
                {drawType==='mill'
                    ? <>
                        {primaryLuckyNums.map(num=> <span className="text-white" key={num}/>)}
                        {secondaryLuckyNums.map(num=> <span className="text-white" key={num}/>)}
                    </>
                    : <div className={'fs-5'}>{prizePolicy.ticket_ranking_text}</div>
                }

            </div>
            <div className='tim-title d-flex align-items-center justify-content-center w-50 in-ip'>
                {drawType==='mill'
                    ? <h4 className='m-0'>{parseInt(prizePolicy.prize).toLocaleString()} AED</h4>
                    : <h4 className='m-0'>{!showRaffTicket ? (parseInt(prizePolicy.prize).toLocaleString()+' AED') : ('TD- '+prizePolicy.ticket.join(''))}  </h4>
                }
            </div>
            {showWinners && <div className='tim-title d-flex align-items-center justify-content-center w-50 in-ip'>
                <h4 className='m-0'>{prizePolicy.winners_count}</h4>
            </div>}
        </div>
    )
}