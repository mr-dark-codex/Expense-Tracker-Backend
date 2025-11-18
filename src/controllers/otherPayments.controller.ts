import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { OtherPaymentsService } from "../services/otherPayments.service";
import { TransactionsService } from "../services/transactions.service";
import { prisma } from "../services/prisma.service";

export class OtherPaymentsController {
  private otherPaymentsService = new OtherPaymentsService();
  private transactionsService = new TransactionsService();

  createV2 = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Create transaction first
        const transaction = await this.transactionsService.createv2(
          req.body,
          tx,
        );

        // If otherspayment flag is true, create other payment
        if (req.body.otherspayment === true) {
          const otherPayment = await this.otherPaymentsService.createWithTx(
            req.body,
            tx,
          );
          return { transaction, otherPayment };
        }

        return { transaction };
      });

      const response = ApiResponse.success(
        201,
        req.body.otherspayment
          ? "Other payment created along with transaction"
          : "Transaction created",
        result,
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

  updatePaidAmount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Create transaction first
        const transaction = await this.transactionsService.createv2(
          req.body,
          tx,
        );

        // If otherspayment flag is true, update paid amount
        if (req.body.otherspayment === true) {
          const otherPayment = await this.otherPaymentsService.updatePaidAmount(
            req.params.id,
            req.body.amount,
            tx,
          );
          return { transaction, otherPayment };
        }

        return { transaction };
      });

      const response = ApiResponse.success(
        200,
        req.body.otherspayment
          ? "Payment processed successfully"
          : "Transaction created",
        result,
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
