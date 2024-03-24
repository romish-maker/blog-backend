import {Router, Response} from "express";
import {RequestBody, RequestParams, RequestQuery} from "../../common/types";
import {HttpStatusCode} from "../../common/enums/HttpsStatusCodes";
import {QueryUserInputModel} from "../models/QueryUserInputModel";
import {usersQueryRepository} from "../repository/usersQueryRepository";
import {UserInputModel} from "../models/UserInputModel";
import {UsersServices} from "../services/UsersServices";
import {authMiddleware} from "../../../app/config/middleware/authMiddleware";
import {userInputValidation} from "../validations/usersValidations";

export const usersRouter = Router()

usersRouter.get('/', authMiddleware, async (req: RequestQuery<QueryUserInputModel>, res: Response) => {
    const sortData = {
        pageNumber: isNaN(Number(req.query.pageNumber)) ? 1 : Number(req.query.pageNumber),
        pageSize: isNaN(Number(req.query.pageSize)) ? 10 : Number(req.query.pageSize),
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc',
        searchEmailTerm: req.query.searchEmailTerm ?? null,
        searchLoginTerm: req.query.searchLoginTerm ?? null,
    }


    const users = await usersQueryRepository.getUsers(sortData)

    res.status(HttpStatusCode.OK_200).send(users)
})

usersRouter.post('/', authMiddleware, userInputValidation(), async (req: RequestBody<UserInputModel>, res: Response) => {
    const createdUserBody = {
        login: req.body.login,
        password: req.body.password,
        email: req.body.email
    }

    const userId = await UsersServices.createUser(createdUserBody)

    if (!userId) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    const newUser = await usersQueryRepository.getUserById(userId)

    res.status(HttpStatusCode.CREATED_201).send(newUser)
})

usersRouter.delete('/:id', authMiddleware, async (req: RequestParams<{ id: string }>, res: Response) => {
    const userId = req.params.id

    const newUser = await UsersServices.deleteUser(userId)

    if (!newUser) {
        res.sendStatus(HttpStatusCode.NOT_FOUND_404)
        return
    }

    res.status(HttpStatusCode.NO_CONTENT_204).send(newUser)
})