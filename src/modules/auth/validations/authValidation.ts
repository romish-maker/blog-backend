import { body } from 'express-validator'
import {inputValidationMiddleware} from "../../../app/config/middleware/InputValidationMiddleware";
import {usersCollection} from "../../../app/config/db";

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

const codeValidation = body('code')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Should be a not empty string')

const emailValidation = body('email')
    .isString()
    .notEmpty()
    .isEmail().withMessage('Should be a valid email')
    .custom(hasEmailCheck).withMessage('You have not registered yet')

export const authPostValidation = () => [ loginOrEmailValidation, passwordValidation, inputValidationMiddleware ]
export const authCodeValidation = () => [ codeValidation, inputValidationMiddleware ]
export const resentEmailValidation = () => [ emailValidation, inputValidationMiddleware ]


async function hasEmailCheck(email: string) {
    const user = await usersCollection.findOne({ 'userData.email': email })
    if (!user) {
        throw new Error(`You have not registered yet`)
    }
}