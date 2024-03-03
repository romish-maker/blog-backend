import { Router, Response } from 'express'
import { postsRepository } from '../repository/postsRepository'
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {authMiddleware} from "../../../app/config/middleware/authMiddleware";
import {postInputValidation} from "../validations/postValidation";
import {RequestBody, RequestParams, RequestParamsBody, RequestQuery} from "../../common/types";
import {PostInputModel} from "../models/PostInputModel";
import {ObjectId} from "mongodb";
import {PostDbType} from "../db/post-db";
import {blogsRepository} from "../../blogs/repository/blogsRepository";
import {postsQueryRepository} from "../repository/postQueryRepository";
import {QueryPostInputModel} from "../models/QueryPostInputModel";
import {PostServices} from "../services/PostServices";

export const postsRouter = Router()

postsRouter.get('/', async (req: RequestQuery<QueryPostInputModel>, res) => {
    const sortData = {
        pageNumber: req.query.pageNumber || 1,
        pageSize: req.query.pageSize || 10,
        sortBy: req.query.sortBy || "createdAt",
        sortDirection: req.query.sortDirection || "desc",
    }

    const posts = await postsQueryRepository.getPosts(sortData)

    res.status(HttpStatusCode.OK_200).send(posts)
})

postsRouter.get('/:postId', async (req, res) => {
    const postId = req.params.postId

    if (!ObjectId.isValid(postId)) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    const foundPost = await postsRepository.getPostById(req.params.postId)

    if (!foundPost) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)

        return
    }

    res.status(HttpStatusCode.OK_200).send(foundPost)
})

postsRouter.post('/', authMiddleware, postInputValidation(),  async (req: RequestBody<PostInputModel>, res: Response) => {
    const blogId = req.body.blogId
    const blogData = await blogsRepository.getBlogById(blogId)

    if (!blogData) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    const payload: PostDbType = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        createdAt: new Date().toISOString(),
        blogName: blogData.name
    }

    const newPost = await PostServices.createPost(payload)

    if (!newPost) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.status(HttpStatusCode.CREATED_201).send(newPost)
})

postsRouter.put('/:postId', authMiddleware, postInputValidation(),  async (req: RequestParamsBody<{ postId: string }, PostInputModel>, res: Response) => {
    const postId = req.params.postId

    const payload: PostInputModel = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
    }

    const isPostUpdated = await PostServices.updatePost(postId, payload)
    if (!isPostUpdated) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)

        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

postsRouter.delete('/:postId', authMiddleware, async (req: RequestParams<{ postId: string }>, res) => {
    const postId = req.params.postId

    const isDeleted = await PostServices.deleteBlog(postId)

    if (!isDeleted) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)

        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
