export type Pagination<I> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: I[]
}