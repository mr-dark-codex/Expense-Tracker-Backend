import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { TransactionsService } from "../services/transactions.service";

export class TransactionsController {
  private transactionsService = new TransactionsService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await this.transactionsService.create(req.body);
      const response = ApiResponse.success(
        201,
        "Transaction created",
        transaction,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = await this.transactionsService.getAll();
      const response = ApiResponse.success(
        200,
        "Transactions retrieved",
        transactions,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await this.transactionsService.getById(req.params.id);
      if (!transaction) {
        const response = ApiResponse.error(404, "Transaction not found");
        return res.status(response.statusCode).json(response);
      }
      const response = ApiResponse.success(
        200,
        "Transaction retrieved",
        transaction,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction = await this.transactionsService.update(
        req.params.id,
        req.body,
      );
      const response = ApiResponse.success(
        200,
        "Transaction updated",
        transaction,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.transactionsService.delete(req.params.id);
      const response = ApiResponse.success(200, "Transaction deleted");
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };
}
