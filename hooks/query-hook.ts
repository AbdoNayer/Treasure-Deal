import {useEffect, useReducer, useState} from "react"

//#region types
type SortFilterValue = string | number | Date | boolean
type SearchValue = string | number
export type selectorFn<T extends {}> = (obj: T) => SortFilterValue;
export type selector<T extends {}> = selectorFn<T> | string;
export type SearchSelectorFn<T extends {}> = (obj: T) => SearchValue;
export type SearchSelector<T extends {}> = SearchSelectorFn<T> | string;
export type sortingMode = "ASCENDING" | "DESCENDING" | "UNSORTED";
type filterObject<T extends {}> = { selector?: selectorFn<T>, value: SortFilterValue, id: string }
type filterFn<T extends {}> = (obj: T) => boolean;
type searchObject<T extends {}> = { selector: SearchSelector<T>, value: SearchValue }
type sortObject<T extends {}> = { selector?: selectorFn<T>, sortingMode: sortingMode, id: string }
//ACTIONS
type searchAction<T extends {}> = {
    type: "SEARCH_ACTION",
    payload: searchObject<T>
}
type clearSearchAction = {
    type: "CLEAR_SEARCH_ACTION",
}
type sortAction<T extends {}> = {
    type: "SORT_ACTION",
    payload: sortObject<T>
}
type cycleSort = {
    type: "CYCLE_SORT_ACTION",
}
type clearSortAction = {
    type: "CLEAR_SORT_ACTION",
}
type addFilterAction<T extends {}> = {
    type: "ADD_FILTER_ACTION",
    payload: filterObject<T>
}
type removeFilterAction = {
    type: "REMOVE_FILTER_ACTION",
    payload: string
}
type queryAction<T extends {}> =
    searchAction<T>
    | clearSearchAction
    | sortAction<T>
    | cycleSort
    | clearSortAction
    | addFilterAction<T>
    | removeFilterAction;
//STATE
type queryState<T extends {}> = {
    search: searchObject<T>,
    sort: sortObject<T>,
    filters: { [key: string]: filterObject<T> }
}
//#endregion types

//Reducer
// const initialQuery:queryState = {
//     search:{selector:'',value:''},
//     sort:{ id:'',sortingMode:"UNSORTED"},
//     filters:{},
// }
const tableQueryReducer = <T extends {}>() => (query: queryState<T>, action: queryAction<T>): queryState<T> => {
    switch (action.type) {
        case "SEARCH_ACTION":
            return {...query, search: action.payload};
        case "CLEAR_SEARCH_ACTION":
            return {...query, search: {...query.search, value: ''}};
        case "SORT_ACTION":
            return {...query, sort: action.payload};
        case "CYCLE_SORT_ACTION":
            return {
                ...query, sort: {
                    ...query.sort, sortingMode: query.sort.sortingMode === "ASCENDING" ? "DESCENDING"
                        : (query.sort.sortingMode === "DESCENDING" ? "UNSORTED" : "ASCENDING")
                }
            };
        case "CLEAR_SORT_ACTION":
            return {...query, sort: {...query.sort, sortingMode: "UNSORTED"}};
        case "ADD_FILTER_ACTION":
            return {...query, filters: {...query.filters, [action.payload.id]: action.payload}};
        case "REMOVE_FILTER_ACTION":
            delete query.filters[action.payload];
            return {...query};
        default:
            return query;
    }
}

//#region actions creators
export const queryActions = {
    searchAction: <T extends {}>(searchObject: searchObject<T>): searchAction<T> => ({
        type: "SEARCH_ACTION",
        payload: searchObject
    }),
    clearSearchAction: (): clearSearchAction => ({type: "CLEAR_SEARCH_ACTION"}),
    sortAction: <T extends {}>(sortObject: sortObject<T>): sortAction<T> => ({
        type: "SORT_ACTION",
        payload: sortObject
    }),
    cycleSortAction: (): cycleSort => ({type: "CYCLE_SORT_ACTION"}),
    clearSortAction: (): clearSortAction => ({type: "CLEAR_SORT_ACTION"}),
    addFilterAction: <T extends {}>(filterObject: filterObject<T>): addFilterAction<T> => ({
        type: "ADD_FILTER_ACTION",
        payload: filterObject
    }),
    removeFilterAction: (id: string): removeFilterAction => ({type: "REMOVE_FILTER_ACTION", payload: id}),
}
//#endregion action creators

const compareExact = (a: SortFilterValue, b: SortFilterValue) => typeof a === "string" && typeof b === "string"
    ? a.toLowerCase() === b.toLowerCase()
    : a instanceof Date && b instanceof Date
        ? a.getTime() === b.getTime()
        : a === b;
// @ts-ignore
const startWith = (a: SearchValue, b: SearchValue) => a.toString().toLowerCase().startsWith(b.toString().toLowerCase());
// @ts-ignore
const includes = (a: SearchValue, b: SearchValue) => a.toString().toLowerCase().includes(b.toString().toLowerCase());
const combineFilters = <T extends {}>(filters: filterObject<T>[]): filterFn<T> =>
    filters.reduce<filterFn<T>>((acc: filterFn<T>, filter) =>
        (obj: T): boolean => acc(obj) && compareExact((filter.selector && filter.selector(obj)) || obj[filter.id], filter.value), () => true)
const searchFilter = <T extends {}>(searchObject: searchObject<T>): filterFn<T> => (obj: T): boolean => typeof searchObject.selector === "string"
    ? includes(obj[searchObject.selector], searchObject.value)
    : includes(searchObject.selector(obj), searchObject.value);
const prepareSortField = (a: SortFilterValue): SortFilterValue => typeof a === 'string' ? a.toLowerCase() : a;
const sortCompare = (sortingMode: sortingMode) =>
    (a: SortFilterValue, b: SortFilterValue) => sortingMode === 'ASCENDING'
        ? prepareSortField(a) > prepareSortField(b)
        : (sortingMode === 'DESCENDING' ? prepareSortField(b) > prepareSortField(a) : 0);
const sortingFunction = <T extends {}>(sortObject: sortObject<T>) =>
    (a: T, b: T) =>
        sortObject.selector
            ? (sortCompare(sortObject.sortingMode)(sortObject.selector(a), sortObject.selector(b)) ? 1 : -1)
            : (sortCompare(sortObject.sortingMode)(a[sortObject.id], b[sortObject.id]) ? 1 : -1)

export const useQuery = <T extends {}>(objsArray: T[]) => {
    const [objs, setObjs] = useState(objsArray);
    const [filteredObjs, setFilteredObjs] = useState(objsArray);
    const initialQuery: queryState<T> = {
        search: {selector: '', value: ''},
        sort: {id: '', sortingMode: "UNSORTED"},
        filters: {},
    }
    const [query, dispatch] = useReducer(tableQueryReducer<T>(), initialQuery);
    const getSortingMode = (id: string): sortingMode => id === query.sort.id ? query.sort.sortingMode : "UNSORTED";
    const isSortedBy = (id: string): boolean => id === query.sort.id;
    useEffect(() => {
        // @ts-ignore
        const filters: filterObject<T>[] = Object.values(query.filters);
        let newObjArray = [...objs];
        filters.length > 0 && (newObjArray = newObjArray.filter(combineFilters(filters)));
        query.search.value !== '' && (newObjArray = newObjArray.filter(searchFilter(query.search)));
        query.sort.sortingMode !== 'UNSORTED' && (newObjArray.sort(sortingFunction(query.sort)))
        setFilteredObjs(newObjArray);
    }, [query, objs])

    return {
        setObjs,
        filteredObjs,
        objs,
        dispatch,
        getSortingMode,
        isSortedBy
    }
}