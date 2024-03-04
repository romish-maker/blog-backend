import express, { Request, Response } from "express";
import {RoutesList} from "./enums";
import {blogsRouter} from "../modules/blogs/router/blogsRouter";
import {testingRouter} from "../modules/common/testing/router";
import {postsRouter} from "../modules/posts/router/postsRouter";
import {usersRouter} from "../modules/users/router/usersRouter";

export const AppSettings = {
    PORT: 5000,
}

export const app = express()
const jsonParseMiddleware = express.json()

app.use(jsonParseMiddleware)
app.use(RoutesList.BLOGS, blogsRouter)
app.use(RoutesList.POSTS, postsRouter)
app.use(RoutesList.USERS, usersRouter)
app.use('/testing', testingRouter)

app.use(RoutesList.BASE, (req: Request, res: Response) => {
    res.send('Hi express')
})

app.delete(RoutesList.BASE, (req: Request, res: Response) => {
    res.send('Hi express')
})