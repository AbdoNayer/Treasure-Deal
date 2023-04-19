import {useEffect, useState} from "react";

export const UploaderMessage = ({maxSize, size, message, ...props}) => {


	return (<div className={size>maxSize ? 'text-danger' : 'mainColor'} {...props}>{message}</div>)
}