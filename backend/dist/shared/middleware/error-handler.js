"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const app_error_1 = require("../errors/app-error");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof app_error_1.AppError) {
        return res.status(err.statusCode).json({
            code: err.code,
            message: err.message,
            details: err.details,
        });
    }
    console.error(err);
    return res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map