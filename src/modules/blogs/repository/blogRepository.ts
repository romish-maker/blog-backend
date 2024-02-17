import { blogsCollection } from '../../../app/config/db'
import {BlogInputModel} from "../models/BlogInputModel";
import {BlogViewModel} from "../models/BlogViewModel";

export const blogRepository = {
    async getAllBlogs() {
        return blogsCollection.find({}).toArray()
    },
    async getBlogById(blogId: string) {
        return blogsCollection.findOne({ id: blogId })
    },
    async createNewBlog(payload: BlogInputModel): Promise<BlogViewModel> {
        const newBlog = {
            id: String(Date.now()),
            isMembership: false,
            createdAt: new Date().toISOString(),
            ...payload,
        }

        await blogsCollection.insertOne({ ...newBlog })
        return newBlog
    },
    async updateBlogById(blogId: string, payload: BlogInputModel) {
        const updatedResult = await blogsCollection.updateOne({ id: blogId }, { $set: {
                name: payload.name,
                description: payload.description,
                websiteUrl: payload.websiteUrl,
            }})

        return Boolean(updatedResult.matchedCount)
    },
    async deleteBlogById(blogId: string) {
        const deleteResult = await blogsCollection.deleteOne({ id: blogId })

        return Boolean(deleteResult.deletedCount)
    }
}