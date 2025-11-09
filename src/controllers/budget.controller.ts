import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { BudgetService } from "../services/budget.service";

export class BudgetController {
  private budgetService = new BudgetService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const budget = await this.budgetService.create(req.body);
      const response = ApiResponse.success(201, "Budget created", budget);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const budgets = await this.budgetService.getAll();
      const response = ApiResponse.success(200, "Budgets retrieved", budgets);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const budget = await this.budgetService.getById(req.params.id);
      if (!budget) {
        const response = ApiResponse.error(404, "Budget not found");
        return res.status(response.statusCode).json(response);
      }
      const response = ApiResponse.success(200, "Budget retrieved", budget);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const budget = await this.budgetService.update(req.params.id, req.body);
      const response = ApiResponse.success(200, "Budget updated", budget);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.budgetService.delete(req.params.id);
      const response = ApiResponse.success(200, "Budget deleted");
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };
}
