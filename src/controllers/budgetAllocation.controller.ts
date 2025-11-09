import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { BudgetAllocationService } from "../services/budgetAllocation.service";

export class BudgetAllocationController {
  private budgetAllocationService = new BudgetAllocationService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allocation = await this.budgetAllocationService.create(req.body);
      const response = ApiResponse.success(
        201,
        "Budget allocation created",
        allocation,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allocations = await this.budgetAllocationService.getAll();
      const response = ApiResponse.success(
        200,
        "Budget allocations retrieved",
        allocations,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allocation = await this.budgetAllocationService.getById(
        req.params.id,
      );
      if (!allocation) {
        const response = ApiResponse.error(404, "Budget allocation not found");
        return res.status(response.statusCode).json(response);
      }
      const response = ApiResponse.success(
        200,
        "Budget allocation retrieved",
        allocation,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allocation = await this.budgetAllocationService.update(
        req.params.id,
        req.body,
      );
      const response = ApiResponse.success(
        200,
        "Budget allocation updated",
        allocation,
      );
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.budgetAllocationService.delete(req.params.id);
      const response = ApiResponse.success(200, "Budget allocation deleted");
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };
}
