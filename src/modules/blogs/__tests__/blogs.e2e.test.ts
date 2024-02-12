import supertest from 'supertest'
import {app} from "../../../app/appSettings";
import {describe} from "node:test";
import {RoutesList} from "../../../app/enums";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";

const request = supertest(app)

describe('blogs GET route tests', () => {
    beforeEach(async () => {
        await request.delete('/testing/all-data')
    })

    it('should return blogs', async () => {
        const payload = {
            name: "romish blog",
            description: "description for romish blog",
            websiteUrl: "https://google.com"
        }

        const createdResponse = await request.post(RoutesList.BLOGS)
            .auth('admin', 'qwerty')
            .send(payload)
            .expect(HttpStatusCode.CREATED_201)

        const createdBody = createdResponse.body

        expect(createdBody).toEqual({
            id: expect.any(String),
            name: payload.name,
            description: payload.description,
            websiteUrl: payload.websiteUrl,
        })

        const responseResult = await request.get(RoutesList.BLOGS)
            .expect(HttpStatusCode.OK_200)

        expect(responseResult.body.length).toBe(1)
        expect(responseResult.body).toEqual([createdBody])
    })
    it('should return blog by id', async () => {
        const payload = {
            name: "romish blog",
            description: "description for romish blog",
            websiteUrl: "https://google.com"
        }

        const createdResponse = await request.post(RoutesList.BLOGS)
            .auth('admin', 'qwerty')
            .send(payload)
            .expect(HttpStatusCode.CREATED_201)

        const createdBody = createdResponse.body

        expect(createdBody).toEqual({
            id: expect.any(String),
            name: payload.name,
            description: payload.description,
            websiteUrl: payload.websiteUrl,
        })

        const responseResult = await request.get(`${RoutesList.BLOGS}/${createdBody.id}`)
            .expect(HttpStatusCode.OK_200)

        expect(responseResult.body).toEqual(createdBody)
    })
    it("should return 404 for non existing blog", async () => {
        const payload = {
            name: "romish blog",
            description: "description for romish blog",
            websiteUrl: "https://google.com"
        }

        const createdResponse = await request.post(RoutesList.BLOGS)
            .auth('admin', 'qwerty')
            .send(payload)
            .expect(HttpStatusCode.CREATED_201)

        const createdBody = createdResponse.body

        expect(createdBody).toEqual({
            id: expect.any(String),
            name: payload.name,
            description: payload.description,
            websiteUrl: payload.websiteUrl,
        })

        await request.get(`${RoutesList.BLOGS}/notExistingBlog`)
            .expect(HttpStatusCode.NOT_FOUND_404)
    })
})

describe("blogs routes POST tests", () => {
    beforeEach(async () => {
        await request.delete('/testing/all-data')
    })
    it("should create new blog", async () => {
        const payload = {
            name: "romish blog",
            description: "description for romish blog",
            websiteUrl: "https://google.com"
        }

        const createdResponse = await request.post(RoutesList.BLOGS)
            .auth('admin', 'qwerty')
            .send(payload)
            .expect(HttpStatusCode.CREATED_201)

        const createdBody = createdResponse.body

        expect(createdBody).toEqual({
            id: expect.any(String),
            name: payload.name,
            description: payload.description,
            websiteUrl: payload.websiteUrl,
        })
    })
    it("should'nt create blog", async () => {
        const wrongPayload = {
            name: "",
            description: "",
            websiteUrl: ""
        }

        await request.post(RoutesList.BLOGS)
            .auth('admin', 'qwerty')
            .send(wrongPayload)
            .expect(HttpStatusCode.BAD_REQUEST_400)
    })
    it("should not create without auth", async () => {
        await request.post(RoutesList.BLOGS)
            .auth('wrongUser', 'wrongPass')
            .expect(HttpStatusCode.UNAUTHORIZED_401)
    })
})

describe("blogs routes UPDATE tests", () => {
    beforeEach(async () => {
        await request.delete('/testing/all-data')
    })
    it('should update blog by id', async () => {
        const payload = {
            name: "romish blog",
            description: "description for romish blog",
            websiteUrl: "https://google.com"
        }

        const createdResponse = await request.post(RoutesList.BLOGS)
            .auth('admin', 'qwerty')
            .send(payload)
            .expect(HttpStatusCode.CREATED_201)

        const createdBody = createdResponse.body

        expect(createdBody).toEqual({
            id: expect.any(String),
            name: payload.name,
            description: payload.description,
            websiteUrl: payload.websiteUrl,
        })

        const responseResult = await request.get(`${RoutesList.BLOGS}/${createdBody.id}`)
            .expect(HttpStatusCode.OK_200)

        expect(responseResult.body).toEqual(createdBody)

        const updatedPayload = {
            name: "romish put",
            description: "description put",
            websiteUrl: "https://google.com/put"
        }

        await request.put(`${RoutesList.BLOGS}/${createdBody.id}`)
            .auth('admin', 'qwerty')
            .send(updatedPayload)
            .expect(HttpStatusCode.NO_CONTENT_204)

        const responseResult2 = await request.get(`${RoutesList.BLOGS}/${createdBody.id}`)
            .expect(HttpStatusCode.OK_200)

        expect(responseResult2.body).toEqual({
            id: expect.any(String),
            ...updatedPayload
        })
    })
    it("should'nt update blog without auth", async () => {
        const payload = {
            name: "romish blog",
            description: "description for romish blog",
            websiteUrl: "https://google.com"
        }

        const createdResponse = await request.post(RoutesList.BLOGS)
            .auth('admin', 'qwerty')
            .send(payload)
            .expect(HttpStatusCode.CREATED_201)

        const createdBody = createdResponse.body

        expect(createdBody).toEqual({
            id: expect.any(String),
            name: payload.name,
            description: payload.description,
            websiteUrl: payload.websiteUrl,
        })

        const updatedPayload = {
            name: "romish put",
            description: "description put",
            websiteUrl: "https://google.com/put"
        }

        await request.put(`${RoutesList.BLOGS}/${createdBody.id}`)
            .auth('wrongUser', 'wrongPass')
            .send(updatedPayload)
            .expect(HttpStatusCode.UNAUTHORIZED_401)
    })
    it("should return 404 for non existing blog", async () => {
        const updatedPayload = {
            name: "romish put",
            description: "description put",
            websiteUrl: "https://google.com/put"
        }

        await request.put(`${RoutesList.BLOGS}/notExistingBlog`)
            .auth('admin', 'qwerty')
            .send(updatedPayload)
            .expect(HttpStatusCode.NOT_FOUND_404)
    })
})
describe("blogs routes DELETE tests", () => {
    beforeEach(async () => {
        await request.delete('/testing/all-data')
    })
    it("should delete blog by id", async () => {
        const payload = {
            name: "romish blog",
            description: "description for romish blog",
            websiteUrl: "https://google.com"
        }

        const createdResponse = await request.post(RoutesList.BLOGS)
            .auth('admin', 'qwerty')
            .send(payload)
            .expect(HttpStatusCode.CREATED_201)

        const createdBody = createdResponse.body

        expect(createdBody).toEqual({
            id: expect.any(String),
            name: payload.name,
            description: payload.description,
            websiteUrl: payload.websiteUrl,
        })

        const responseResult = await request.get(`${RoutesList.BLOGS}/${createdBody.id}`)
            .expect(HttpStatusCode.OK_200)

        expect(responseResult.body).toEqual(createdBody)

        const updatedPayload = {
            name: "romish put",
            description: "description put",
            websiteUrl: "https://google.com/put"
        }

        await request.put(`${RoutesList.BLOGS}/${createdBody.id}`)
            .auth('admin', 'qwerty')
            .send(updatedPayload)
            .expect(HttpStatusCode.NO_CONTENT_204)

        const responseResult2 = await request.get(`${RoutesList.BLOGS}/${createdBody.id}`)
            .expect(HttpStatusCode.OK_200)

        expect(responseResult2.body).toEqual({
            id: expect.any(String),
            ...updatedPayload
        })

        await request.delete(`${RoutesList.BLOGS}/${createdBody.id}`)
            .auth('admin', 'qwerty')
            .expect(HttpStatusCode.NO_CONTENT_204)
    })
    it("shouldn't delete blog for non existing blog", async () => {
        await request.delete(`${RoutesList.BLOGS}/nonExistingBody`)
            .auth('admin', 'qwerty')
            .expect(HttpStatusCode.NOT_FOUND_404)
    })
    it("shouldn't delete blog without auth", async () => {
        const payload = {
            name: "romish blog",
            description: "description for romish blog",
            websiteUrl: "https://google.com"
        }

        const createdResponse = await request.post(RoutesList.BLOGS)
            .auth('admin', 'qwerty')
            .send(payload)
            .expect(HttpStatusCode.CREATED_201)

        const createdBody = createdResponse.body

        expect(createdBody).toEqual({
            id: expect.any(String),
            name: payload.name,
            description: payload.description,
            websiteUrl: payload.websiteUrl,
        })

        await request.delete(`${RoutesList.BLOGS}/${createdBody.id}`)
            .auth('wrongUser', 'wrongPass')
            .expect(HttpStatusCode.UNAUTHORIZED_401)
    })
})