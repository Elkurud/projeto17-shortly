import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { userSchema, loginSchema } from "../schemas/auth.schema.js";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signin", validateSchema(loginSchema), signIn)
authRouter.post("/signup", validateSchema(userSchema), signUp)
authRouter.post("/signout", signOut)

export default authRouter
