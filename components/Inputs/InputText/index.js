import inputStyles from './InputText.module.scss'
import {forwardRef, useState} from "react";

export const InputText = forwardRef(({
    withSelect          = false,
    passWordIcon        = false,
    placeholder         = '',
    type                = 'text',
    label               = '',
    hasError            = false,
    errorMessage        = '', ...props }, ref) => {

        
    const [ showPassword, setShowPassword] = useState(false);

    return (
        <div className={`${inputStyles.td_input_wrapper} ${withSelect && inputStyles.td_input_with_select} ${(errorMessage || hasError) && inputStyles.td_input_error}`}>
            {
                label && 
                <label className='fw-light mb-2'>
                    {label}
                </label>
            }
            <div className={`${inputStyles.td_input} ${showPassword && inputStyles.td_input_show_password}`}>
                <input placeholder={placeholder} ref={ref} type={showPassword ? 'text' : type} {...props}/>
                {
                    passWordIcon && 
                    <span 
                        className={showPassword ? 'icon-eye-off' : 'icon-eye'} 
                        onClick={()=>setShowPassword(!showPassword)}
                    />
                }
            </div>
            {
                errorMessage && 
                    <small className='text-danger'>
                        {errorMessage}
                    </small>
            }
        </div>
    )
})