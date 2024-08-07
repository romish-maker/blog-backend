import { Collection, MongoClient } from 'mongodb'
import 'dotenv/config'
import { AppSettings } from '../../appSettings'
import { Collections } from './config'
import {UserDbModel} from "../../../modules/users/models/UserDbModel";
import {SessionsDbModel} from "../../../modules/auth/models/SessionsDbModel";
import {BlogDbType} from "../../../modules/blogs/db/blog-db";
import {PostDbType} from "../../../modules/posts/db/post-db";
import {CommentDbType} from "../../../modules/comments/models/CommentDbType";
import {RateLimitModel} from "../../../modules/auth/models/RateLimitModel";

export let client: MongoClient
let blogsCollection: Collection<BlogDbType>
let postsCollection: Collection<PostDbType>
let usersCollection: Collection<UserDbModel>
let commentsCollection: Collection<CommentDbType>
let sessionsCollection: Collection<SessionsDbModel>
let rateLimitCollection: Collection<RateLimitModel>

async function runDb() {
    const uri = AppSettings.MONGO_URI
    if (!uri) {
        throw new Error('!!! MONGODB_URI not found')
    }

    client = new MongoClient(uri);

    const db = client.db("blogs-db")
    blogsCollection = db.collection<BlogDbType>(Collections.BLOGS)
    postsCollection = db.collection<PostDbType>(Collections.POSTS)
    usersCollection = db.collection<UserDbModel>(Collections.USERS)
    commentsCollection = db.collection<CommentDbType>(Collections.COMMENTS)
    sessionsCollection = db.collection<SessionsDbModel>(Collections.SESSIONS)
    rateLimitCollection = db.collection<RateLimitModel>(Collections.RATE_LIMIT)

    try {
        await client.connect()
        console.log("Pinged your deployment. You successfully connected to MongoDB!")
    } catch (err) {
        console.dir('!!! Can\'t connect to database!', err)
        await client.close();
        console.log('DB work is finished successfully')
    }
}

const cleanup = async () => {
    await client.close()
    process.exit()
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

export {
    runDb,
    blogsCollection,
    postsCollection,
    usersCollection,
    commentsCollection,
    sessionsCollection,
    rateLimitCollection
}