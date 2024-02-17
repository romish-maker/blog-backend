import dotenv from 'dotenv'
import {MongoClient} from "mongodb";
import {Collections} from "./config";
import {AppSettings} from "../../appSettings";
import {BlogViewModel} from "../../../modules/blogs/models/BlogViewModel";
import {PostViewModel} from "../../../modules/posts/models/PostViewModel";

dotenv.config()

const uri = process.env.MONGO_URL

if (!uri) {
    throw new Error("mongo uri is not defined")
}

export const client = new MongoClient(uri)

const database = client.db("blogs-db")

export const blogsCollection = database.collection<any>(Collections.BLOGS)
export const postsCollection = database.collection<PostViewModel>(Collections.POSTS)

export const runDatabase = async () => {
    try {
        await client.connect()

        console.log("Client connected to DB")
        console.log(`Example app listening to port ${AppSettings.PORT}`)
    } catch (err) {
        console.log(`${err}`)

        await client.close()
    }
}