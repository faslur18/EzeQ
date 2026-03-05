"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const v1_1 = __importDefault(require("./routes/v1"));
const env_1 = require("./config/env");
const error_handler_1 = require("./shared/middleware/error-handler");
const not_found_1 = require("./shared/middleware/not-found");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_1.env.frontendUrl,
    credentials: true,
}));
app.use(express_1.default.json());
app.use('/api/v1', v1_1.default);
app.use('/', v1_1.default);
app.get('/', (req, res) => {
    res.json({
        message: 'EzeQ backend is running',
        version: 'v1',
        timestamp: new Date().toISOString()
    });
});
app.use(not_found_1.notFoundHandler);
app.use(error_handler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map