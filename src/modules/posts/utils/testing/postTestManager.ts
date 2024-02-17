import {HttpStatusCode} from "../../../common/enums/HttpsStatusCodes";
import {app} from "../../../../app/appSettings";
import {blogTestManager} from "../../../blogs/utils/testing/blogTestManager";
import {RoutesList} from "../../../../app/enums";
import {testPostInput} from "../../mocks";
import {postsCollection} from "../../../../app/config/db";

const supertest = require('supertest')

const request = supertest(app)

class PostsTestManager {
    async createPost(payload: {
        blogId?: string
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

        const createdBlog = await blogTestManager.createBlog()

        const result = await request.post(RoutesList.POSTS)
            .auth(user, password)
            .send(checkedData
                ? { ...testPostInput, blogId: createdBlog.body.id, [checkedData.field]: checkedData.value }
                : { ...testPostInput, blogId: createdBlog.body.id })
            .expect(expectedStatusCode)

        if (shouldExpect && expectedStatusCode === HttpStatusCode.CREATED_201) {
            const post = await postsCollection.findOne({ id: result.body.id })

            expect(result.body.title).toBe(testPostInput.title)
            expect(result.body.blogId).toBe(createdBlog.body.id)
            expect(post?.shortDescription).toStrictEqual(testPostInput.shortDescription)
            expect(post?.id).toStrictEqual(expect.any(String))
        }

        if (shouldExpect && expectedStatusCode === HttpStatusCode.BAD_REQUEST_400 && checkedData?.field) {
            const posts = await postsCollection.find({}).toArray()

            expect(result.body.errorsMessages.length).toBe(1)
            expect(result.body.errorsMessages[0].field).toBe(checkedData.field)
            expect(result.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
            expect(posts.length).toBe(0)
        }

        return result
    }
}

export const postTestManager = new PostsTestManager()