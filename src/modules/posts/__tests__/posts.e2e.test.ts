import { postsCollection } from '../../../app/config/db'
import {app} from "../../../app/appSettings";
import {RoutesList} from "../../../app/enums";
import {postTestManager} from "../utils/testing/postTestManager";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {testPostInput} from "../mocks";
import {testBlog} from "../../blogs/mocks";

const supertest = require('supertest')

const request = supertest(app)

describe('/posts route GET tests: ', () => {
    beforeEach(async () => {
        await request.delete(`/testing/all-data`)
    })

    it('GET /posts success', async () => {
        const createdPost = await postTestManager.createPost()
        const result = await request.get(RoutesList.POSTS).expect(HttpStatusCode.OK_200)

        expect(result.body?.length).toBe(1)
        expect(result.body[0].blogId).toBe(createdPost.body.blogId)
        expect(result.body[0].title).toBe(createdPost.body.title)
    })

    it('GET /posts/:id success', async () => {
        const createdPost = await postTestManager.createPost()
        const result = await request.get(`${RoutesList.POSTS}/${createdPost.body.id}`).expect(HttpStatusCode.OK_200)

        expect(result.body.id).toStrictEqual(expect.any(String))
        expect(result.body.title).toBe(createdPost.body.title)
        expect(result.body.blogId).toBe(createdPost.body.blogId)
        expect(result.body.blogName).toBe(createdPost.body.blogName)
    })

    it('GET /posts/:id not found', async () => {
        await postTestManager.createPost()
        await request.get(`${RoutesList.POSTS}/wrongId`).expect(HttpStatusCode.NOT_FOUND_404)
    })
})

describe('/posts route POST tests: ', () => {
    beforeEach(async () => {
        await request.delete(`/testing/all-data`)
    })

    it('POST /posts success', async () => {
        await postTestManager.createPost({ shouldExpect: true })
    })

    it('POST /posts failed::auth', async () => {
        await postTestManager.createPost({
            user: 'badUser',
            password: 'badPassword',
            expectedStatusCode: HttpStatusCode.UNAUTHORIZED_401,
        })
        await postTestManager.createPost({
            password: 'badPassword',
            expectedStatusCode: HttpStatusCode.UNAUTHORIZED_401,
        })
        await postTestManager.createPost({
            user: 'badUser',
            expectedStatusCode: HttpStatusCode.UNAUTHORIZED_401,
        })
    })

    it('POST /posts failed::title', async () => {
        await postTestManager.createPost({
            shouldExpect: true,
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
            checkedData: { field: 'title', value: '1234567890123456789012345678901' },
        })
        await postTestManager.createPost({
            shouldExpect: true,
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
            checkedData: { field: 'title', value: null },
        })
    })

    it('POST /posts failed::shortDescription', async () => {
        await postTestManager.createPost({
            shouldExpect: true,
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
            checkedData: { field: 'shortDescription', value: '' },
        })
    })

    it('POST /posts failed::content', async () => {
        await postTestManager.createPost({
            shouldExpect: true,
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
            checkedData: { field: 'content', value: 123 },
        })
    })

    it('POST /posts failed::blogId', async () => {
        await postTestManager.createPost({
            shouldExpect: true,
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
            checkedData: { field: 'blogId', value: '182736' }
        })
        await postTestManager.createPost({
            shouldExpect: true,
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
            checkedData: { field: 'blogId', value: null }
        })
    })
})

describe('/posts PUT route tests: ', () => {
    beforeEach(async () => {
        await request.delete(`/testing/all-data`)
    })

    it('PUT /posts success', async () => {
        const createdPost = await postTestManager.createPost()
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
        const createdPost = await postTestManager.createPost()
        const res = await request.put(`${RoutesList.POSTS}/${createdPost.body.id}`)
            .auth('admin', 'qwerty')
            .send({ ...testPostInput, title: '1234567890123456789012345678901', blogId: createdPost.body.blogId })
            .expect(HttpStatusCode.BAD_REQUEST_400)

        expect(res.body.errorsMessages.length).toBe(1)
        expect(res.body.errorsMessages[0].field).toBe('title')
        expect(res.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
    })

    it('PUT /posts failed::blogId', async () => {
        const createdPost = await postTestManager.createPost()
        const res = await request.put(`${RoutesList.POSTS}/${createdPost.body.id}`)
            .auth('admin', 'qwerty')
            .send({ ...testPostInput, blogId: '000000' })
            .expect(HttpStatusCode.BAD_REQUEST_400)

        expect(res.body.errorsMessages.length).toBe(1)
        expect(res.body.errorsMessages[0].field).toBe('blogId')
        expect(res.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
    })

    it('PUT /posts failed::content', async () => {
        const createdPost = await postTestManager.createPost()
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
    beforeEach(async () => {
        await request.delete(`/testing/all-data`)
    })

    it('DELETE /posts success: ', async () => {
        const createdPosts = await postTestManager.createPost()

        await request.delete(`${RoutesList.POSTS}/${createdPosts.body.id}`)
            .auth('admin', 'qwerty')
            .expect(HttpStatusCode.NO_CONTENT_204)

        const posts = await postsCollection.find({}).toArray()

        expect(posts.length).toBe(0)
    })

    it('DELETE /posts failed::unauthorized: ', async () => {
        const createdPosts = await postTestManager.createPost()

        await request.delete(`${RoutesList.POSTS}/${createdPosts.body.id}`)
            .auth('wrong', 'auth')
            .expect(HttpStatusCode.UNAUTHORIZED_401)

        const posts = await postsCollection.find({}).toArray()

        expect(posts.length).toBe(1)
    })

    it('DELETE /posts failed::notFoundPostId: ', async () => {
        await postTestManager.createPost()

        await request.delete(`${RoutesList.POSTS}/wrongId`)
            .auth('admin', 'qwerty')
            .expect(HttpStatusCode.NOT_FOUND_404)

        const posts = await postsCollection.find({}).toArray()

        expect(posts.length).toBe(1)

    })
})