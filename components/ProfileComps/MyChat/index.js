import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const MyChat = ({...props}) =>  {
    const langVal                                       = useSelector((state) => state.language.language);
    const user                                          = useSelector((state) => state.user.user);
    const currency                                      = useSelector((state) => state.currency.currency);

    const [currentFilter,setCurrentFilter]              = useState('')
    const { t }     = useTranslation();


    return (
        <div className="">
            MyChat
        </div>
    )
}