import {ResultToRouterStatus} from "../enums/ResultToRuterStatus";

export interface RequestBody<B> extends Express.Request {
    body: B
}

export interface RequestParams<P> extends Express.Request {
    params: P
}

export interface RequestParamsQuery<P, Q> extends Express.Request {
    params: P
    query: Q
}

export interface RequestParamsBody<P, B> extends Express.Request {
    params: P
    body: B
}

export interface RequestQuery<Q> extends Express.Request {
    query: Q
}

export interface RequestQueryParams<Q, P> extends Express.Request {
    query: Q
    params: P
}

export type PaginationQuery = {
    pageNumber?: number
    pageSize?: number
}

export type SortQuery = {
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
}

export type PaginationAndSortQuery = PaginationQuery & SortQuery

export type ResultToRouter<T = null> = {
    status: ResultToRouterStatus
    errorMessage?: string
    data: T
}