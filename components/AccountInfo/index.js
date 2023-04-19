import ButtonMain from "../Inputs/ButtonMain";
import Image from 'next/image';

export const AccountInfo = ({icon,title,subTitle,buttonMessage,description,buttonClick,...props}) => {
    return (
        <div className='td_account_info_wrapper position-relative p-4 mb-4 rounded-3 old-shadow d-flex' {...props}>
            {icon && <div className='td_info_icon'><Image src={icon} width={'70'} height={'70'} alt='icon' className={icon}/></div>}
            <div className="px-4">
                <div className='td_title_wrapper'>
                    <div className={description ? 'td_titles' : 'flex-fill td_titles'}>
                        <div className='td_main_title'>{title}</div>
                        <div className='td_sub_title'>{subTitle}</div>
                    </div>
                    {description && <div className='td_description'>{description}</div>}
                </div>
                {buttonMessage && <ButtonMain onClick={buttonClick}>{buttonMessage}</ButtonMain>}
            </div>
        </div>
    )
}