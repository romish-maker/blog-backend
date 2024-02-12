import express, { Request, Response } from "express";
import {RoutesList} from "./enums";
import {blogsRouter} from "../modules/blogs/router/blogsRouter";
import {testingRouter} from "../modules/common/testing/router";

export const AppSettings = {
    PORT: 5000,
}

export const app = express()
const jsonParseMiddleware = express.json()

app.use(jsonParseMiddleware)
app.use(RoutesList.BLOGS, blogsRouter)
app.use('/testing', testingRouter)
// app.use(RoutesList.POSTS, postRouter)

app.use(RoutesList.BASE, (req: Request, res: Response) => {
    res.send('Hi express')
})

app.delete(RoutesList.BASE, (req: Request, res: Response) => {
    res.send('Hi express')
})