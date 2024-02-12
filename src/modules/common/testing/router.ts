import { Router } from 'express'
import {HttpStatusCode} from "../enums/HttpsStatusCodes";
import {db as blogsDb} from "../../blogs/repository/blogRepository";
import {db as postsDb} from "../../posts/repository/postsRepository";

export const testingRouter = Router()

testingRouter.delete('/all-data', (req, res) => {
    blogsDb.blogs = []
    postsDb.posts = []

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})