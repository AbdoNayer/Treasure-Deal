import {DOTS, usePagination} from "../../hooks/usePagination";

export const Pagination = ({
                               onPageChange,
                               totalCount,
                               siblingCount = 1,
                               currentPage,
                               pageSize,
                               className
}) => {
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    const onNext = () => onPageChange(currentPage + 1);
    const onPrevious = () => onPageChange(currentPage - 1);
    let lastPage = paginationRange[paginationRange.length - 1];

    if (currentPage === 0 || paginationRange.length < 2) return null;

    return (
        <ul
            className={'pagination-container justify-content-end'}
        >
            {/* Left navigation arrow */}
            <li
                className={`pagination-item ${currentPage === 1 && 'disabled'}`}
                onClick={onPrevious}
            >
                <div className="arrow left" />
            </li>
            {paginationRange.map((pageNumber,idx) => {

                // If the pageItem is a DOT, render the DOTS unicode character
                if (pageNumber === DOTS) {
                    return <li key={idx} className="pagination-item dots">&#8230;</li>;
                }

                // Render our Page Pills
                return (
                    <li
                        key={idx}
                        className={`pagination-item ${currentPage === pageNumber && 'selected'}`}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </li>
                );
            })}
            {/*  Right Navigation arrow */}
            <li
                className={`pagination-item ${currentPage === lastPage && 'disabled'}`}
                onClick={onNext}
            >
                <div className="arrow right" />
            </li>
        </ul>
    )
}