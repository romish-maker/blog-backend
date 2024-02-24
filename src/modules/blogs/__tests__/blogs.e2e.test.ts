import {app} from "../../../app/appSettings";
import {blogTestManager} from "../utils/testing/blogTestManager";
import {RoutesList} from "../../../app/enums";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {testBlog, testBlogInput, testUpdateBlogInput} from "../mocks";
import {blogsCollection, client} from "../../../app/config/db";

const supertest = require('supertest')

const request = supertest(app)

describe('/blogs route GET tests: ', () => {
    beforeEach(async () => {
        await request.delete(`/testing/all-data`)
    })

    afterEach(async () => {
        await client.close()
    })

    it('GET /blogs', async () => {
        const createdBlog = await blogTestManager.createBlog()

        const result = await request.get(RoutesList.BLOGS).expect(HttpStatusCode.OK_200)

        expect(result.body.length).toBe(1)
        expect(result.body[0].name).toBe(createdBlog.body.name)
    })

    it('GET /blogs/:id success', async () => {
        const createdBlog = await blogTestManager.createBlog()

        const result = await request.get(`${RoutesList.BLOGS}/${createdBlog.body.id}`).expect(HttpStatusCode.OK_200)

        expect(result.body.websiteUrl).toBe(testBlogInput.websiteUrl)
        expect(result.body.id).toStrictEqual(expect.any(String))
        expect(result.body.id).toBe(createdBlog.body.id)
    })

    it('GET /blogs/:id 404 not found', async () => {
        await blogTestManager.createBlog()

        await request.get(`${RoutesList.BLOGS}/someId`).expect(HttpStatusCode.NOT_FOUND_404)
    })
})

describe('/blogs route POST tests: ', () => {
    beforeEach(async () => {
        await request.delete(`/testing/all-data`)
    })

    it('POST /blogs success', async () => {
        await blogTestManager.createBlog({ shouldExpect: true })
    })

    it('POST /blogs failed::unauthorized', async () => {
        await blogTestManager.createBlog({ user: 'wrong', password: 'auth', expectedStatusCode: HttpStatusCode.UNAUTHORIZED_401 })
        await blogTestManager.createBlog({ user: 'admin', password: 'wrongPass', expectedStatusCode: HttpStatusCode.UNAUTHORIZED_401 })
        await blogTestManager.createBlog({ user: 'wrongUser', password: 'qwerty', expectedStatusCode: HttpStatusCode.UNAUTHORIZED_401 })

        const blogs = await blogsCollection.find({}).toArray()

        expect(blogs.length).toBe(0)
    })

    it('POST /blogs failed::name:notString', async () => {
        await blogTestManager.createBlog({
            shouldExpect: true,
            checkedData: { field: 'name', value: null },
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
        })
    })

    it('POST /blogs failed::name:tooLong', async () => {
        await blogTestManager.createBlog({
            shouldExpect: true,
            checkedData: { field: 'name', value: '1234567890123456'},
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
        })
    })

    it('POST /blogs failed::description:emptyString', async () => {
        await blogTestManager.createBlog({
            shouldExpect: true,
            checkedData: { field: 'description', value: ''},
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
        })
    })

    it('POST /blogs failed::websiteUrl:incorrectUrl', async () => {
        const res = await blogTestManager.createBlog({
            shouldExpect: true,
            checkedData: { field: 'websiteUrl', value: 'https//my-website.top'},
            expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
        })

        expect(res.body.errorsMessages[0].message).toBe('Must be a valid URL')
    })
})

describe('/blogs route PUT tests: ', () => {
    beforeEach(async () => {
        await request.delete(`/testing/all-data`)
    })

    it('PUT /blogs success', async () => {
        const createdBlog = await blogTestManager.createBlog()

        await request.put(`${RoutesList.BLOGS}/${createdBlog.body.id}`)
            .auth('admin', 'qwerty')
            .send(testUpdateBlogInput)
            .expect(HttpStatusCode.NO_CONTENT_204)

        const blog = await blogsCollection.findOne({ id: createdBlog.body.id })

        expect(blog?.name).toBe(testUpdateBlogInput.name)
        expect(blog?._id).toBe(createdBlog.body.id)
        expect(blog?.websiteUrl).not.toBe(testBlog.websiteUrl)
    })

    it('PUT /blogs failed::unauthorized', async () => {
        const createdBlog = await blogTestManager.createBlog()

        await request.put(`${RoutesList.BLOGS}/${createdBlog.body.id}`)
            .auth('failed', 'password')
            .send(testUpdateBlogInput)
            .expect(HttpStatusCode.UNAUTHORIZED_401)

        const blog = await blogsCollection.findOne({ id: createdBlog.body.id })

        expect(blog?.name).toBe(testBlogInput.name)
    })

    it('PUT /blogs failed::notFound', async () => {
        const createdBlog = await blogTestManager.createBlog()

        await request.put(`${RoutesList.BLOGS}/someId`)
            .auth('admin', 'qwerty')
            .send(testUpdateBlogInput)
            .expect(HttpStatusCode.NOT_FOUND_404)

        const blog = await blogsCollection.findOne({ id: createdBlog.body.id })

        expect(blog?.name).toBe(createdBlog.body.name)
        expect(blog?.websiteUrl).not.toBe(testUpdateBlogInput.websiteUrl)
    })
})

describe('/blogs route DELETE tests: ', () => {
    beforeEach(async () => {
        await request.delete(`/testing/all-data`)
    })

    it('DELETE /blogs/:id success', async () => {
        const createdBlog = await blogTestManager.createBlog()

        await request.delete(`${RoutesList.BLOGS}/${createdBlog.body.id}`)
            .auth('admin', 'qwerty')
            .expect(HttpStatusCode.NO_CONTENT_204)

        const blogs = await blogsCollection.find({}).toArray()

        expect(blogs.length).toBe(0)
    })

    it('DELETE /blogs/:id failed::notAuthorized', async () => {
        const createdBlog = await blogTestManager.createBlog()

        await request.delete(`${RoutesList.BLOGS}/${createdBlog.body.id}`)
            .auth('failed', 'password')
            .expect(HttpStatusCode.UNAUTHORIZED_401)

        const blogs = await blogsCollection.find({}).toArray()

        expect(blogs.length).toBe(1)
    })

    it('DELETE /blogs/:id failed::notFound', async () => {
        await blogTestManager.createBlog()

        await request.delete(`${RoutesList.BLOGS}/wrongId`)
            .auth('admin', 'qwerty')
            .expect(HttpStatusCode.NOT_FOUND_404)

        const blogs = await blogsCollection.find({}).toArray()

        expect(blogs.length).toBe(1)
    })
})