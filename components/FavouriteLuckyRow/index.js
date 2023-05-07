import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectLinesMillionaire} from "../../redux-toolkit/actions";

export const FavouriteLuckyRow = ({item,deleteLucky,editLucky,...props}) => {
    const [isDeleting,setIsDeleting] = useState(false)
    const dispatch                                          = useDispatch();
    const user                                              = useSelector((state) => state.user.user);
    const langVal                                           = useSelector((state) => state.language.language);
    const currency                                          = useSelector((state) => state.currency.currency);
    const handleDelete = (id) => {
        setIsDeleting(true)
        deleteLucky(id)
            .then(async ()=> {
                await dispatch(selectLinesMillionaire(user.token,langVal,currency))
                setIsDeleting(false)
            })
            .catch((e)=>setIsDeleting(false))
    }
    const handleEdit = () => {
        editLucky({luckynumber5:item.luckynumber5,luckynumber2:item.luckynumber2},item.id,item.name)
    }
    return (
        <tr {...props}>
            <td>{item.name}</td>
            <td>
                <div className="lis-number d-flex justify-content-center align-items-center">
                    {item.luckynumber5.map((item, i)=><span key={i}>{item}</span>)}
                    {item.luckynumber2.map((item, i)=><span key={i}>{item}</span>)}
                </div>
            </td>
            <td>
                <div className="d-flex justify-content-center align-items-center">
                    <button className={'bg-transparent fs-5'} onClick={()=>handleDelete(item.id)}>
                        {isDeleting
                            ? <span className={'spinner-border spinner-border-sm mainColor'}/>
                            : <span className={'icon-bin mainColor '}/>
                        }
                    </button>
                    <button className="icon-edit mainColor bg-transparent fs-5 mx-2" onClick={handleEdit} />
                </div>
            </td>
        </tr>
    )
}