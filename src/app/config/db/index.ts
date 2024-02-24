import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {Collections} from "./config";
import {AppSettings} from "../../appSettings";
import {BlogDbType} from "../../../modules/blogs/db/blog-db";
import {PostDbType} from "../../../modules/posts/db/post-db";

dotenv.config()

const uri = process.env.MONGO_URL

if (!uri) {
    throw new Error("mongo uri is not defined")
}

export const client = new MongoClient(uri)

const database = client.db("blogs-db")

export const blogsCollection = database.collection<BlogDbType>(Collections.BLOGS)
export const postsCollection = database.collection<PostDbType>(Collections.POSTS)

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