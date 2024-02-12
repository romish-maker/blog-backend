import {Router, Response, Request} from "express";
import {blogRepository} from "../repository/blogRepository";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {authMiddleware} from "../../../app/config/middleware/authMiddleware";
import {blogInputValidation} from "../validations/blogValidations";
import {BlogInputModel} from "../models/BlogInputModel";
import {RequestBody, RequestParamsBody} from "../../common/types";

export const blogsRouter = Router()

blogsRouter.get("/", (req: Request, res: Response) => {
    const blogs = blogRepository.getAllBlogs();

    res.send(blogs)
        .status(HttpStatusCode.NO_CONTENT_204)
})

blogsRouter.post("/", authMiddleware, blogInputValidation(), (req: RequestBody<BlogInputModel>, res: Response) => {
    const newBlogData = {
        id: String(new Date()),
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
    }

    const blogs = blogRepository.createNewBlog(newBlogData);

    res.status(HttpStatusCode.CREATED_201)
        .send(blogs)
})

blogsRouter.get('/:blogId',  (req, res) => {
    const foundBlogById = blogRepository.getBlogById(req.params.blogId)

    if (!foundBlogById) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.status(HttpStatusCode.OK_200).send(foundBlogById)
})

blogsRouter.put('/:blogId', authMiddleware, blogInputValidation(), (req: RequestParamsBody<{blogId: string}, BlogInputModel>, res: Response) => {
    const payload = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    }
    const isBlogUpdated = blogRepository.updateBlogById(req.params.blogId, payload)

    if (!isBlogUpdated) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

blogsRouter.delete('/:blogId',  authMiddleware, (req, res) => {
    const foundBlogById = blogRepository.deleteBlogById(req.params.blogId)

    if (!foundBlogById) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
