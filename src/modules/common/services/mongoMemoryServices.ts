import { MongoMemoryServer } from 'mongodb-memory-server'
import { AppSettings } from '../../../app/appSettings'
import { client, runDb } from '../../../app/config/db'

function getMongoMemoryService() {
    let memoryServer: MongoMemoryServer

    async function connect() {
        memoryServer = await MongoMemoryServer.create()
        AppSettings.MONGO_URI = memoryServer.getUri()

        await runDb()
    }

    async function close() {
        await client.close()
        await memoryServer.stop()
    }

    return { connect, close }
}

export const memoryService = getMongoMemoryService()