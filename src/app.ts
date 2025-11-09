import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import os from "os";

import { config } from "./config";
import { errorHandler } from "./middlewares/error.middleware";
import {
  rootRateLimit2,
  rootRateLimit,
} from "./middlewares/rateLimiter.middleware";
import { appRouter } from "./routes/app.routes";
import { connectDatabase, disconnectDatabase } from "./services/prisma.service";

export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    // Security middlewares
    this.app.use(helmet());
    this.app.use(cors(config.cors));
    this.app.use(
      rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
      }),
    );

    // Body parsing middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    if (config.env === "development") {
      this.app.use(morgan("dev"));
    }
  }

  private setupRoutes(): void {
    this.app.use("/api/v1", appRouter);

    // Root route
    this.app.get("/", rootRateLimit2, (req, res) => {
      res.redirect("/api/v1/health");
    });

    // 404 handler for all undefined routes
    this.app.use("*", (req, res) => {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: `Route ${req.originalUrl} not found`,
        errors: ["The requested endpoint does not exist"],
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async connectToMongoDatabase(): Promise<void> {
    try {
      await mongoose.connect(config.mongodb.uri);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
  }

  public async connectToDatabase(): Promise<void> {
    try {
      await connectDatabase();
    } catch (error) {
      await disconnectDatabase();
      console.error("Database connection error:", error);
      process.exit(1);
    }
  }

  //   public listen(): void {
  //     this.app.listen(config.port, () => {
  //       console.log(`Server is running on port ${config.port}`);
  //     });
  //   }

  public listen(): void {
    this.app.listen(config.port, "0.0.0.0", () => {
      const networkInterfaces = os.networkInterfaces();
      const localIP = Object.values(networkInterfaces)
        .flat()
        .find((iface) => iface?.family === "IPv4" && !iface.internal)?.address;

      console.log(`Server is running on:`);
      console.log(`- Local: http://localhost:${config.port}`);
      if (localIP) {
        console.log(`- Network: http://${localIP}:${config.port}`);
      }
    });
  }
}

// Start the server
if (require.main === module) {
  const app = new App();
  app.connectToDatabase().then(() => {
    app.listen();
  });
}
