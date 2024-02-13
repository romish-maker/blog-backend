import {app} from "../../../../app/appSettings";
import {RoutesList} from "../../../../app/enums";
import {HttpStatusCode} from "../../../common/enums/HttpsStatusCodes";
import {blogPayload} from "../../mocks";

const supertest = require('supertest')

const request = supertest(app)

class BlogTestManager {
    async createBlog() {
        const createdResponse = await request.post(RoutesList.BLOGS)
            .auth('admin', 'qwerty')
            .send(blogPayload)
            .expect(HttpStatusCode.CREATED_201)

        const createdBody = createdResponse.body

        expect(createdBody).toEqual({
            id: expect.any(String),
            name: blogPayload.name,
            description: blogPayload.description,
            websiteUrl: blogPayload.websiteUrl,
        })

        return createdBody
    }
}

export const blogTestManager = new BlogTestManager()