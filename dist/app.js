'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = exports.app = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const user_router_1 = __importDefault(require("./routes/user/user.router"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const deeplink_router_1 = __importDefault(require("./routes/user/deeplink/r/deeplink.router"));
const conference_router_1 = __importDefault(require("./routes/user/conference/conference.router"));
const profile_router_1 = __importDefault(require("./routes/user/profile/profile.router"));
const event_router_1 = __importDefault(require("./routes/user/conference/event.router"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
exports.app = app;
let http = (0, http_1.createServer)(app);
exports.http = http;
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://192.168.64.144:3000"],
    credentials: true,
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
// app.use(express.urlencoded({extended: true}));
app.use(body_parser_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use('/', user_router_1.default);
app.use('/applink/r', deeplink_router_1.default);
app.use('/:id/conferences', conference_router_1.default);
app.use('/:id/conferences/:confId/events', event_router_1.default);
app.use('/:id/profile', profile_router_1.default);
//# sourceMappingURL=app.js.map