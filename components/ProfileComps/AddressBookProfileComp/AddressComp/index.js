import {editAddresses} from "../../../../redux-toolkit/actions/axiosCalls";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {defaultAddressReducer} from "../../../../redux-toolkit/reducer/locationReducer";

export const AddressComp = ({address,handleEdit,handleDelete,refetchAddresses,...props}) => {
    const user                                          = useSelector((state) => state.user.user);
    const langVal                                       = useSelector((state) => state.language.language);
    const [isDeleting,setIsDeleting] = useState(false)
    const [isDefault,setIsDefault] = useState(false)
    const dispatch = useDispatch()
    const currency                                          = useSelector((state) => state.currency.currency);

    const handleDeleteAddress = async () => {
        setIsDeleting(true)
        await handleDelete(address.id)
            .then(()=> {
                setIsDeleting(false)
                refetchAddresses()
            })
            .catch((e)=>setIsDeleting(false))
    }

    const setAsDefault = async () => {
        setIsDefault(true)
        const newAddressData = {
            ...address,
            is_default: 1,
            address_id: address.id,
        }
        await editAddresses(user.token,langVal,currency,newAddressData)
            .then(()=> {
                dispatch(defaultAddressReducer(newAddressData))
                setIsDefault(false)
                refetchAddresses()
            })
            .catch((e)=>setIsDefault(false))
    }

    return (
        <div className={'td_address_comp'}>
            <div className="td_header bgGrayColor px-3 d-flex align-items-center">
                <h6 className="td_default_address fw-light">{address.is_default ? 'Default address' : ''}</h6>
                <div className="td_address_actions ms-auto">
                    <span className="icon-edit-3 mainColor fs-4 mx-3" onClick={()=>handleEdit(address)} />
                    {isDeleting
                        ? <span className={'spinner-border spinner-border-sm mainColor'}/>
                        : <span className="icon-trash-2 mainColor fs-4" onClick={handleDeleteAddress}/>
                    }
                </div>
            </div>
            <div className="td_body row p-3">
                <h5 className="td_lhs col-4 fw-light">Address:</h5>
                <div className="td_rhs col-8 d-flex flex-column">
                    <span>{address.type}</span>
                    <span>{address.apartment_number}</span>
                    <span>{address.floor}</span>
                    <span>{address.building_name}</span>
                    <span>{address.street}</span>
                    <span>{address.country}</span>
                </div>
            </div>
            {!address.is_default && <div className="td_footer d-flex align-items-center justify-content-end p-3">
                <button
                    className={'rounded-2 py-2 text-white bgMainColor w-auto px-4'}
                    onClick={setAsDefault}
                    disabled={isDefault}
                >
                    {isDefault ? <span className={'spinner-border spinner-border-sm text-white'}/> : <>Set as default</>}
                </button>
            </div>}
        </div>
    )
}