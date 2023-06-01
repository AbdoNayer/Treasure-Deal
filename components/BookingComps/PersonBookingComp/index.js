import Image from "next/image";
import {useTranslation} from "react-i18next";

export const PersonBookingComp = ({children,person,selectedEmployees,addSelectedPerson,...props}) => {
    const { t }                                         = useTranslation();

    return (
        <div className="td_person_booking mt-3 old-shadow" {...props}>
            {selectedEmployees.find(service=> service.id === person.id) &&
                <div className="bgMainColor text-white p-1 px-3">
                    <span className={'icon-star-full yallowColor'}/>
                    <strong className="mx-2 fw-light">{t('booking.selected')} {person.type.split('_').join(' ')}</strong>
                </div>
            }
            <div className="rounded-1 p-3">
                <div className='d-flex align-items-start pb-3 fl-col'>
                    <div className="td_img_wrapper">
                        <Image style={{ width: '100%', height: '100%' }} width={70} height={70} alt='logo' src={person.image} />
                    </div>
                    <div className="td_person_details px-3">
                        <h5>{person.name}</h5>
                        <p className="">{person.description}</p>
                        {/*<p className="">Age: {person.age} years old</p>*/}
                        {/*<p className="">years of experience: {person.exp} years</p>*/}
                        {/*<div className='d-flex align-items-center'>*/}
                        {/*    <div className='d-flex align-items-center'>*/}
                        {/*        <i className='icon-info mainColor'></i>*/}
                        {/*        <span className='mx-2'>Double bed</span>*/}
                        {/*    </div>*/}
                        {/*    <div className='d-flex align-items-center mx-3'>*/}
                        {/*        <i className='icon-info mainColor'></i>*/}
                        {/*        <span className='mx-2'>Twin bed</span>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className='d-flex align-items-center justify-content-between pt-3'>
                    <button
                        className={`btn-button w-auto px-4 ${selectedEmployees.find(service=> service.id === person.id) ? 'bgMainColor text-white' : 'bg-transparent text-black border-main border-5'}`}
                        // className={`btn-button w-auto px-4 bgGreenColor text-white`}
                        onClick={()=> addSelectedPerson(person)}
                    >{t('select')}</button>
                    {/*<div className='d-flex align-items-center'>*/}
                    {/*    <span className='mx-3 text-decoration-line-through text-black-50'>AED 600</span>*/}
                    {/*    <h6 className='m-0'>AED 400</h6>*/}
                    {/*</div>*/}
                </div>
                {children}
            </div>
        </div>

    )
}