import { Router, Response } from 'express'
import { postsRepository } from '../repository/postsRepository'
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {authMiddleware} from "../../../app/config/middleware/authMiddleware";
import {postInputValidation} from "../validations/postValidation";
import {RequestBody, RequestParamsBody} from "../../common/types";
import {PostInputModel} from "../models/PostInputModel";
import {ObjectId} from "mongodb";
import {PostDbType} from "../db/post-db";
import {blogsRepository} from "../../blogs/repository/blogRepository";

export const postsRouter = Router()

postsRouter.get('/', async (req, res) => {
    const posts = await postsRepository.getAllPosts()

    res.status(HttpStatusCode.OK_200).send(posts)
})

postsRouter.get('/:postId', async (req, res) => {
    const postId = req.params.postId

    if (ObjectId.isValid(postId)) {
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
    const blogData = await blogsRepository.getBlogById(req.body.blogId)

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

    const newPostId = await postsRepository.createPost(payload)

    const newPost = await postsRepository.getPostById(newPostId)

    if (!newPost) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.status(HttpStatusCode.CREATED_201).send(newPost)
})

postsRouter.put('/:postId', authMiddleware, postInputValidation(),  async (req: RequestParamsBody<{ postId: string }, PostInputModel>, res: Response) => {
    const payload: PostInputModel = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
    }

    const foundPost = await postsRepository.getPostById(req.params.postId)

    if (!foundPost) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }


    const isPostUpdated = await postsRepository.updatePost(payload, req.params.postId)

    if (!isPostUpdated) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)

        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

postsRouter.delete('/:postId', authMiddleware, async (req, res) => {
    const foundDeletedPost = await postsRepository.getPostById(req.params.blogId)

    if (!foundDeletedPost) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }


    const isDeleted = await postsRepository.deletePostById(req.params.postId)

    if (!isDeleted) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)

        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
