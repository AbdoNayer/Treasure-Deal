import {useState} from "react";

export const RaffellionaireCartTicket = ({item,deleteLine}) => {
    const [isDeleting,setIsDeleting] = useState(false)

    const deleteWithLoading = () =>{
        setIsDeleting(true)
        deleteLine(item[1].id, item[0]).then(()=>{
            setIsDeleting(false)
        })
    }
  return (
      <tr key={item[1].id}>
          <td className='fw-light fs-6'>{item[1].id}</td>
          <td className='fw-light fs-6'>{item[1].ticket}</td>
          <td>
              <button onClick={deleteWithLoading}>
                  {isDeleting
                      ? <span className={'fs-5 spinner-border spinner-border-sm'}/>
                      : <span className={'icon-trash-2 fs-4 mainColor fw-light'}/>
                  }
              </button>
          </td>
      </tr>
  )
}