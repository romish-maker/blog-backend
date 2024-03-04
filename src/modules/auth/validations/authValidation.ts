import { body } from 'express-validator'
import {inputValidationMiddleware} from "../../../app/config/middleware/InputValidationMiddleware";

const loginOrEmailValidation = body('loginOrEmail')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Should be a not empty string')

const passwordValidation = body('password')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Should be a not empty string')

export const authPostValidation = () => [ loginOrEmailValidation, passwordValidation, inputValidationMiddleware ]