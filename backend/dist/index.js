"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const projectRoutes_1 = __importDefault(require("./presentationlayer/projectRoutes"));
const commentRoutes_1 = __importDefault(require("./presentationlayer/commentRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const nodemailer_1 = __importDefault(require("nodemailer")); // Import SentMessageInfo type
dotenv_1.default.config({ path: "../.env" });
const app = (0, express_1.default)();
const BACKEND_PORT = process.env.BACKEND_PORT;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "10mb", extended: true }));
// Connect to MongoDB
(0, db_1.default)()
    .then(() => {
    console.log("MongoDB connected");
})
    .catch((err) => {
    console.error("MongoDB connection error:", err);
});
// Nodemailer transporter setup
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Email sending route
app.post("/send", (req, res) => {
    const { to, subject, text } = req.body;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.send("Email sent: " + info.response);
    });
});
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});
// Routes
app.use("/api/projects", projectRoutes_1.default);
app.use("/api/comments", commentRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to my Portfolio");
});
// Start the backend server
app.listen(BACKEND_PORT, () => {
    console.log(`Backend is running on http://localhost:${BACKEND_PORT}`);
});
