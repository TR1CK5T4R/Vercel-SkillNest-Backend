class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", stack = "",
        errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.stack = stack;
        this.errors = errors;
        this.success = false;
        this.data = null;
    }
}

export default ApiError;    