import { Router, Response } from 'express'
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {authMiddleware} from "../../../app/config/middleware/authMiddleware";
import {blogInputValidation} from "../validations/blogValidations";
import {RequestBody, RequestParamsBody, RequestQuery, RequestQueryParams} from "../../common/types";
import {BlogInputModel} from "../models/BlogInputModel";
import {ObjectId} from "mongodb";
import {BlogViewModel} from "../models/BlogViewModel";
import {BlogDbType} from "../db/blog-db";
import {QueryBlogInputModel, QueryPostInputModel} from "../models/QueryBlogInputModel";
import {blogsQueryRepository} from "../repository/blogsQueryRepository";
import {Pagination} from "../../../app/models/Pagination";
import {createPostFromBlogValidation} from "../../posts/validations/postValidation";
import {CreatePostFromBlogInputModel} from "../models/CreatePostFromBlogInputModel";
import {PostViewModel} from "../../posts/models/PostViewModel";
import {BlogServices} from "../services/BlogServices";
import {postsQueryRepository} from "../../posts/repository/postQueryRepository";

export const blogsRouter = Router()

blogsRouter.get('/', async (req: RequestQuery<QueryBlogInputModel>, res: Response<Pagination<BlogViewModel>>) => {
    const sortData = {
        searchNameTerm: req.query.searchNameTerm || null,
        sortBy: req.query.sortBy || "createdAt",
        sortDirection: req.query.sortDirection || "desc",
        pageNumber: req.query.pageNumber || 1,
        pageSize: req.query.pageSize || 10,
    }
    const blogs = await blogsQueryRepository.getAllBlogs(sortData)

    res.status(HttpStatusCode.OK_200).send(blogs)
})

blogsRouter.get('/:blogId/posts', async (req: RequestQueryParams<QueryPostInputModel, {blogId: string}>, res: Response<Pagination<PostViewModel>>) => {
    const blogId = req.params.blogId

    const blog = await blogsQueryRepository.getBlogById(blogId)

    if (!blog) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    const sortData = {
        sortBy: req.query.sortBy ?? "createdAt",
        sortDirection: req.query.sortDirection ?? "desc",
        pageNumber: req.query.pageNumber ?? 1,
        pageSize: req.query.pageSize ?? 10,
    }

    const posts = await postsQueryRepository.getPosts(sortData, blogId)

    res.status(HttpStatusCode.OK_200).send(posts)
})

blogsRouter.get('/:blogId', async (req, res) => {
    const id = req.params.blogId

    if (!ObjectId.isValid(id)) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }
    const foundBlogById = await blogsQueryRepository.getBlogById(id)

    if (!foundBlogById) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.status(HttpStatusCode.OK_200).send(foundBlogById)
})

blogsRouter.post('/', authMiddleware, blogInputValidation(), async (req: RequestBody<BlogInputModel>, res: Response<BlogViewModel>) => {
    const newBlogData: BlogDbType = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
        isMembership: false,
        createdAt: new Date().toISOString()
    }
    const newBlog = await BlogServices.createBlog(newBlogData)

    if (!newBlog) {
        res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
        return
    }

    res.status(HttpStatusCode.CREATED_201).send(newBlog)
})
blogsRouter.post('/:id/posts', authMiddleware, createPostFromBlogValidation(), async (req: RequestParamsBody<{ id: string }, CreatePostFromBlogInputModel>, res: Response<PostViewModel>) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        res.status(HttpStatusCode.BAD_REQUEST_400)
        return
    }

    const createPostFromBlog = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content
    }

    const newPost = await BlogServices.createPostToBlog(id, createPostFromBlog)

    if (!newPost) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.status(HttpStatusCode.CREATED_201).send(newPost)
})

blogsRouter.put('/:blogId', authMiddleware, blogInputValidation(), async (req: RequestParamsBody<{ blogId: string }, BlogInputModel>, res: Response) => {
    const blogId = req.params.blogId

    if (!ObjectId.isValid(blogId)) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    const updateBlogData: BlogInputModel = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }

    const isBlogUpdated = await BlogServices.updateBlog(req.params.blogId, updateBlogData)

    if (!isBlogUpdated) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

blogsRouter.delete('/:blogId', authMiddleware, async (req, res) => {
    const blogId = req.params.blogId

    if (!ObjectId.isValid(blogId)) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    const isDeleted = await BlogServices.deleteBlog(blogId)

    if (!isDeleted) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})