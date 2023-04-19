import { InputSelect } from "../../Inputs/InputSelect";

export const EnquiryDetails = () => {

    const genderOptions = [
        {label: 'Payment In Cash', value: 'Payment In Cash'},
        {label: 'Cash', value: 'Cash'},
        {label: 'Visa', value: 'Visa'},
    ]
    
    return (
        <div className="mb-2">
            <div className="d-flex align-items-center justify-content-between my-2">
                <h6 className="m-0">Name : </h6>
                <span>Mitchell C. Shay</span>
            </div>
            <div className="d-flex align-items-center justify-content-between my-2">
                <h6 className="m-0">Phone : </h6>
                <span>+971 524163789</span>
            </div>
            <div className="d-flex align-items-center justify-content-between my-2">
                <h6 className="m-0">Email : </h6>
                <span>rrr.aaa@gmail.com</span>
            </div>
            <div className="d-flex align-items-center justify-content-between my-2">
                <h6 className="m-0">Merachant : </h6>
                <span>Salon</span>
            </div>
            <div className="d-flex align-items-center justify-content-between my-2">
                <h6 className="m-0">Package : </h6>
                <span>Basic</span>
            </div>
            <div className="d-flex align-items-center justify-content-between my-2">
                <h6 className="m-0">Delivery time : </h6>
                <span>2 days</span>
            </div>
            <div className="d-flex align-items-center justify-content-between my-2">
                <h6 className="m-0">Status : </h6>
                <span className="text-warning">Pending</span>
            </div>

            <div className="py-2 my-3 border-top border-bottom">

                <h6 className="">Change Status</h6>

                <div className='my-2 d-flex align-items-center'>

                    <label className="check-box d-flex align-items-center mt-2">
                        <input type="radio" name="radio" />
                        <span className="checkmark"></span>
                        <strong className='fw-light mx-2'>Accept</strong>
                    </label>

                    <label className="check-box d-flex align-items-center mt-2 mx-3">
                        <input type="radio" name="radio" />
                        <span className="checkmark"></span>
                        <strong className='fw-light mx-2'>Reject</strong>
                    </label>

                </div>

            </div>

            <div className="select-add mb-3">
                <label className='mb-2 fw-light'>Payment</label>
                <div className="select-add">
                    <InputSelect
                        value={genderOptions.find(c => c.value)}
                        options={genderOptions}
                        placeholder={'select'}
                    />
                </div>
            </div>

        </div>
    )

}