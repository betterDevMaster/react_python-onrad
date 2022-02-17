import React, { useState } from "react"

import { Pagination, PaginationItem, PaginationLink } from "reactstrap"

const Paginations = (props) => {
    const pageClick = (e, page) => {
        e.preventDefault()
        handlePage(page)
    }

    const pages = Math.floor(props.count / props.currSizePerPage) + 1
    const pagesToShow = 5
    const firstPageToShow = props.currPage - Math.floor(pagesToShow / 2)
    const firstPage = firstPageToShow < 0 ? 0 : firstPageToShow
    const lastPageToShow = props.currPage + Math.floor(pagesToShow / 2)
    const lastPage = lastPageToShow > pages ? pages : firstPage + pagesToShow
    const displayArray = [...Array(pages).keys()].slice(firstPage, lastPage)

    const handlePage = (index) => {
        if (props.onPageResult) props.onPageResult(index)
    }

    return (
        <Pagination>
            {pages > pagesToShow && props.currPage !== 0 && (
                <PaginationItem>
                    <PaginationLink href="#" onClick={(e) => pageClick(e, 0)}>
                        &laquo;
                    </PaginationLink>
                </PaginationItem>
            )}
            {pages > pagesToShow && props.currPage !== 0 && (
                <PaginationItem>
                    <PaginationLink
                        href="#"
                        onClick={(e) => pageClick(e, props.currPage - 1)}
                    >
                        &lsaquo;
                    </PaginationLink>
                </PaginationItem>
            )}
            {displayArray.map((p) => (
                <PaginationItem active={props.currPage === p} key={p}>
                    <PaginationLink href="#" onClick={(e) => pageClick(e, p)}>
                        {p + 1}
                    </PaginationLink>
                </PaginationItem>
            ))}
            {pages > pagesToShow && props.currPage !== pages - 1 && (
                <PaginationItem>
                    <PaginationLink
                        href="#"
                        onClick={(e) => pageClick(e, props.currPage + 1)}
                    >
                        &rsaquo;
                    </PaginationLink>
                </PaginationItem>
            )}
            {pages > pagesToShow && props.currPage !== pages - 1 && (
                <PaginationItem>
                    <PaginationLink
                        href="#"
                        onClick={(e) => pageClick(e, pages - 1)}
                    >
                        &raquo;
                    </PaginationLink>
                </PaginationItem>
            )}
        </Pagination>
    )
}

export { Paginations }
