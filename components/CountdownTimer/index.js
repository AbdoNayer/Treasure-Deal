import {useEffect, useState} from "react";


export const CountdownTimer = ({date}) => {
    const calculateTimeLeft = () => {
        const year = new Date().getFullYear();
        const difference = +new Date(date) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60) || 0
            };
        }
        return timeLeft;
    }
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const id = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => {
            clearTimeout(id);
        };
    });
    const timerComponents = Object.keys(timeLeft).map((interval,idx) => {
        return (
            <div key={idx} className={'d-flex flex-column align-items-center mx-2 text-white'}>
                <span className="fw-light">{interval}</span> <h3 className="fw-bold">{timeLeft[interval] || 0}</h3>
            </div>
        );
    });
    return (
        <div>
            {timerComponents.length ? <div className={'d-flex'}>{timerComponents}</div> : <div>All done</div>}
        </div>
    )
}