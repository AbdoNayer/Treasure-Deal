import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Toastify from "toastify-js";
import {t} from "i18next";

export type ApiError = {type:"no-connection" | "bad-request"} | null

export function useApi<T>(apiCall: () => Promise<T>,waitQuery=true) {
	
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<ApiError>(null);
	const [data, setData] = useState<T>();
	// @ts-ignore
	const langVal = useSelector((state) => state.language.language);

	const fetchData = (apiCall: () => Promise<T>) => {
		setIsLoading(true);
		setError(null);
		apiCall().then((data) => {
			setData(data);
			setIsLoading(false);
		}).catch((e) => {
			setIsLoading(false);
			setError(e.message === "Network Error"? {type:"no-connection"} : {type:"bad-request"});
			Toastify({
				text: t("auth.warningMsg"),
				duration: 3000,
				gravity: "top",
				position: langVal === 'en' ? "left" : "right",
				style: {
					background: "#F00",
				}
			}).showToast();
		})
	}
	const reFetch = (newApiCall?: () => Promise<T> ) =>{
		fetchData(newApiCall || apiCall)
	}
	useEffect(() => {
		if (waitQuery) {
			fetchData(apiCall);
		}
	},[])
	
	return{
		isLoading,
		error,
		data,
		reFetch
	}
}