import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validator.middleware";
import { userValidations } from "../validators/user.validator";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../models/user.model";

const router = Router();
const userController = new UserController();

// Public routes
// router.post('/register', validate(userValidations.register), userController.register);
// router.post('/login', validate(userValidations.login), userController.login);

// // Protected routes
// router.get(
//   '/profile',
//   authenticate,
//   userController.getProfile
// );

// // Admin routes
// router.get(
//   '/users',
//   authenticate,
//   authorize(UserRole.ADMIN),
//   userController.getAllUsers
// );

router.get('/test', (req, res) => {
    res.json({ message: 'User route is working!' });
});

export { router as userRouter };
