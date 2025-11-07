import { Request, Response, NextFunction } from "express";
import { TransactionModeService } from "../services/transactionMode.service";
import { ApiResponse } from "../utils/ApiResponse";

export class TransactionModeController {
  private transactionModeService = new TransactionModeService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mode = await this.transactionModeService.create(req.body);
      const response = ApiResponse.success(
        201,
        "Transaction mode created",
        mode,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const modes = await this.transactionModeService.findAll();
      const response = ApiResponse.success(
        200,
        "Transaction modes retrieved",
        modes,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mode = await this.transactionModeService.findById(req.params.id);
      if (!mode) {
        const response = ApiResponse.error(404, "Transaction mode not found");
        return res.status(response.statusCode).json(response);
      }
      const response = ApiResponse.success(
        200,
        "Transaction mode retrieved",
        mode,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mode = await this.transactionModeService.update(
        req.params.id,
        req.body,
      );
      const response = ApiResponse.success(
        200,
        "Transaction mode updated",
        mode,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.transactionModeService.delete(req.params.id);
      const response = ApiResponse.success(200, "Transaction mode deleted");
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };
}
