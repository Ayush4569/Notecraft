import "./cron/reset-ai-limits"
import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import cluster from "cluster";
import os from "os";
import { dbConnect } from "./db/db";
import documentRoute from "./routes/documents.routes";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./lib/uploadthing";
import fileRoute from "./routes/file.routes";
import aiRoute from "./routes/ai.routes";
import userRoute from "./routes/user.routes";
import paymentsRoute from "./routes/payment.routes";
import cookieParser from "cookie-parser";

const app: Express = express();
const port = process.env.PORT || 8000;
const cpus = os.cpus().length
const isDev = process.env.NODE_ENV === "development";
if (cluster.isPrimary && !isDev) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork()
    });
}
else {
    dbConnect()

    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : ["http://localhost:3000", "https://notecraft-mu.vercel.app"];

    app.use(cors({
        origin: allowedOrigins,
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true
    }))
    // extra webhook route without express.json()
    app.use("/payment", paymentsRoute.webhookRouter)
    app.use(express.json());
    app.use(cookieParser())
    app.use(express.urlencoded({ extended: false, limit: '20kb' }))

    // health check route
    app.get("/", (req: Request, res: Response) => {

        res.status(200).json({ message: "Welcome to the Notecraft Management API" });
        return;
    });

    // other routes
    app.use("/user", userRoute);
    app.use("/document", documentRoute);
    app.use("/file", fileRoute)
    app.use("/uploadthing", createRouteHandler({ router: uploadRouter }));
    app.use("/ai", aiRoute)
    app.use("/payment", paymentsRoute.router)
    app.listen(port, () => {
        console.log(`server running on port ${port}`);
    });
}

