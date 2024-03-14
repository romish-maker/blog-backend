import { body } from 'express-validator'
import {inputValidationMiddleware} from "../../../app/config/middleware/InputValidationMiddleware";
import {blogsQueryRepository} from "../../blogs/repository/blogsQueryRepository";
import {NextFunction} from "express";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {isValidId} from "../../common/validations";

const titleValidation = body('title')
    .isString().withMessage('Must be string').trim()
    .isLength({min: 1, max: 30}).withMessage('Not more than 30 symbols, not empty')

const shortDescriptionValidation = body('shortDescription')
    .isString().withMessage('Must be string').trim()
    .isLength({min: 1, max: 100}).withMessage('Not more than 100 symbols, not empty')

const contentValidation = body('content')
    .isString().withMessage('Must be string').trim()
    .isLength({min: 1, max: 100}).withMessage('Not more than 100 symbols, not empty')

const blogIdValidation = body('blogId')
    .isString().withMessage('Should be a string')
    .custom(async (blogId: string) => {
        const existingBlog = await blogsQueryRepository.getBlogById(blogId)

        if (!existingBlog) {
            throw new Error('There is no blogs with this id')
        }
    })

export const postInputValidation = () => [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
]

export const createPostFromBlogValidation = () => [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
]

export function postIdValidationMW(req: any, res: any, next: NextFunction) {
    if (!isValidId(req.params.postId)) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)

        return
    }

    next()
}