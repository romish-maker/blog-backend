import { Router } from 'express'
import {HttpStatusCode} from "../enums/HttpsStatusCodes";
import {db} from "../../blogs/repository/blogRepository";

export const testingRouter = Router()

testingRouter.delete('/all-data', (req, res) => {
    db.blogs = []
    // db.posts = []

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})