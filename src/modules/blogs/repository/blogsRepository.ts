import { blogsCollection } from '../../../app/config/db'
import {ObjectId} from "mongodb";
import {BlogInputModel} from "../models/BlogInputModel";
import {BlogDbType} from "../db/blog-db";

export const blogsRepository = {
    async createNewBlog(payload: BlogDbType): Promise<string> {
        const response = await blogsCollection.insertOne(payload)

        return response.insertedId.toString()
    },
    async getBlogById(blogId: string): Promise<BlogDbType | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(blogId)})

        if (!blog) {
            return null
        }

        return blog
    },
    async updateBlog(blogId: string, payload: BlogInputModel): Promise<boolean> {
        const updateResult = await blogsCollection.updateOne({_id: new ObjectId(blogId)}, {
            $set: {
                name: payload.name,
                description: payload.description,
                websiteUrl: payload.websiteUrl
            }
        })

        return Boolean(updateResult.matchedCount)
    },
    async deleteBlog(blogId: string): Promise<boolean> {
        const deleteResult = await blogsCollection.deleteOne({ _id: new ObjectId(blogId) })

        return Boolean(deleteResult.deletedCount)
    }
}