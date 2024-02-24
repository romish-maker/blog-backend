import {WithId} from "mongodb";
import {BlogDbType} from "../db/blog-db";
import {BlogViewModel} from "../models/BlogViewModel";

export const blogMapper = (blog: WithId<BlogDbType>): BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        isMembership: blog.isMembership,
        createdAt: blog.createdAt
    }
}