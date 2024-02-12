import { body } from 'express-validator'
import {inputValidationMiddleware} from "../../../app/config/middleware/InputValidationMiddleware";

const nameValidation = body('name')
    .isString().withMessage('Must be string').trim()
    .isLength({min: 1, max: 15}).withMessage('Not more than 15 symbols, not empty')

const descriptionValidation = body('description')
    .isString().withMessage('Must be string').trim()
    .isLength({min: 1, max: 500}).withMessage('Not more than 500 symbols, not empty')

const websiteUrlValidation = body('websiteUrl')
    .isString().withMessage('Must be string').trim()
    .isLength({min: 1, max: 100}).withMessage('Not more than 100 symbols, not empty')
    .isURL().withMessage('Must be a valid URL')

export const blogInputValidation = () => [nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware]