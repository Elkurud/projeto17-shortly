import { Router } from "express";
import { tokenValidate } from "../middlewares/validateToken.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import urlSchema from "../schemas/url.schema.js";
import { getUrlById, openShortUrl, addShortUrl, deleteShortUrl } from "../controllers/url.controller.js";

const urlRouter = Router()

urlRouter.post("/urls/shorten", validateSchema(urlSchema), tokenValidate, addShortUrl)
urlRouter.get("/urls/:id", getUrlById)
urlRouter.get("/urls/open/:shortUrl", openShortUrl)
urlRouter.delete("/urls/:id", tokenValidate, deleteShortUrl)

export default urlRouter