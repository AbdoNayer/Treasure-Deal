import {PrizePolicyTable} from "../../PrizePolicyTable";

export const DrawResultDetails = ({
                                      detailsDescription,
                                      detailsData,
                                      detailsType,
                                      ...props}) => {
    return (
        <div className='details-voucher'>
            <p>{detailsDescription}</p>
            <div className='row'>
                <div className={`${detailsType==='mill' ? 'col-md-6 col-xs-12' : 'col-7 mx-auto'}`}>
                    <div className='block-checked bgGrayColor old-shadow rounded-3 p-5 text-center my-4'>
                        <h5 className='fw-light mb-5'>DRAW {detailsData.draw.date}</h5>
                        <div className='lis-number d-flex align-items-center justify-content-center my-4'>
                            {detailsType === 'mill'
                                ? <>
                                    {detailsData.draw.numbers5.map(num=> <span className="text-black" key={num}>{num}</span>)}
                                    {detailsData.draw.numbers2.map(num=> <span className="text-black" key={num}>{num}</span>)}
                                </>
                                : <div className={'fs-3 fw-bold'}>TD-{detailsData.draw.ticket}</div>
                            }

                        </div>
                        <div className='d-flex align-items-center justify-content-between px-3 w-75 m-auto'>
                            <h6 className='fw-light'>Draw Series:</h6>
                            <h6 className='fw-light'>{detailsData.draw.series}</h6>
                        </div>
                        {detailsType==='mill' && <div className='text-center mt-5'>
                            <h4>Total Winners</h4>
                            <h4 className='mainColor'>{detailsData.draw.winners_count}</h4>
                        </div>}
                    </div>
                </div>
                {detailsType==='mill' && <div className='col-md-6 col-xs-12'>
                    <div className='bgMainColor old-shadow rounded-3 p-5 text-center my-4'>
                        <div className='my-4'>
                            <h5 className='fw-light text-white my-4'>RAFFLE DRAW WINNERS</h5>
                            <h5 className='fw-light text-white'>10000.00 AED EACH</h5>
                        </div>
                        <div className='my-5'>
                            <h6 className='fw-light text-white my-3'>1. Raffle ID: #4291240</h6>
                            <h6 className='fw-light text-white my-3'>2. Raffle ID: #3291245</h6>
                            <h6 className='fw-light text-white my-3'>3. Raffle ID: #4292548</h6>
                            <h6 className='fw-light text-white my-3'>4. Raffle ID: #4392250</h6>
                        </div>
                    </div>
                </div>}
            </div>

            <div className='my-5'>
                <PrizePolicyTable
                    showWinners={detailsType==='mill'}
                    showRaffTicket={detailsData!=='mill'}
                    drawType={detailsType}
                    prizes={detailsType==='mill' ? detailsData.prize_matchings : detailsData.winners}
                />
            </div>

            {/*<div className='my-5'>*/}
            {/*    <BuyTicketsComp*/}
            {/*        drawType={detailsData}*/}
            {/*        grandPrize={25000000.00}*/}
            {/*    />*/}
            {/*</div>*/}

        </div>
    )
}