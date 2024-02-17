import { Router, Response } from 'express'
import {blogRepository} from "../repository/blogRepository";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {authMiddleware} from "../../../app/config/middleware/authMiddleware";
import {blogInputValidation} from "../validations/blogValidations";
import {RequestBody, RequestParamsBody} from "../../common/types";
import {BlogInputModel} from "../models/BlogInputModel";

export const blogsRouter = Router()

blogsRouter.get('/', async (req, res) => {
    const blogs = await blogRepository.getAllBlogs()

    res.status(HttpStatusCode.OK_200).send(blogs)
})

blogsRouter.get('/:blogId', async (req, res) => {
    const foundBlogById = await blogRepository.getBlogById(req.params.blogId)

    if (!foundBlogById) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.status(HttpStatusCode.OK_200).send(foundBlogById)
})

blogsRouter.post('/', authMiddleware, blogInputValidation(), async (req: RequestBody<BlogInputModel>, res: Response) => {
    const newBlogData: BlogInputModel = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }
    const newBlog = await blogRepository.createNewBlog(newBlogData)

    res.status(HttpStatusCode.CREATED_201).send(newBlog)
})

blogsRouter.put('/:blogId', authMiddleware, blogInputValidation(), async (req: RequestParamsBody<{ blogId: string }, BlogInputModel>, res: Response) => {
    const updateBlogData: BlogInputModel = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }

    const isBlogUpdated = await blogRepository.updateBlogById(req.params.blogId, updateBlogData)

    if (!isBlogUpdated) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

blogsRouter.delete('/:blogId', authMiddleware, async (req, res) => {
    const isDeleted = await blogRepository.deleteBlogById(req.params.blogId)

    if (!isDeleted) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})