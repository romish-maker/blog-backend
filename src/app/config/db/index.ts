import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {Collections} from "./config";
import {AppSettings} from "../../appSettings";
import {BlogDbType} from "../../../modules/blogs/db/blog-db";
import {PostDbType} from "../../../modules/posts/db/post-db";
import {UserDbType} from "../../../modules/users/db/user-db";
import {CommentDbType} from "../../../modules/comments/models/CommentDbType";
import {UserDbModel} from "../../../modules/users/models/UserDbModel";
import {SessionsDbModel} from "../../../modules/auth/models/SessionsDbModel";

dotenv.config()

const uri = process.env.MONGO_URL

if (!uri) {
    throw new Error("mongo uri is not defined")
}

export const client = new MongoClient(uri)

const database = client.db("blogs-db")

export const blogsCollection = database.collection<BlogDbType>(Collections.BLOGS)
export const postsCollection = database.collection<PostDbType>(Collections.POSTS)
export const usersCollection = database.collection<UserDbModel>(Collections.USERS)
export const commentsCollection = database.collection<CommentDbType>(Collections.COMMENTS)
export const sessionsCollection = database.collection<SessionsDbModel>(Collections.SESSIONS)

export const runDb= async () => {
    try {
        await client.connect()

        console.log("Client connected to DB")
        console.log(`Example app listening to port ${AppSettings.PORT}`)
    } catch (err) {
        console.log(`${err}`)

        await client.close()
    }
}