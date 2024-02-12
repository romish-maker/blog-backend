import {Router, Response, Request} from "express";
import {RequestBody, RequestParamsBody} from "../../common/types";
import {authMiddleware} from "../../../app/config/middleware/authMiddleware";
import {postsRepository} from "../repository/postsRepository";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {postInputValidation} from "../validations/postValidation";
import {PostInputModel} from "../models/PostInputModel";

export const postsRouter = Router()

postsRouter.get("/", (req: Request, res: Response) => {
    const posts = postsRepository.getAllPosts();

    res.send(posts)
        .status(HttpStatusCode.OK_200)
})

postsRouter.post('/', authMiddleware, postInputValidation(),  async (req: RequestBody<PostInputModel>, res: Response) => {
    const payload: PostInputModel = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
    }

    const createdPost = postsRepository.createNewPost(payload)

    if (!createdPost) {
        res.sendStatus(HttpStatusCode.BAD_REQUEST_400)

        return
    }

    res.status(HttpStatusCode.CREATED_201).send(createdPost)
})

postsRouter.get('/:postId',  (req, res) => {
    const foundPostById = postsRepository.getPostById(req.params.postId)

    if (!foundPostById) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.status(HttpStatusCode.OK_200).send(foundPostById)
})

postsRouter.put('/:postId', authMiddleware, postInputValidation(), (req: RequestParamsBody<{postId: string}, PostInputModel>, res: Response) => {
    const payload = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    }
    const isPostUpdated = postsRepository.updatePostById(payload, req.params.postId)

    if (!isPostUpdated) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

postsRouter.delete('/:postId',  authMiddleware, (req, res) => {
    const foundPostById = postsRepository.deletePostById(req.params.postId)

    if (!foundPostById) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
