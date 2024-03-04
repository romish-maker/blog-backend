export type QueryUserInputModel = {
    sortBy: string;
    sortDirection: string;
    pageNumber: number;
    pageSize: number;
    searchLoginTerm?: string | null
    searchEmailTerm?: string | null
}