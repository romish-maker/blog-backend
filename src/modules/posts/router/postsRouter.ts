import {Router, Response, Request} from "express";
import {RequestBody, RequestParamsBody} from "../../common/types";
import {authMiddleware} from "../../../app/config/middleware/authMiddleware";
import {postsRepository} from "../repository/postsRepository";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {postInputValidation} from "../validations/postValidation";
import {PostInputModel} from "../models/PostInputModel";

export const postsRouter = Router()

postsRouter.get("/", async (req: Request, res: Response) => {
    const posts = await postsRepository.getAllPosts();

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

    const createdPost = await postsRepository.createNewPost(payload)

    if (!createdPost) {
        res.sendStatus(HttpStatusCode.BAD_REQUEST_400)

        return
    }

    res.status(HttpStatusCode.CREATED_201).send(createdPost)
})

postsRouter.get('/:postId',  async (req, res) => {
    const foundPostById = await postsRepository.getPostById(req.params.postId)

    if (!foundPostById) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.status(HttpStatusCode.OK_200).send(foundPostById)
})

postsRouter.put('/:postId', authMiddleware, postInputValidation(), async (req: RequestParamsBody<{postId: string}, PostInputModel>, res: Response) => {
    const payload = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    }
    const isPostUpdated = await postsRepository.updatePostById(payload, req.params.postId)

    if (!isPostUpdated) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

postsRouter.delete('/:postId',  authMiddleware, async (req, res) => {
    const foundPostById = await postsRepository.deletePostById(req.params.postId)

    if (!foundPostById) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
