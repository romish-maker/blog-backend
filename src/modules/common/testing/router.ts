import { Router } from 'express'
import {HttpStatusCode} from "../enums/HttpsStatusCodes";
import {
    blogsCollection,
    commentsCollection,
    postsCollection,
    sessionsCollection,
    usersCollection
} from "../../../app/config/db";

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await sessionsCollection.deleteMany({})

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})