import * as HTTPStatusCodes from 'http-status-codes';

export interface Jsonable {
    toJson(): object;
}

export interface JsonResponse {
    status: string;
    data: any;
    error?: JsonResponseError;
}

export interface JsonResponseError {
    code: number;
    message: string;
}

export class Response {
    public static factory(success: boolean, data: any, errorCode?: number): JsonResponse {
        const status = success ? 'success' : 'failure';
        const res: JsonResponse = {
            status,
            data,
        };
        if (errorCode) {
            res.error = {
                code: errorCode,
                message: HTTPStatusCodes.getStatusText(errorCode),
            };
        }
        return res;
    }
}
