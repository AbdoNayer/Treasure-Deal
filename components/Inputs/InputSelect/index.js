import {forwardRef} from "react";
import Select from 'react-select';
import {useSelector} from "react-redux";

// eslint-disable-next-line react/display-name
export const InputSelect = forwardRef(({
            error               = false,
            withInput           = false,
            multi               = false,
            errorMessage        = '',
            label               = '',
            children,
            ...props
        },ref)=>{

    const langVal = useSelector(state=> state.language.language)

    return (
        <div className=''>
            {label && <label className='fw-light mb-2'>{label}</label>}
            <Select ref={ref} {...props} isMulti={multi}
                styles={{
                    placeholder: (baseStyles) =>({
                        ...baseStyles,
                        fontSize: '18px',
                    }),
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        height:'71px',
                        border: `2px solid ${(errorMessage || error) ? '#F65529' : '#ddd'}`,
                        boxShadow: 'none',
                        '&:hover':{
                          borderColor: '#A3159D'
                        },
                        width: withInput ? '150px' : undefined,
                        fontSize: '25px',
                        paddingLeft: langVal!=='ar'?'5px':undefined,
                        paddingRight: langVal==='ar'?'5px':undefined,
                        paddingBottom: '10px',
                        paddingTop: '10px',
                        borderRightStyle: withInput ? (langVal!=='ar'? 'none':undefined) : undefined,
                        borderLeftStyle: withInput ? (langVal==='ar'? 'none':undefined) : undefined,
                        borderTopRightRadius: withInput ? (langVal!=='ar'? 0:undefined) : undefined,
                        borderBottomRightRadius: withInput ? (langVal!=='ar'? 0:undefined) : undefined,
                        borderTopLeftRadius: withInput ? (langVal==='ar'? 0:undefined) : undefined,
                        borderBottomLeftRadius: withInput ? (langVal==='ar'? 0:undefined) : undefined,
                    }),
                    option: (basStyles, state) => ({
                        ...basStyles,
                        backgroundColor: state.isSelected ? '#A3159D' : (state.isFocused ? '#A3159D' : undefined),
                        color: state.isSelected ? '#fff' : (state.isFocused ? '#fff' : '#000'),
                    })
                }}
            />
            {errorMessage && <small className={'text-danger'}>{errorMessage}</small>}
        </div>
    )
})