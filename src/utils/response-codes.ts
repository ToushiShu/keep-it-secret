const RESPONSE_CODES = {
    VALID: {
        code: 200
    },
    NOT_FOUND: {
        code: 404,
        message: "Resource not found"
    },
    INVALID_REQUEST: {
        code: 422
    },
    INTERNAL_ERROR: {
        code: 500,
        message: "Something went wrong :("
    }
};

export default RESPONSE_CODES;