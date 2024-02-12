import { body } from 'express-validator'
import {blogRepository} from "../../blogs/repository/blogRepository";
import {inputValidationMiddleware} from "../../../app/config/middleware/InputValidationMiddleware";

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
        const existingBlog = await blogRepository.getBlogById(blogId)

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