import {ConfirmationInfoModel} from "./ConfirmationInfoModel";
import {UserDataModel} from "./UserDataModel";

export type UserDbModel = {
    userData: UserDataModel
    confirmationData: ConfirmationInfoModel
}