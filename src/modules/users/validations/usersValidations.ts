import {body} from "express-validator";
import {usersCollection} from "../../../app/config/db";
import {inputValidationMiddleware} from "../../../app/config/middleware/InputValidationMiddleware";

const loginValidation = body("login")
    .isString().isLength({
        min: 3,
        max: 10
    }).matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login should be latin letters and numbers')
    .custom(uniqueLoginCheck).withMessage('This login is already exists')

const emailValidation = body('email')
    .isString()
    .notEmpty()
    .isEmail().withMessage('Should be a valid email')
    .custom(uniqueEmailCheck).withMessage('This email is already exists')

const passwordValidation = body("password").isLength({min: 6, max: 20})

export const userInputValidation = () => [
    emailValidation,
    loginValidation,
    passwordValidation,
    inputValidationMiddleware,
]

async function uniqueLoginCheck(login: string) {
    const user = await usersCollection.findOne({ login: login })

    if (user) {
        throw new Error(`This login is already exists`)
    }
}

async function uniqueEmailCheck(email: string) {
    const user = await usersCollection.findOne({ 'userData.email': email })
    if (user) {
        throw new Error(`This login is already exists`)
    }
}