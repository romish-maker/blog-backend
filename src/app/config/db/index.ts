import { MongoClient, ServerApiVersion } from 'mongodb'
import 'dotenv/config'
import { Collections } from './config'
import {BlogViewModel} from "../../../modules/blogs/models/BlogViewModel";
import {PostViewModel} from "../../../modules/posts/models/PostViewModel";


const uri = process.env.MONGO_URI
if (!uri) {
    throw new Error('mongo uri not found')
}

export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const db = client.db(process.env.MONGO_URL)
export const blogsCollection = db.collection<BlogViewModel>(Collections.BLOGS)
export const postsCollection = db.collection<PostViewModel>(Collections.POSTS)

export const runDb = async () => {
    try {
        await client.connect()
        await client.db("admin").command({ ping: 1 })
    } catch (err) {
        await client.close();
    }
}

const cleanup = async () => {
    await client.close()
    process.exit()
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
