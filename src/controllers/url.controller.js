import { nanoid } from "nanoid"
import { db } from "../database/database.connection.js"


export async function shortenUrl(req, res) {
    const { url } = req.body
    const { id } = res.locals.user

    const shortenedUrl = nanoid(8)

    try {

        const result = await db.query(`
            INSERT INTO shortened (url, "shortenedUrl", "userId") VALUES ($1, $2, $3) RETURNING id
        `, [url, shortenedUrl, id])

        res.status(201).send({
            id: result.rows[0].id,
            shortUrl: shortenedUrl
        })
        
    } catch (err) {
        res.status(500).send(err.message)
    }
}