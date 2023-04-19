import {ItemResult} from "../../index";

export const PreviousDraws = ({previousDraw,drawType,...props}) => {
    return (
        <>
            {previousDraw.map(draw=>
                <div className='col-md-4 col-xs-12' key={draw.id}>
                    <ItemResult drawDetails={draw} drawType={drawType} />
                </div>
            )}
        </>
    )
}