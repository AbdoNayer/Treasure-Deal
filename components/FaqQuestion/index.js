import {useState} from "react";

export const FaqQuestion = ({title,description,...props}) => {
    const [showDescription,setShowDescription] = useState(false)
    return (
        <div className={'td_faq_question my-4'} {...props}>
            <div className="td_title_wrapper d-flex align-items-center justify-content-between" onClick={()=>setShowDescription(!showDescription)}>
                <h6 className="m-0 w-100 text-start">{title}</h6>
                <span className={'td_collapse d-flex align-items-center justify-content-center mainColor'}>{showDescription ? '-' : '+'}</span>
            </div>
            {showDescription && <div className="td_description text-start my-2 p-2">
                {description}
            </div>}
        </div>
    )
}