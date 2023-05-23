import { db } from "../database/database.connection.js"

export async function getUser(req, res) {
    const { user } = res.locals

    try {

        const visitCount = await db.query(`
            SELECT SUM("visitCount") FROM shortened WHERE "userId" =$1
        `, [user.id])
        
        const urls = await db.query(`
            SELECT * FROM shortened WHERE "userId" =$1
        `, [user.id])

        const urlList = urls.rows.map((f) => {
            return {
                id: f.id,
                shortUrl: f.shortenedUrl,
                url: f.url,
                visitCount: f.visitCount
            }
        })

        

        res.status(200).send({
            id: user.id,
            name: user.name,
            visitCount: `${visitCount.rows[0].sum == 0 ? 0 : visitCount.rows[0].sum}`,
            shortenedUrls: urlList
        })

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getRanking(req, res) {

    try {

        const result = await db.query(`
        SELECT users.id, users.name, COUNT(shortened.id) as "linksCount",
        COALESCE(SUM(shortened."visitCount"), 0) as "visitCount"
        FROM users
        LEFT JOIN shortened ON shortened."userId" = users.id
        GROUP BY users.id, users.name
        ORDER BY "visitCount" DESC
        LIMIT 10;
        `)
        console.log(result)

        res.send(result.rows)
        
    } catch (err) {
        res.status(500).send(err.message)
    }
}