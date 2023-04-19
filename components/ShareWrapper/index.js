import {
    EmailShareButton,
    FacebookShareButton,
    WhatsappShareButton,
    FacebookMessengerShareButton,
    TwitterShareButton,
    EmailIcon,
    WhatsappIcon,
    FacebookIcon,
    FacebookMessengerIcon,
    TwitterIcon
} from "react-share";

export const ShareWrapper = ({email,whatsApp,facebook,messenger,twitter,url,...props}) => {
    return (
        <div className={'td_share_wrapper'}>
            {email && <EmailShareButton url={url} className={'me-2'}><EmailIcon round size={30}/></EmailShareButton>}
            {whatsApp && <WhatsappShareButton title={'test'} seperator={'---'} url={url} className={'me-2'}><WhatsappIcon round size={30}/></WhatsappShareButton>}
            {facebook && <FacebookShareButton url={url} className={'me-2'}><FacebookIcon round size={30}/></FacebookShareButton>}
            {/*{messenger && <FacebookMessengerShareButton url={url} className={'me-2'}><FacebookMessengerIcon round size={30}/></FacebookMessengerShareButton>}*/}
            {twitter && <TwitterShareButton url={url} className={'me-2'}><TwitterIcon round size={30}/></TwitterShareButton>}
        </div>
    )
}