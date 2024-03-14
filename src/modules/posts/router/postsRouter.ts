import { Router, Response } from 'express'
import { postsRepository } from '../repository/postsRepository'
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {authMiddleware} from "../../../app/config/middleware/authMiddleware";
import {postIdValidationMW, postInputValidation} from "../validations/postValidation";
import {
    PaginationAndSortQuery,
    RequestBody,
    RequestParams,
    RequestParamsBody,
    RequestParamsQuery,
    RequestQuery
} from "../../common/types";
import {PostInputModel} from "../models/PostInputModel";
import {ObjectId} from "mongodb";
import {PostDbType} from "../db/post-db";
import {blogsRepository} from "../../blogs/repository/blogsRepository";
import {postsQueryRepository} from "../repository/postQueryRepository";
import {PostServices} from "../services/PostServices";
import {sortingAndPaginationMiddleware} from "../../../app/config/middleware/sortingAndPaginationMiddleware";
import {jwtAuthMiddleware} from "../../../app/config/middleware/jwtAuthMiddleware";
import {commentInputValidation} from "../../comments/validations/commentsValidations";
import {CommentInputModel} from "../../comments/models/CommentInputModel";
import {ResultToRouterStatus} from "../../common/enums/ResultToRuterStatus";
import {commentsQueryRepository} from "../../comments/repository/commentQueryRepository";

export const postsRouter = Router()

postsRouter.get('/', async (req: RequestQuery<PaginationAndSortQuery>, res) => {
    const sortData = {
        pageNumber: req.query.pageNumber || 1,
        pageSize: req.query.pageSize || 10,
        sortBy: req.query.sortBy || "createdAt",
        sortDirection: req.query.sortDirection || "desc",
    }

    const posts = await postsQueryRepository.getPosts(sortData)

    res.status(HttpStatusCode.OK_200).send(posts)
})

postsRouter.get(
    '/:postId/comments',
    postIdValidationMW,
    sortingAndPaginationMiddleware(),
    async (req: RequestParamsQuery<{ postId: string }, Required<PaginationAndSortQuery>>, res: Response) => {
        const post = await postsQueryRepository.getPostById(req.params.postId)

        if (!post) {
            return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        }

        const comments = await postsQueryRepository.getPostComments(req.params.postId, req.query)

        return res.status(HttpStatusCode.OK_200).send(comments)
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

postsRouter.post(
    '/:postId/comments',
    postIdValidationMW,
    jwtAuthMiddleware,
    commentInputValidation(),
    async (req: RequestParamsBody<{ postId: string }, CommentInputModel>, res: Response) => {
        const createCommentResult = await PostServices.createCommentToPost(req.params.postId, req.userId, req.body)

        if (createCommentResult.status === ResultToRouterStatus.NOT_FOUND) {
            return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        }

        const createdComment = await commentsQueryRepository.getCommentById(createCommentResult.data!.commentId)

        if (createdComment.status === ResultToRouterStatus.NOT_FOUND) {
            return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        }

        return res.status(HttpStatusCode.CREATED_201).send(createdComment.data)
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
