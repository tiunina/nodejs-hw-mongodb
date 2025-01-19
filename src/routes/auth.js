import { Router } from 'express';
import { validateBody } from '../utils/validateBody.js';
import {
  authRegisterSchema,
  authLoginSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import * as authController from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(authController.registerController),
);

authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  ctrlWrapper(authController.loginController),
);

authRouter.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(authController.requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authController.resetPasswordController),
);

authRouter.get('/verify', ctrlWrapper(authController.verifyController));

authRouter.post('/refresh', ctrlWrapper(authController.refreshTokenController));

authRouter.post('/logout', ctrlWrapper(authController.logoutController));

export default authRouter;
