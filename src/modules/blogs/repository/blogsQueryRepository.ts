import {blogsCollection, postsCollection} from '../../../app/config/db'
import {BlogViewModel} from "../models/BlogViewModel";
import {blogMapper} from "../mapper/blog-mapper";
import {ObjectId} from "mongodb";
import {Pagination} from "../../../app/models/Pagination";
import {SortDataType, SortDataTypeForSpecificBlog} from "../models/QueryBlogInputModel";
import {postsMapper} from "../../posts/mapper/posts-mapper";

export const blogsQueryRepository = {
    async getAllBlogs(sortData: SortDataType): Promise<Pagination<BlogViewModel>> {
        const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = sortData

        let filter = {};

        if (searchNameTerm) {
            filter = {
                name: {
                    $regex: searchNameTerm,
                    $options: "i"
                }
            }
        }
        const blogs = await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await blogsCollection.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            pageSize,
            pagesCount,
            totalCount,
            page: pageNumber,
            items: blogs.map(blogMapper),
        }
    },
    async getAllPostsFromSpecificBlog(blogId: string, sortData: SortDataTypeForSpecificBlog) {
        const { sortBy, sortDirection, pageNumber, pageSize } = sortData

        const posts = await postsCollection
            .find({blogId: blogId})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await blogsCollection.countDocuments()

        const pagesCount = Math.ceil(totalCount / pageSize)
        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postsMapper)
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