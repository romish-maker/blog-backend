import { blogsCollection } from '../../../../app/config/db'
import {app} from "../../../../app/appSettings";
import {HttpStatusCode} from "../../../common/enums/HttpsStatusCodes";
import {RoutesList} from "../../../../app/enums";
import {testBlogInput} from "../../mocks";

const supertest = require('supertest')

const request = supertest(app)
class BlogsTestManager {
    async createBlog(payload: {
        shouldExpect?: boolean
        user?: string
        password?: string
        expectedStatusCode?: HttpStatusCode
        checkedData?: { field: string, value: any }
    } = {}) {
        const {
            shouldExpect = false,
            user = 'admin',
            password = 'qwerty',
            expectedStatusCode = HttpStatusCode.CREATED_201,
            checkedData,
        } = payload

        const result = await request.post(RoutesList.BLOGS)
            .auth(user, password)
            .send(checkedData ? { ...testBlogInput, [checkedData.field]: checkedData.value } : testBlogInput)
            .expect(expectedStatusCode)

        if (shouldExpect && expectedStatusCode === HttpStatusCode.CREATED_201) {
            const blogFromDb = await blogsCollection.findOne({ id: result.body.id })

            expect(result.body.name).toBe(testBlogInput.name)
            expect(result.body.websiteUrl).toBe(testBlogInput.websiteUrl)
            expect(blogFromDb?.description).toStrictEqual(testBlogInput.description)
            expect(blogFromDb?.id).toStrictEqual(expect.any(String))
        }

        if (shouldExpect && expectedStatusCode === HttpStatusCode.BAD_REQUEST_400 && checkedData?.field) {
            const blogsFromDb = await blogsCollection.find({}).toArray()

            expect(result.body.errorsMessages.length).toBe(1)
            expect(result.body.errorsMessages[0].field).toBe(checkedData.field)
            expect(result.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
            expect(blogsFromDb.length).toBe(0)
        }

        return result
    }
}

export const blogTestManager = new BlogsTestManager()