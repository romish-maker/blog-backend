import express, { Request, Response } from "express";
import {RoutesList} from "./enums";
import {blogsRouter} from "../modules/blogs/router/blogsRouter";
import {testingRouter} from "../modules/common/testing/router";
import {postsRouter} from "../modules/posts/router/postsRouter";
import {usersRouter} from "../modules/users/router/usersRouter";
import {authRouter} from "../modules/auth/router/authRouter";
import {commentsRouter} from "../modules/comments/router/commentsRouter";
import cookieParser from "cookie-parser";
import {devicesRouter} from "../modules/devices/router/devicesRouter";

export const AppSettings = {
    PORT: 5000,
    ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET,
    ACCESS_JWT_EXPIRES: '10s',
    REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
    REFRESH_JWT_EXPIRES: '20s',
    SEND_MAIL_SERVICE_EMAIL: process.env.SEND_MAIL_SERVICE_EMAIL,
    SEND_MAIL_SERVICE_PASSWORD: process.env.SEND_MAIL_SERVICE_PASSWORD,
    MONGO_URI: process.env.MONGO_URI
}

export const app = express()
app.set('trust proxy', true)
const jsonParseMiddleware = express.json()
const cookieParserMiddleware = cookieParser()

app.use(jsonParseMiddleware)
app.use(cookieParserMiddleware)
app.use(RoutesList.BLOGS, blogsRouter)
app.use(RoutesList.POSTS, postsRouter)
app.use(RoutesList.USERS, usersRouter)
app.use(RoutesList.AUTH, authRouter)
app.use(RoutesList.COMMENTS, commentsRouter)
app.use(RoutesList.DEVICES, devicesRouter)
app.use(RoutesList.TESTING, testingRouter)

app.use(RoutesList.BASE, (req: Request, res: Response) => {
    res.send('Hi express')
})

app.delete(RoutesList.BASE, (req: Request, res: Response) => {
    res.send('Hi express')
})