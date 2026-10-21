export class ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;

    constructor(success: boolean, message: string, data?: T) {
        this.success = success;
        this.message = message;
        if (data !== undefined) this.data = data;
    }

    static ok<T>(data: T, message = 'Success'): ApiResponse<T> {
        return new ApiResponse(true, message, data);
    }

    static created<T>(data: T, message = 'Created'): ApiResponse<T> {
        return new ApiResponse(true, message, data);
    }

    static fail(message: string): ApiResponse<null> {
        return new ApiResponse(false, message);
    }
}
