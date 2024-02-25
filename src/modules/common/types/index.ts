export interface RequestBody<B> extends Express.Request {
    body: B
}

export interface RequestParams<P> extends Express.Request {
    params: P
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