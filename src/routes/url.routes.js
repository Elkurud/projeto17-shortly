import { Router } from "express";
import { tokenValidate } from "../middlewares/validateToken.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import urlSchema from "../schemas/url.schema.js";
import { shortenUrl } from "../controllers/url.controller.js";

const urlRouter = Router()

urlRouter.post("/urls/shorten", validateSchema(urlSchema), tokenValidate, shortenUrl)

export default urlRouter