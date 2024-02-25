import {blogsCollection} from '../../../app/config/db'
import {BlogViewModel} from "../models/BlogViewModel";
import {blogMapper} from "../mapper/blog-mapper";
import {ObjectId} from "mongodb";
import {Pagination} from "../../../app/models/Pagination";
import {SortDataType} from "../models/QueryBlogInputModel";

export const blogsQueryRepository = {
    async getAllBlogs(queryParams: SortDataType): Promise<Pagination<BlogViewModel>> {
        const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = queryParams
        let filter: Partial<Record<keyof BlogViewModel, any>> = {}

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }

        const foundBlogs = await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await blogsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const mappedBlogs = foundBlogs.map(blogMapper)

        return {
            pageSize,
            pagesCount,
            totalCount,
            page: pageNumber,
            items: mappedBlogs,
        }
    },
    async getBlogById(blogId: string): Promise<BlogViewModel | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(blogId)})

        if (!blog) {
            return null
        }

        return blogMapper(blog)
    },
}