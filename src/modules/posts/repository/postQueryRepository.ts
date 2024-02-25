import {blogsCollection, postsCollection} from '../../../app/config/db'
import {PostViewModel} from "../models/PostViewModel";
import {postsMapper} from "../mapper/posts-mapper";
import {ObjectId} from "mongodb";
import {QueryPostInputModel} from "../models/QueryPostInputModel";
import {Pagination} from "../../../app/models/Pagination";

export const postsQueryRepository = {
    async getAllPosts(sortData: QueryPostInputModel): Promise<Pagination<PostViewModel>> {
        const { sortBy, sortDirection, pageNumber, pageSize } = sortData

        const posts = await postsCollection
            .find({})
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
    async getPostById(postId: string): Promise<PostViewModel | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(postId)})

        if (!post) {
            return null
        }

        return postsMapper(post)
    },
}