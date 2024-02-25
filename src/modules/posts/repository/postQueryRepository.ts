import {postsCollection} from '../../../app/config/db'
import {PostViewModel} from "../models/PostViewModel";
import {postsMapper} from "../mapper/posts-mapper";
import {ObjectId} from "mongodb";
import {QueryPostInputModel} from "../models/QueryPostInputModel";

export const postsQueryRepository = {
    async getPosts(sortData: QueryPostInputModel, blogId?: string) {
        const sortBy = sortData.sortBy || 'createdAt'
        const sortDirection = ['asc', 'desc'].includes(sortData.sortDirection) ? sortData.sortDirection : 'desc'
        const pageNumber = Number(sortData.pageNumber) || 1
        const pageSize = Number(sortData.pageSize) || 10

        let filter: any = {}

        if (blogId) {
            filter.blogId = blogId
        }

        const foundPosts = await postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await postsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const mappedPosts = foundPosts.map(postsMapper)

        return {
            pageSize,
            pagesCount,
            totalCount,
            page: pageNumber,
            items: mappedPosts,
        }
    },
    async getPostById(postId: string): Promise<PostViewModel | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(postId)})

        if (!post) {
            return null
        }

        return postsMapper(post)
    },
}