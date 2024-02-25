import {CreatePostFromBlogInputModel} from "../models/CreatePostFromBlogInputModel";
import {PostViewModel} from "../../posts/models/PostViewModel";
import {blogsRepository} from "../repository/blogsRepository";
import {PostDbType} from "../../posts/db/post-db";
import {postsRepository} from "../../posts/repository/postsRepository";
import {postsQueryRepository} from "../../posts/repository/postQueryRepository";
import {blogsQueryRepository} from "../repository/blogsQueryRepository";
import {BlogInputModel} from "../models/BlogInputModel";
import {BlogDbType} from "../db/blog-db";
import {BlogViewModel} from "../models/BlogViewModel";

export const BlogServices = {
    async createPostToBlog(blogId: string, createPostModel: CreatePostFromBlogInputModel): Promise<PostViewModel | null> {
        const blog = await blogsRepository.getBlogById(blogId)

        if (!blog) {
            return null
        }

        const newPostData: PostDbType = {
            blogId: blogId,
            createdAt: new Date().toISOString(),
            title: createPostModel.title,
            shortDescription: createPostModel.shortDescription,
            content: createPostModel.content,
            blogName: blog.name
        }

        const newPostId = await postsRepository.createPost(newPostData)

        if (!newPostId) {
            return null
        }

        const newPost = await postsQueryRepository.getPostById(newPostId)

        if (!newPost) {
            return null
        }

        return newPost
    },
    async createBlog(createBlogModel: BlogDbType): Promise<BlogViewModel | null> {
        const newBlogId = await blogsRepository.createNewBlog(createBlogModel)

        if (!newBlogId) {
            return null
        }

        const newBlog = await blogsQueryRepository.getBlogById(newBlogId)

        if (!newBlog) {
            return null
        }

        return newBlog
    },
    async updateBlog(blogId: string, updateBlogModel: BlogInputModel): Promise<boolean | null> {
        const foundBlog = await blogsQueryRepository.getBlogById(blogId)

        if (!foundBlog) {
            return null
        }

        return await blogsRepository.updateBlog(blogId, updateBlogModel)
    },
    async deleteBlog(blogId: string): Promise<boolean | null> {
        const foundDeletedBlog = await blogsQueryRepository.getBlogById(blogId)

        if (!foundDeletedBlog) {
            return null
        }

        return await blogsRepository.deleteBlog(blogId)
    }
}