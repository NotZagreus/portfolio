import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import projectRoutes from "./presentationlayer/projectRoutes";
import commentRoutes from "./presentationlayer/commentRoutes";
import bodyParser from "body-parser";
import nodemailer, { SentMessageInfo } from "nodemailer"; // Import SentMessageInfo type

dotenv.config({ path: "../.env" });

const app = express();
const BACKEND_PORT = process.env.BACKEND_PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email sending route
app.post("/send", (req: Request, res: Response) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.send("Email sent: " + info.response);
  });
});

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to my Portfolio");
});

// Start the backend server
app.listen(BACKEND_PORT, () => {
  console.log(`Backend is running on http://localhost:${BACKEND_PORT}`);
});
