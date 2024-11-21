import { postWrongId, testPostInput } from '../mocks/postsMock'
import { postsCollection } from '../../../app/config/db'
import {app} from "../../../app/appSettings";
import {memoryService} from "../../common/services/mongoMemoryServices";
import {RoutesList} from "../../../app/enums";
import {postsTestManager} from "../utils/testing/postTestManager";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {userInputMock} from "../../users/mocks/usersMock";
import {testBlog} from "../../blogs/mocks/blogsMock";
import {usersTestManager} from "../../users/utils/testing/usersTestManager";

const supertest = require('supertest')

const request = supertest(app)

describe('/posts route GET tests: ', () => {
    beforeAll(async ()=> {
        await memoryService.connect()
    })
    afterAll(async () => {
        await memoryService.close()
    })
    beforeEach(async () => {
        await request.delete(`${RoutesList.TESTING}/all-data`)
    })

    it('GET /posts success', async () => {
        const createdPost = await postsTestManager.createPost()
        const result = await request.get(RoutesList.POSTS).expect(HttpStatusCode.OK_200)

        expect(result.body.items?.length).toBe(1)
        expect(result.body.items[0].blogId).toBe(createdPost.body.blogId)
        expect(result.body.items[0].title).toBe(createdPost.body.title)
        expect(result.body.totalCount).toBe(1)
        expect(result.body.pageSize).toBe(10)
    })

    it('GET /posts success query params', async () => {
        await postsTestManager.createPost()
        const result = await request
            .get(RoutesList.POSTS)
            .query({
                pageNumber: 4,
                pageSize: 20,
            })
            .expect(HttpStatusCode.OK_200)

        expect(result.body.items?.length).toBe(0)
        expect(result.body.totalCount).toBe(1)
        expect(result.body.pageSize).toBe(20)
        expect(result.body.page).toBe(4)
    })

    it('GET /posts/:id success', async () => {
        const createdPost = await postsTestManager.createPost()
        const result = await request.get(`${RoutesList.POSTS}/${createdPost.body.id}`).expect(HttpStatusCode.OK_200)

        expect(result.body.id).toStrictEqual(expect.any(String))
        expect(result.body.title).toBe(createdPost.body.title)
        expect(result.body.blogId).toBe(createdPost.body.blogId)
        expect(result.body.blogName).toBe(createdPost.body.blogName)
    })

    it('GET /posts/:id not found', async () => {
        await postsTestManager.createPost()
        await request.get(`${RoutesList.POSTS}/${postWrongId}`).expect(HttpStatusCode.NOT_FOUND_404)
    })

    it('GET /posts/:id/comments success', async () => {
        const { postId, comment, accessToken } = await postsTestManager.createComment()

        const commentsResult = await request.get(`${RoutesList.POSTS}/${postId}/comments`)
            .auth(accessToken, { type: 'bearer' })
            .expect(HttpStatusCode.OK_200)

        expect(commentsResult.body.items?.length).toBe(1)
        expect(commentsResult.body.items[0].content).toBe(comment.content)
        expect(commentsResult.body.items[0].commentatorInfo.userId).toBe(comment.commentatorInfo.userId)
        expect(commentsResult.body.totalCount).toBe(1)
        expect(commentsResult.body.pageSize).toBe(10)
    })

    it('GET /posts/:id/comments failed::notFound', async () => {
        const { accessToken } = await postsTestManager.createComment()

        const commentsResult = await request.get(`${RoutesList.POSTS}/${postWrongId}/comments`)
            .auth(accessToken, { type: 'bearer' })
            .expect(HttpStatusCode.NOT_FOUND_404)

        expect(commentsResult.body.items?.length).toBe(undefined)
    })
})

describe('/posts route POST tests: ', () => {
    beforeAll(async ()=> {
        await memoryService.connect()
    })
    afterAll(async () => {
        // Closing the DB connection allows Jest to exit successfully.
        await memoryService.close()
    })
    beforeEach(async () => {
        await request.delete(`${RoutesList.TESTING}/all-data`)
    })

    it('POST /posts success', async () => {
        await postsTestManager.createPost({ shouldExpect: true })
    })

    it('POST /posts failed::auth', async () => {
        await postsTestManager.createPost({
            user: 'badUser',
            password: 'badPassword',
            expectedStatusCode: HttpStatusCode.UNAUTHORIZED_401,
        })
        await postsTestManager.createPost({
            password: 'badPassword',
            expectedStatusCode: HttpStatusCode.UNAUTHORIZED_401,
        })
        await postsTestManager.createPost({
            user: 'badUser',
            expectedStatusCode: HttpStatusCode.UNAUTHORIZED_401,
        })
    })

    it('POST /posts failed::title', async () => {
        await postsTestManager.createPost({
            shouldExpect: true,
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
            checkedData: { field: 'title', value: '1234567890123456789012345678901' },
        })
        await postsTestManager.createPost({
            shouldExpect: true,
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
            checkedData: { field: 'title', value: null },
        })
    })

    it('POST /posts failed::shortDescription', async () => {
        await postsTestManager.createPost({
            shouldExpect: true,
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
            checkedData: { field: 'shortDescription', value: '' },
        })
    })

    it('POST /posts failed::content', async () => {
        await postsTestManager.createPost({
            shouldExpect: true,
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
            checkedData: { field: 'content', value: 123 },
        })
    })

    it('POST /posts  failed::blogId', async () => {
        await postsTestManager.createPost({
            shouldExpect: true,
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
            checkedData: { field: 'blogId', value: '182736' }
        })
        await postsTestManager.createPost({
            shouldExpect: true,
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
            checkedData: { field: 'blogId', value: null }
        })
    })

    it('POST /posts/:postId/comments success comment added', async () => {
        const createdPost = await postsTestManager.createPost()
        const createUser = await usersTestManager.createUser()
        const resultLogin = await request.post(`${RoutesList.AUTH}/login`)
            .send({
                loginOrEmail: createUser.body.login,
                password: userInputMock.password,
            })
            .expect(HttpStatusCode.OK_200)

        const commentResult = await request.post(`${RoutesList.POSTS}/${createdPost.body.id}/comments`)
            .auth(resultLogin.body.accessToken, { type: 'bearer' })
            .send({ content: `This is my comment to ${createdPost.body.title} post <3`})
            .expect(HttpStatusCode.CREATED_201)

        expect(commentResult.body.content).toBe(`This is my comment to ${createdPost.body.title} post <3`)
        expect(commentResult.body.commentatorInfo.userId).toBe(createUser.body.id)
        expect(commentResult.body.commentatorInfo.userLogin).toBe(createUser.body.login)
    })
})

describe('/posts PUT route tests: ', () => {
    beforeAll(async ()=> {
        await memoryService.connect()
    })
    afterAll(async () => {
        // Closing the DB connection allows Jest to exit successfully.
        await memoryService.close()
    })
    beforeEach(async () => {
        await request.delete(`${RoutesList.TESTING}/all-data`)
    })

    it('PUT /posts success', async () => {
        const createdPost = await postsTestManager.createPost()
        await request.put(`${RoutesList.POSTS}/${createdPost.body.id}`)
            .auth('admin', 'qwerty')
            .send({ ...testPostInput, blogId: createdPost.body.blogId })
            .expect(HttpStatusCode.NO_CONTENT_204)
    })

    it('PUT /posts failed::unauthorized', async () => {
        await request.put(`${RoutesList.POSTS}/${testBlog.id}`)
            .send('wrong', 'auth')
            .expect(HttpStatusCode.UNAUTHORIZED_401)
    })

    it('PUT /posts failed::unauthorized:Bearer', async () => {
        await request.put(`${RoutesList.POSTS}/${testBlog.id}`)
            .send('admin', 'qwerty', { type: "bearer" })
            .expect(HttpStatusCode.UNAUTHORIZED_401)
    })

    it('PUT /posts failed::titleLength', async () => {
        const createdPost = await postsTestManager.createPost()
        const res = await request.put(`${RoutesList.POSTS}/${createdPost.body.id}`)
            .auth('admin', 'qwerty')
            .send({ ...testPostInput, title: '1234567890123456789012345678901', blogId: createdPost.body.blogId })
            .expect(HttpStatusCode.BAD_REQUEST_400)

        expect(res.body.errorsMessages.length).toBe(1)
        expect(res.body.errorsMessages[0].field).toBe('title')
        expect(res.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
    })

    it('PUT /posts failed::blogId', async () => {
        const createdPost = await postsTestManager.createPost()
        const res = await request.put(`${RoutesList.POSTS}/${createdPost.body.id}`)
            .auth('admin', 'qwerty')
            .send({ ...testPostInput, blogId: '000000' })
            .expect(HttpStatusCode.BAD_REQUEST_400)

        expect(res.body.errorsMessages.length).toBe(1)
        expect(res.body.errorsMessages[0].field).toBe('blogId')
        expect(res.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
    })

    it('PUT /posts failed::content', async () => {
        const createdPost = await postsTestManager.createPost()
        const res = await request.put(`${RoutesList.POSTS}/${createdPost.body.id}`)
            .auth('admin', 'qwerty')
            .send({ ...testPostInput, content: null, blogId: createdPost.body.blogId })
            .expect(HttpStatusCode.BAD_REQUEST_400)

        expect(res.body.errorsMessages.length).toBe(1)
        expect(res.body.errorsMessages[0].field).toBe('content')
        expect(res.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
    })
})

describe('/posts DELETE tests: ', () => {
    beforeAll(async ()=> {
        await memoryService.connect()
    })
    afterAll(async () => {
        // Closing the DB connection allows Jest to exit successfully.
        await memoryService.close()
    })
    beforeEach(async () => {
        await request.delete(`${RoutesList.TESTING}/all-data`)
    })

    it('DELETE /posts success: ', async () => {
        const createdPosts = await postsTestManager.createPost()

        await request.delete(`${RoutesList.POSTS}/${createdPosts.body.id}`)
            .auth('admin', 'qwerty')
            .expect(HttpStatusCode.NO_CONTENT_204)

        const posts = await postsCollection.find({}).toArray()

        expect(posts.length).toBe(0)
    })

    it('DELETE /posts failed::unauthorized: ', async () => {
        const createdPosts = await postsTestManager.createPost()

        await request.delete(`${RoutesList.POSTS}/${createdPosts.body.id}`)
            .auth('wrong', 'auth')
            .expect(HttpStatusCode.UNAUTHORIZED_401)

        const posts = await postsCollection.find({}).toArray()

        expect(posts.length).toBe(1)
    })

    it('DELETE /posts failed::notFoundPostId: ', async () => {
        await postsTestManager.createPost()

        await request.delete(`${RoutesList.POSTS}/${postWrongId}`)
            .auth('admin', 'qwerty')
            .expect(HttpStatusCode.NOT_FOUND_404)

        const posts = await postsCollection.find({}).toArray()

        expect(posts.length).toBe(1)

    })
})