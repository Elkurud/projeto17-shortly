import { nanoid } from "nanoid"
import { db } from "../database/database.connection.js"


export async function addShortUrl(req, res) {
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

export async function getUrlById(req, res) {
    const { id } = req.params

    try {

        const result = await db.query(`
            SELECT * FROM shortened WHERE id=$1
        `, [id])

        if(result.rowCount == 0) return res.sendStatus(404)

        res.status(200).send({
            id: result.rows[0].id,
            shortUrl: result.rows[0].shortenedUrl,
            url: result.rows[0].url
        })
        
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function openShortUrl(req, res) {
    const { shortUrl } = req.params

    try {
        const result = await db.query(`
            SELECT * FROM shortened WHERE "shortenedUrl" =$1
        `, [shortUrl])

        if (result.rowCount == 0) return res.sendStatus(404)

        await db.query(`
            UPDATE shortened SET "visitCount" = "visitCount" + 1 WHERE id=$1
        `, [result.rows[0].id])

        res.redirect(result.rows[0].url)
        
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteShortUrl(req, res) {
    const { id } = req.params
    const { user } = res.locals

    try {

        const result = await db.query(`
            SELECT * FROM shortened WHERE id=$1
        `, [id])

        if(result.rowCount == 0) return res.sendStatus(404)

        if(result.rows[0].userId !== user.id) return res.sendStatus(401)

        await db.query(`
            DELETE FROM shortened WHERE id = $1
        `, [id])

        res.sendStatus(204)
        
    } catch (err) {
        res.status(500).send(err.message)
    }

}