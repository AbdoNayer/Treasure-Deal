import {ComponentPropsWithRef} from "react";

type sortingMode = "ASCENDING" | "DESCENDING" | "UNSORTED";
type sortableFieldHeaderProps = {
    mode?: sortingMode,
} & ComponentPropsWithRef<"th">;

export const SortableFieldHeader = ({mode,children,...props}:sortableFieldHeaderProps) => {
    return (
        <th {...props}>
            {children}
            {mode==='UNSORTED'
                ? <span className={'icon-sort'} />
                : (mode==='ASCENDING'
                    ? <span className={'icon-up-sort'} />
                    : <span className={'icon-down-sort'} />
                )}
        </th>
    )
}