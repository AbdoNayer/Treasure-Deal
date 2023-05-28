import Image from "next/image";

export const WinningSteps = ({step,index,...props}) => {
    return (
        <div className={`td_winning_step col-md-4 col-xs-12 d-flex my-5 ${index===0 && 'order-0'}`} {...props}>
            <div className="td_step_image me-3">
                <Image width={90} height={90} src={step.image} alt={'winning steps'}/>
            </div>
            <div className="td_step_description_wrapper">
                <div className="td_step_description text-center">
                    Step {index+1}
                </div>
                <div className={'td_step_details'}>
                    {step.description}
                </div>
            </div>
        </div>
    )
}