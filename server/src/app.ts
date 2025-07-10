import "./cron/reset-ai-limits"
import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnect } from "./db/db";
import documentRoute from "./routes/documents.routes";
import uploadRoute from "./routes/upload.routes";
import fileRoute from "./routes/file.routes";
import aiRoute from "./routes/ai.routes";
import userRoute from "./routes/user.routes";
import paymentsRoute from "./routes/payment.routes";
import cookieParser from "cookie-parser";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

dbConnect()

app.use(cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))
app.use("/payment", paymentsRoute.webhookRouter)
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: false, limit: '20kb' }))


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to the Document Management API" });
    return;
});

app.use("/user", userRoute);
app.use("/document", documentRoute);
app.use("/file", fileRoute)
app.use("/upload", uploadRoute)
app.use("/ai", aiRoute)
app.use("/payment", paymentsRoute.router)
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});

