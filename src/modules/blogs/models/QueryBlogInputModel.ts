import {SortDirection} from "mongodb";

// for presentation level (route)
export type QueryBlogInputModel = {
    searchNameTerm?: string | null;
    sortBy?: string;
    sortDirection?: string;
    pageNumber?: number;
    pageSize?: number;
}

// for query level
export type SortDataType = {
    searchNameTerm: string | null;
    sortBy: string;
    sortDirection: string;
    pageNumber: number;
    pageSize: number;
}

// for presentation level (route)
export type QueryPostInputModel = {
    sortBy?: string;
    sortDirection?: string;
    pageNumber?: number;
    pageSize?: number;
}

// for query level
export type SortDataTypeForSpecificBlog = {
    sortBy: string;
    sortDirection: SortDirection;
    pageNumber: number;
    pageSize: number;
}



