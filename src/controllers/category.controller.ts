import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  private categoryService = new CategoryService();
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mode = await this.categoryService.create(req.body);
      const response = ApiResponse.success(201, "Category created", mode);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  };
}
