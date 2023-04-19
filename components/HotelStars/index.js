import {useEffect, useState} from "react";

export const HotelStars = ({starsNumber,...props}) => {
    const [stars,setStars] = useState([])
    useEffect(()=>{
        setStars([...Array(starsNumber).keys()])
    },[starsNumber])
    return (
        <div className={'d-flex align-items-center'}>
            {stars.map(star => <span key={star} className={'icon-star-full secondColor fs-4 p-1'}/>)}
        </div>
    )
}