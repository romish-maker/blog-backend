import supertest from 'supertest'
import {app} from "../../../app/appSettings";
import {describe} from "node:test";
import {RoutesList} from "../../../app/enums";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {blogTestManager} from "../../blogs/utils/testing/blogTestManager";
import {blogPayload} from "../../blogs/mocks";
import {postTestManager} from "../utils/testing/postTestManager";
import {db} from "../../blogs/repository/blogRepository";
import {postPayload} from "../mocks";

const request = supertest(app)

describe('posts GET route tests', () => {
    beforeEach(async () => {
        await request.delete('/testing/all-data')
        db.blogs.push(blogPayload)
    })
    it('should return posts', async () => {
        await blogTestManager.createBlog()
        await postTestManager.createPost()

        await request.get(RoutesList.POSTS)
            .expect(HttpStatusCode.OK_200)
    })
    it('should return post by id', async () => {
        const createdPost = await postTestManager.createPost()

        const responseResult = await request.get(`${RoutesList.POSTS}/${createdPost.id}`)
            .expect(HttpStatusCode.OK_200)

        expect(responseResult.body).toEqual(createdPost)
    })
    it("should return 404 for non existing blog", async () => {
        await postTestManager.createPost()
        await request.get(`${RoutesList.BLOGS}/notExistingPost`)
            .expect(HttpStatusCode.NOT_FOUND_404)
    })
})

describe("post routes POST tests", () => {
    beforeEach(async () => {
        await request.delete('/testing/all-data')
        db.blogs.push(blogPayload)
    })

    it("should create new blog", async () => {
        await postTestManager.createPost()

    })
    it("should'nt create blog", async () => {
        const wrongPayload = {
            title: "",
            shortDescription: "",
            content: "",
            blogId: ""
        }

        await request.post(RoutesList.POSTS)
            .auth('admin', 'qwerty')
            .send(wrongPayload)
            .expect(HttpStatusCode.BAD_REQUEST_400)
    })
    it("should not create without auth", async () => {
        await request.post(RoutesList.POSTS)
            .auth('wrongUser', 'wrongPass')
            .expect(HttpStatusCode.UNAUTHORIZED_401)
    })
})

describe("post routes UPDATE tests", () => {
    beforeEach(async () => {
        await request.delete('/testing/all-data')
        db.blogs.push(blogPayload)
    })
    it('should update post by id', async () => {
        const createdPost = await postTestManager.createPost()

        const responseResult = await request.get(`${RoutesList.POSTS}/${createdPost.id}`)
            .expect(HttpStatusCode.OK_200)

        expect(responseResult.body).toEqual(createdPost)

        await request.put(`${RoutesList.POSTS}/${createdPost.id}`)
            .auth('admin', 'qwerty')
            .send({...postPayload})
            .expect(HttpStatusCode.NO_CONTENT_204)

        const responseResult2 = await request.get(`${RoutesList.POSTS}/${createdPost.id}`)
            .expect(HttpStatusCode.OK_200)

        expect(responseResult2.body).toEqual({
            id: expect.any(String),
            ...postPayload,
            blogName: responseResult.body.blogName
        })
    })
    it("should'nt create post", async () => {
        const wrongPayload = {
            title: "",
            shortDescription: "",
            content: "",
            blogId: ""
        }

        await request.post(RoutesList.POSTS)
            .auth('admin', 'qwerty')
            .send(wrongPayload)
            .expect(HttpStatusCode.BAD_REQUEST_400)
    })
    it("should not create without auth", async () => {
        await request.post(RoutesList.POSTS)
            .auth('wrongUser', 'wrongPass')
            .expect(HttpStatusCode.UNAUTHORIZED_401)
    })
})

describe("post routes DELETE tests", () => {
    beforeEach(async () => {
        await request.delete('/testing/all-data')
        db.blogs.push(blogPayload)
    })
    it("should delete post by id", async () => {
        const createdPost = await postTestManager.createPost()

        const responseResult = await request.get(`${RoutesList.POSTS}/${createdPost.id}`)
            .expect(HttpStatusCode.OK_200)

        expect(responseResult.body).toEqual(createdPost)

        await request.put(`${RoutesList.POSTS}/${createdPost.id}`)
            .auth('admin', 'qwerty')
            .send({...postPayload})
            .expect(HttpStatusCode.NO_CONTENT_204)

        const responseResult2 = await request.get(`${RoutesList.POSTS}/${createdPost.id}`)
            .expect(HttpStatusCode.OK_200)

        expect(responseResult2.body).toEqual({
            id: expect.any(String),
            ...postPayload,
            blogName: responseResult.body.blogName
        })

        await request.delete(`${RoutesList.POSTS}/${createdPost.id}`)
            .auth('admin', 'qwerty')
            .expect(HttpStatusCode.NO_CONTENT_204)
    })
    it("should'nt create post", async () => {
        const wrongPayload = {
            title: "",
            shortDescription: "",
            content: "",
            blogId: ""
        }

        await request.post(RoutesList.POSTS)
            .auth('admin', 'qwerty')
            .send(wrongPayload)
            .expect(HttpStatusCode.BAD_REQUEST_400)
    })
    it("should not create without auth", async () => {
        await request.post(RoutesList.POSTS)
            .auth('wrongUser', 'wrongPass')
            .expect(HttpStatusCode.UNAUTHORIZED_401)
    })
})
