import { ResultToRouter } from '../types'
import { ResultToRouterStatus } from "../enums/ResultToRuterStatus";

export const operationsResultService = {
    generateResponse<T>(status: ResultToRouterStatus, data?: T | null, errorMessage?: string): ResultToRouter<T> {
        return {
            status,
            data: data as T,
            errorMessage,
        }
    }
}
