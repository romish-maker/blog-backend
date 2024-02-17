import { Router } from 'express'
import {HttpStatusCode} from "../enums/HttpsStatusCodes";
import {blogsCollection, postsCollection} from "../../../app/config/db";

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})