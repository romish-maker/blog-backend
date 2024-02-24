import {WithId} from "mongodb";
import {PostDbType} from "../db/post-db";
import {PostViewModel} from "../models/PostViewModel";

export const postsMapper = (post: WithId<PostDbType>): PostViewModel => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}