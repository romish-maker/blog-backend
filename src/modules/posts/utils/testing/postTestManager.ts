import {app} from "../../../../app/appSettings";
import {RoutesList} from "../../../../app/enums";
import {HttpStatusCode} from "../../../common/enums/HttpsStatusCodes";
import {postPayload} from "../../mocks";

const supertest = require('supertest')

const request = supertest(app)

class PostTestManager {
    async createPost() {
        const createdResponse = await request.post(RoutesList.POSTS)
            .auth('admin', 'qwerty')
            .send(postPayload)
            .expect(HttpStatusCode.CREATED_201)

        const createdBodyPost = createdResponse.body

        expect(createdBodyPost).toEqual({
            id: expect.any(String),
            title: postPayload.title,
            shortDescription: postPayload.shortDescription,
            content: postPayload.content,
            blogId: postPayload.blogId,
            blogName: createdBodyPost.blogName
        })

        return createdBodyPost
    }
}

export const postTestManager = new PostTestManager()