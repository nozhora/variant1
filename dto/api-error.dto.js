class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'The user is not authorized');
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static Forbidden(message = 'Access forbidden') {
        return new ApiError(403, message);
    }
}

export { ApiError };