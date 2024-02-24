import { Router, Response } from 'express'
import {blogsRepository} from "../repository/blogRepository";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {authMiddleware} from "../../../app/config/middleware/authMiddleware";
import {blogInputValidation} from "../validations/blogValidations";
import {RequestBody, RequestParamsBody} from "../../common/types";
import {BlogInputModel} from "../models/BlogInputModel";
import {ObjectId} from "mongodb";
import {BlogViewModel} from "../models/BlogViewModel";
import {BlogDbType} from "../db/blog-db";

export const blogsRouter = Router()

blogsRouter.get('/', async (req, res) => {
    const blogs = await blogsRepository.getAllBlogs()

    res.status(HttpStatusCode.OK_200).send(blogs)
})

blogsRouter.get('/:blogId', async (req, res) => {
    const id = req.params.blogId

    if (!ObjectId.isValid(id)) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }
    const foundBlogById = await blogsRepository.getBlogById(id)

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
    const newBlogId = await blogsRepository.createNewBlog(newBlogData)

    const newBlog = await blogsRepository.getBlogById(newBlogId)

    if (!newBlog) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.status(HttpStatusCode.CREATED_201).send(newBlog)
})

blogsRouter.put('/:blogId', authMiddleware, blogInputValidation(), async (req: RequestParamsBody<{ blogId: string }, BlogInputModel>, res: Response) => {
    const updateBlogData: BlogInputModel = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }

    const foundBlog = await blogsRepository.getBlogById(req.params.blogId)

    if (!foundBlog) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    const isBlogUpdated = await blogsRepository.updateBlog(req.params.blogId, updateBlogData)

    if (!isBlogUpdated) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

blogsRouter.delete('/:blogId', authMiddleware, async (req, res) => {
    const foundDeletedBlog = await blogsRepository.getBlogById(req.params.blogId)

    if (!foundDeletedBlog) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    const isDeleted = await blogsRepository.deleteBlog(req.params.blogId)

    if (!isDeleted) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})