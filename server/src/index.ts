import app from "./app.js";
import dotenv from "dotenv";
import connectDatabase from "./config/database.js";
import { createServer } from "http";

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    
    process.exit(1);
});

dotenv.config();

const PORT = process.env.PORT || 4001;

connectDatabase();

const httpServer = createServer(app);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server Working 4.0!"
    })
});

const server = httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err: any) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});