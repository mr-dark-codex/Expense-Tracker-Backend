import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { OtherPaymentsService } from "../services/otherPayments.service";

export class OtherPaymentsController {
  private otherPaymentsService = new OtherPaymentsService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const otherPayment = await this.otherPaymentsService.create(req.body);
      const response = ApiResponse.success(
        201,
        "Other payment created",
        otherPayment,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const otherPayments = await this.otherPaymentsService.getAll();
      const response = ApiResponse.success(
        200,
        "Other payments retrieved",
        otherPayments,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const otherPayment = await this.otherPaymentsService.getById(
        req.params.id,
      );
      if (!otherPayment) {
        const response = ApiResponse.error(404, "Other payment not found");
        return res.status(response.statusCode).json(response);
      }
      const response = ApiResponse.success(
        200,
        "Other payment retrieved",
        otherPayment,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const otherPayment = await this.otherPaymentsService.update(
        req.params.id,
        req.body,
      );
      const response = ApiResponse.success(
        200,
        "Other payment updated",
        otherPayment,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.otherPaymentsService.delete(req.params.id);
      const response = ApiResponse.success(200, "Other payment deleted");
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };
}
