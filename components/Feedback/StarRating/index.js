import {useState} from "react";

export const StarRating = ({serviceName,setFeedBackData,...props}) => {
    const [rating,setRating] = useState(0);
    const [hover,setHover] = useState(0)
    return (
        <>
            {[...Array(5)].map((star,idx) => {
                idx += 1;
                return (
                    <button
                        key={idx}
                        className={`${idx <= (hover || rating) ? 'icon-star-full' : 'icon-star-empty'} bg-transparent mx-1 fs-5 yallowColor`}
                        onClick={() => {
                            setRating(idx)
                            setFeedBackData(prevState=> (
                                {
                                    ...prevState,
                                    [serviceName]:idx
                                }
                            ))
                        }}
                        onMouseEnter={() => setHover(idx)}
                        onMouseLeave={() => setHover(rating)}
                    />
                )
            })}
        </>
    )
}