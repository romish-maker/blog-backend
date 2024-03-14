import {inputValidationMiddleware} from "../../../app/config/middleware/InputValidationMiddleware";
import {body} from "express-validator";

const commentValidation = body('content').isString().isLength({min: 20, max: 300})

export const commentInputValidation = () => [ commentValidation, inputValidationMiddleware ]
