
export const AddressListModalForm = ({addressData,updateSelectedAddress,...props}) => {
    return (
        <div className={'td_address_modal'}>
            {addressData.map(address=>
                <div key={address.id} className={'td_modal_address_wrapper'}>
                    <div className="td_address_wrapper_desc">
                        <button onClick={()=>updateSelectedAddress(address)} className="bg-transparent w-100 d-flex align-items-center justify-content-between border-main p-2 rounded-2 my-3">
                            <div className="d-flex align-items-center">
                                <h5 className="td_address_wrapper_title m-0 fw-light me-3">{t('boooking.address')}</h5>
                                <p className={'my-2'}>{address.building_name}</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}