"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./server/db");
const app_1 = require("./app");
// import io from './socket';
// dotenv.config();
const PORT = process.env.PORT || 3000; //port for https
app_1.app.get('/', (req, res) => {
    res.send('hello');
});
app_1.http
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
//# sourceMappingURL=index.js.map