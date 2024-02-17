import { blogsCollection } from '../../../app/config/db'
import {BlogInputModel} from "../models/BlogInputModel";
import {BlogViewModel} from "../models/BlogViewModel";

export const blogsRepository = {
    async getAllBlogs() {
        return blogsCollection.find({}).project({ _id: 0 }).toArray()
    },
    async getBlogById(blogId: string) {
        return blogsCollection.findOne({ id: blogId }, { projection: { _id: 0 } })
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
    async updateBlog(blogId: string, payload: BlogInputModel) {
        const updateResult = await blogsCollection.updateOne({ id: blogId }, { $set: {
                name: payload.name,
                description: payload.description,
                websiteUrl: payload.websiteUrl,
            }})

        return Boolean(updateResult.matchedCount)
    },
    async deleteBlog(blogId: string) {
        const deleteResult = await blogsCollection.deleteOne({ id: blogId })

        return Boolean(deleteResult.deletedCount)
    }
}