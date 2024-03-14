import {ObjectId} from "mongodb";

export const isValidId = (id: string) => ObjectId.isValid(id)
