import {useState} from "react";

export const PartnerInvitationRow = ({invite,deletePartnerInvitation,...props}) => {
    const [isDeleting,setIsDeleting] = useState(false)
    const handleDelete = async () => {
        setIsDeleting(true)
        deletePartnerInvitation(invite)
            .then(()=>setIsDeleting(false))
            .catch((e)=>setIsDeleting(false))
    }
    return (
        <div {...props} className={'row td_table_invitation text-center'}>
            <div className="col-4">
                <h6 className="fw-light">{invite.name}</h6>
            </div>
            <div className="col-4">
                <h6 className="fw-light">{invite.email}</h6>
            </div>
            <div className="col-4" onClick={handleDelete}>
                {isDeleting
                    ? <span className={'fs-5 spinner-border spinner-border-sm mainColor'}/>
                    : <span className="icon-trash-2 mainColor fs-5"/>
                }
            </div>
        </div>
    )
}