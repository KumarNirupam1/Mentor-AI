class ApiError extends Error {
    statusCode: number;
    errors: unknown[];
    success: boolean;
    declare message: string;

    constructor(
        statusCode: number,
        messsage: string,
        errors: unknown[] = [],
        stack: ""
    ) {
        super(messsage);
        this.statusCode = statusCode;
        this.message = messsage;
        this.errors = errors;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            errors: this.errors,
            success: this.success,
        };
    }
}

export { ApiError };
