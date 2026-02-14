"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const zxcvbn_1 = __importDefault(require("zxcvbn"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/check-password', (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    const result = (0, zxcvbn_1.default)(password);
    res.json(result);
});
app.get('/', (req, res) => {
    res.send('Backend with TypeScript, Express, CORS, and zxcvbn');
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
