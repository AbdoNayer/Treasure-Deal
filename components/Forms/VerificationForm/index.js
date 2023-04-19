export const VerificationForm = ({titleMessage = '', disclaimerMessage = '',children}) => {
    return (
        <div className='verification_container bx-shadow'>
            {
                titleMessage && 
                    <h4 className='text-center my-5 fw-light'>
                        {titleMessage}
                    </h4>
            }
            <div className='text-center'>
                {children}
            </div>
            {
                disclaimerMessage && 
                    <p className='disclaimer fw-light p-3 mt-5 mb-0 mx-3'>
                        {disclaimerMessage}
                    </p>
            }
        </div>
    )
}