import {v4 as uuidv4} from "uuid";

export const InputToggle = ({isChecked, children,...props}) => {
    const id = uuidv4();
    return (
        <div className={'td-input-toggle'}>
            <input
                type={"checkbox"}
                {...props}
                id={id}
                checked={isChecked}
            />
            <label htmlFor={id} className='td-label mx-auto'>
                <span className='td-circle'/>
                <span className="td-tag">
                    <span className="td-on">ON</span>
                    <span className="td-off">OFF</span>
                    <span className="td-dis">DIS</span>
                </span>
                {children}
            </label>
        </div>
    )
}