import { Router } from "express";
import { tokenValidate } from "../middlewares/validateToken.middleware.js";
import { getUser, getRanking } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/users/me", tokenValidate, getUser)
userRouter.get("/ranking", getRanking)

export default userRouter