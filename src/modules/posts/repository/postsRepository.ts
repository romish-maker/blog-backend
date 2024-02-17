import {PostInputModel} from "../models/PostInputModel";
import {blogRepository} from "../../blogs/repository/blogRepository";
import {postsCollection} from "../../../app/config/db";

export const postsRepository = {
    async getAllPosts() {
        return postsCollection.find({}).toArray()
    },
    async createNewPost(payload: PostInputModel) {
        const blogData = await blogRepository.getBlogById(payload.blogId)

        if (!blogData) {
            return false
        }

        const newPost = {
            id: String(new Date()),
            title: payload.title,
            shortDescription: payload.shortDescription,
            content: payload.content,
            blogId: payload.blogId,
            blogName: blogData?.name,
            createdAt: new Date().toISOString()
        }

        await postsCollection.insertOne({...newPost})
        return newPost
    },
    async getPostById(postId: string) {
        return await postsCollection.findOne({ id: postId })
    },
    async updatePostById(payload: PostInputModel, postId: string) {
        const foundBlog = await blogRepository.getBlogById(payload.blogId)

        if (!foundBlog) {
            return false
        }

        const updatedResult = await postsCollection.updateOne({ id: postId }, { $set: {
                title: payload.title,
                shortDescription: payload.shortDescription,
                content: payload.content,
                blogId: payload.blogId,
            }})

        return Boolean(updatedResult.matchedCount)
    },
    async deletePostById(postId: string) {
        const deletedResult = await postsCollection.deleteOne({ id: postId })

        return Boolean(deletedResult.deletedCount)
    }
}