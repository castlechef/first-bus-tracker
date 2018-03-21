import * as HTTPStatusCodes from 'http-status-codes';

export interface JSONable {
    toJSON: () => object;
}

export type JsonResponse = {
    status: string;
    data: any;
    error?: JsonResponseError;
}

export type JsonResponseError = {
    code: number;
    message: string;
}

export class Response {
    public static factory(data: any, errorCode?: number): JsonResponse {
        const status = (errorCode) ? 'failure' : 'success';
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
