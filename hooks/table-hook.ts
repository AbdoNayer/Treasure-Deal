import {ChangeEvent, useEffect, useState} from "react";

import {queryActions, SearchSelector, selector, selectorFn, useQuery} from './query-hook';
import {uniq} from "lodash";

export type selectOption = { value: string, label: string } | null
//@ts-ignore
export const pipe = (...fns) => fns.reduce((acc,fn)=> (...args)=> fn(acc(...args)))

const getFieldValues = <T extends {}>(selector:selector<T>,objects:T[]) => uniq(objects.map(obj => typeof selector==='string'? obj[selector] : selector(obj)));

const valuesToSelectOptions = (a:string[]) =>
    [{value:"All",label:"All"},...a.map(option => ({value:option,label:option}))]

export const getSelectOptions = pipe(getFieldValues,valuesToSelectOptions);


export const useTable = <T extends {}>(getData:(()=>Promise<T[]>)  | T[]) => {
    const [message, setMessage] = useState('Loading...');
    const {dispatch,filteredObjs,objs,setObjs,getSortingMode,isSortedBy} = useQuery<T>(getData instanceof Function? [] : getData);
    
    const createSearchHandler = (selector:SearchSelector<T>) => (e:ChangeEvent<HTMLInputElement>) => {
      dispatch(queryActions.searchAction({
        value:e.target.value,
        selector,
      }))
    };

    const createFilterHandler = (id:string,selector?:selectorFn<T>) => (selectedOption:selectOption) => {
        if (selectedOption) {
          const {value} = selectedOption;
          if(value === 'All') dispatch(queryActions.removeFilterAction(id)) 
          else {
            dispatch(queryActions.addFilterAction({
              value:value,
              id,
              selector
            }))
          }
        }
    }

    const createSortHandler = (id:string,selector?:selectorFn<T>) => () => {
      if (isSortedBy(id)) dispatch(queryActions.cycleSortAction());
      else  dispatch(queryActions.sortAction({
          id,
          sortingMode:'ASCENDING',
          selector
      }))
    }

    const getOptions = (selector:selector<T>) => getSelectOptions(selector,objs)
    
    useEffect(() => {
        getData instanceof Function && getData().then(objects=>{
            setObjs(objects)
            objs.length === 0 ? setMessage("No results to show") : setMessage('')
        }).catch((e)=>setMessage('Please check your internet connection'))
    }, []);

    useEffect(() => {
        filteredObjs.length === 0 && objs.length > 0 && setMessage('No Results match your search')
    }, [filteredObjs,objs])

    return {
        objs,
        message,
        filteredObjs,
        getSortingMode,
        createSearchHandler,
        createFilterHandler,
        createSortHandler,
        getOptions,
        setObjs
    }
}
