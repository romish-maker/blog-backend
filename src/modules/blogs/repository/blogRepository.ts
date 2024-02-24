import { blogsCollection } from '../../../app/config/db'
import {BlogViewModel} from "../models/BlogViewModel";
import {blogMapper} from "../mapper/blog-mapper";
import {ObjectId} from "mongodb";
import {BlogInputModel} from "../models/BlogInputModel";
import {BlogDbType} from "../db/blog-db";

export const blogsRepository = {
    async getAllBlogs(): Promise<BlogViewModel[]> {
        const blogs = await blogsCollection.find({}).toArray()

        return blogs.map(blogMapper)
    },
    async getBlogById(blogId: string): Promise<BlogViewModel | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(blogId)})

        if (!blog) {
            return null
        }

        return blogMapper(blog)
    },
    async createNewBlog(payload: BlogDbType): Promise<string> {
        const response = await blogsCollection.insertOne(payload)

        return response.insertedId.toString()
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