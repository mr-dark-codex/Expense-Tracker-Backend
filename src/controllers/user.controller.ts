import { Request, Response, NextFunction } from "express";
import { User, UserRole } from "../models/user.model";
import { CustomError } from "../utils/customError";
import jwt from "jsonwebtoken";
import { config } from "../config";

export class UserController {
//   public async register(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { email, password } = req.body;

//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         throw new CustomError("Email already registered", 400);
//       }

//       const user = await User.create({
//         email,
//         password,
//         role: UserRole.USER,
//       });

//       const token = this.generateToken(user.id, user.role);

//       res.status(201).json({
//         success: true,
//         data: {
//           user: {
//             id: user.id,
//             email: user.email,
//             role: user.role,
//           },
//           token,
//         },
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   public async login(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { email, password } = req.body;

//       const user = await User.findOne({ email });
//       if (!user) {
//         throw new CustomError("Invalid credentials", 401);
//       }

//       const isPasswordValid = await user.comparePassword(password);
//       if (!isPasswordValid) {
//         throw new CustomError("Invalid credentials", 401);
//       }

//       const token = this.generateToken(user.id, user.role);

//       res.json({
//         success: true,
//         data: {
//           user: {
//             id: user.id,
//             email: user.email,
//             role: user.role,
//           },
//           token,
//         },
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   public async getProfile(req: Request, res: Response, next: NextFunction) {
//     try {
//       const user = await User.findById(req.user?.id).select("-password");
//       if (!user) {
//         throw new CustomError("User not found", 404);
//       }

//       res.json({
//         success: true,
//         data: {
//           user,
//         },
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

  public async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find().select("-password");

      res.json({
        success: true,
        data: {
          users,
        },
      });
    } catch (error) {
      next(error);
    }
  }

//   private generateToken(userId: string, role: UserRole): string {
//     return jwt.sign({ id: userId, role }, config.jwt.secret, {
//       expiresIn: config.jwt.expiresIn,
//     });
//   }
}
