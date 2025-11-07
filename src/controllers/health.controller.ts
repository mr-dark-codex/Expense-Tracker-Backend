import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../services/prisma.service";

export class HealthController {
  public async getHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const startTime = Date.now();

      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      const dbResponseTime = Date.now() - startTime;

      const healthData = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: process.env.npm_package_version || "1.0.0",
        database: {
          status: "connected",
          responseTime: `${dbResponseTime}ms`,
        },
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        },
      };

      const response = ApiResponse.success(200, "API is healthy", healthData);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      const response = ApiResponse.error(503, "Service unavailable", [
        "Database connection failed",
      ]);
      return res.status(response.statusCode).json(response);
    }
  }
}
