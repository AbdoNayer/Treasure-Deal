import {useDispatch, useSelector} from "react-redux";
import {hideModalAction} from "../../redux-toolkit/actions";
import {useEffect} from "react";

export const Modal = (props) => {
    const {content,isActive} = useSelector(state=> state.ui);
    const dispatch = useDispatch()
    const handleClick = (e) => e.target === e.currentTarget && dispatch(hideModalAction());
  return (
      <div className={`td-modal ${isActive && 'td-modal-active'}`} onClick={handleClick} {...props}>
          <div className="td-modal-body">{content}</div>
      </div>
  )
}