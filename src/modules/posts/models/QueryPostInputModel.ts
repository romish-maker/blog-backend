import {SortDirection} from "mongodb";

export type QueryPostInputModel = {
    sortBy: string;
    sortDirection: SortDirection;
    pageNumber: number;
    pageSize: number;
}