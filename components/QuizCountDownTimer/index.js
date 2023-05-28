import { useCountdown } from '../../hooks/useCountDown';

const ExpiredNotice = () => {
    return (
        <div className="expired-notice">
            <span className='text-danger fw-bold'>Expired!!!</span>
            {/*<p>Please select a future date and time.</p>*/}
        </div>
    );
};

const DateTimeDisplay = ({ value, type, isDanger }) => {
    return (
        <div className={`${isDanger ? 'countdown danger' : 'countdown'} d-flex align-items-center`}>
            <span className={'mx-1 bgMainColor p-2 rounded-2 btn-circle text-white d-flex align-items-center justify-content-center'}>{value}</span>
            {/* <span className={'mx-1 bgMainColor p-2 rounded-2'}>{type}</span> */}
        </div>
    );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
    return (
        <div className="show-counter d-flex">
            {days > 0 && <>
                <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3}/>
                <p className='mainColor'>:</p>
            </>}
            {hours > 0 && <>
                <DateTimeDisplay value={hours} type={'Hours'} isDanger={false}/>
                <p className='mainColor'>:</p>
            </>}
            {minutes > 0 && <>
                <DateTimeDisplay value={minutes} type={'Minutes'} isDanger={false}/>
                <p className='mainColor'>:</p>
            </>}
                <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
        </div>
    );
};

export const QuizCountDownTimer = ({ targetDate, setIsExpired }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);

    if (days + hours + minutes + seconds <= 0) {
        if (setIsExpired) setIsExpired(true)
        return <ExpiredNotice />;
    } else {
        return (
            <ShowCounter
                days={days}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
            />
        );
    }
};